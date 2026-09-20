import { ProblemCluster, IProblemCluster } from '../../models/ProblemCluster.js';
import { ProblemReport, IProblemReport } from '../../models/ProblemReport.js';
import { aiService } from '../ai/index.js';

export interface DeduplicationMatchResult {
  isDuplicate: boolean;
  clusterId?: string;
  clusterTitle?: string;
  existingReportId?: string;
  highestSimilarity: number;
  explanation: string;
  candidates: Array<{
    reportId: string;
    clusterId?: string;
    title: string;
    similarity: number;
    district: string;
  }>;
}

export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  if (vecA.length !== vecB.length) return 0;
  const len = vecA.length;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(1, similarity));
}

export class DeduplicationEngine {
  private threshold: number;

  constructor() {
    this.threshold = parseFloat(process.env.DEDUP_SIMILARITY_THRESHOLD || '0.80');
  }

  async checkDuplicates(
    title: string,
    description: string,
    district: string,
    category: string,
    newEmbedding?: number[]
  ): Promise<DeduplicationMatchResult> {
    const embedding = newEmbedding || (await aiService.generateEmbedding(`${title} ${description} ${category}`));

    // Fetch existing clusters or reports in the same district or category
    const clusters = await ProblemCluster.find({
      $or: [{ district: district }, { category: category }]
    }).limit(30);

    const candidates: Array<{
      reportId: string;
      clusterId?: string;
      title: string;
      similarity: number;
      district: string;
    }> = [];

    let bestCluster: IProblemCluster | null = null;
    let highestSimilarity = 0;

    for (const cluster of clusters) {
      let sim = 0;
      if (cluster.embedding && cluster.embedding.length > 0) {
        sim = calculateCosineSimilarity(embedding, cluster.embedding);
      } else {
        // Compute on the fly if not cached
        const clusterEmb = await aiService.generateEmbedding(`${cluster.title} ${cluster.category}`);
        sim = calculateCosineSimilarity(embedding, clusterEmb);
      }

      // Bonus boost for exact same village and district
      if (cluster.district.toLowerCase() === district.toLowerCase()) {
        sim = Math.min(1.0, sim + 0.05);
      }

      if (sim >= 0.65) {
        candidates.push({
          reportId: cluster.primaryReportId ? cluster.primaryReportId.toString() : cluster._id.toString(),
          clusterId: cluster._id.toString(),
          title: cluster.title,
          similarity: Number((sim * 100).toFixed(1)),
          district: cluster.district
        });
      }

      if (sim > highestSimilarity) {
        highestSimilarity = sim;
        bestCluster = cluster;
      }
    }

    // Also check recent open problem reports if no cluster matched above threshold
    if (highestSimilarity < this.threshold) {
      const recentReports = await ProblemReport.find({
        district,
        status: { $in: ['OPEN', 'VERIFIED'] }
      }).limit(20);

      for (const rep of recentReports) {
        let sim = 0;
        if (rep.embedding && rep.embedding.length > 0) {
          sim = calculateCosineSimilarity(embedding, rep.embedding);
        } else {
          const repEmb = await aiService.generateEmbedding(`${rep.title} ${rep.description}`);
          sim = calculateCosineSimilarity(embedding, repEmb);
        }

        if (sim > highestSimilarity) {
          highestSimilarity = sim;
          candidates.push({
            reportId: rep._id.toString(),
            clusterId: rep.clusterId ? rep.clusterId.toString() : undefined,
            title: rep.title,
            similarity: Number((sim * 100).toFixed(1)),
            district: rep.district
          });
        }
      }
    }

    candidates.sort((a, b) => b.similarity - a.similarity);

    const isDuplicate = highestSimilarity >= this.threshold;
    const similarityPercent = Math.round(highestSimilarity * 100);

    let explanation = 'No significant duplicate detected. Unique civic problem registered.';
    if (isDuplicate && bestCluster) {
      explanation = `Likely same issue — ${similarityPercent}% similarity with existing cluster: "${bestCluster.title}". Report consolidated to amplify community voice.`;
    } else if (isDuplicate) {
      explanation = `Likely same issue — ${similarityPercent}% similarity with existing report. Grouped into consolidated cluster.`;
    }

    return {
      isDuplicate,
      clusterId: isDuplicate && bestCluster ? bestCluster._id.toString() : undefined,
      clusterTitle: isDuplicate && bestCluster ? bestCluster.title : undefined,
      highestSimilarity: Number(highestSimilarity.toFixed(3)),
      explanation,
      candidates: candidates.slice(0, 5)
    };
  }
}

export const deduplicationEngine = new DeduplicationEngine();
