import mongoose from 'mongoose';
import { KnowledgeRecord } from '../../models/KnowledgeRecord.js';
import { Solution } from '../../models/Solution.js';
import { ProblemReport } from '../../models/ProblemReport.js';
import { Project } from '../../models/Project.js';
import { aiService } from '../ai/index.js';

function cosine(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function searchableText(p: { title?: string; description?: string; aiSummary?: string; category?: string; subcategory?: string; tags?: string[]; suggestedDomains?: string[]; district?: string; village?: string }) {
  return [p.title, p.description, p.aiSummary, p.category, p.subcategory, ...(p.tags || []), ...(p.suggestedDomains || []), p.district, p.village].filter(Boolean).join(' ');
}

export async function createKnowledgeFromProject(projectId: mongoose.Types.ObjectId | string, reviewerId?: mongoose.Types.ObjectId) {
  const project = await Project.findById(projectId);
  if (!project || project.status !== 'VERIFIED' || !project.solutionSummary) return null;
  const problem = await ProblemReport.findById(project.problemReportId);
  if (!problem) return null;

  const solutionText = project.solutionSummary.trim();
  const embedding = await aiService.generateEmbedding(searchableText({
    title: project.title, description: project.description, category: problem.category,
    subcategory: problem.subcategory, tags: problem.tags, suggestedDomains: problem.suggestedDomains,
    district: problem.district, village: problem.village,
  }) + ' ' + solutionText);

  const solution = await Solution.findOneAndUpdate(
    { projectId: project._id },
    {
      projectId: project._id, problemReportId: problem._id, title: project.title,
      summary: solutionText, implementationDetails: project.description,
      technologies: problem.suggestedDomains, resourcesRequired: [],
      evidenceUrls: [project.repositoryUrl, project.demoUrl].filter(Boolean),
      verifiedBy: reviewerId || project.verifiedBy, verifiedAt: project.verifiedAt || new Date(),
      verificationStatus: 'VERIFIED', embedding,
    }, { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return KnowledgeRecord.findOneAndUpdate(
    { solutionId: solution._id },
    {
      problemReportId: problem._id, solutionId: solution._id, title: problem.title,
      problemText: searchableText(problem), solutionText, category: problem.category,
      subcategory: problem.subcategory, district: problem.district, state: problem.state,
      tags: [...new Set([...(problem.tags || []), ...(problem.suggestedDomains || [])])],
      sourceType: 'VERIFIED_PROJECT', sourceReference: project._id.toString(),
      verificationStatus: 'VERIFIED', visibility: 'ADMIN_ONLY', embedding,
      verifiedBy: reviewerId || project.verifiedBy, verifiedAt: project.verifiedAt || new Date(),
      lastReviewedAt: new Date(),
    }, { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function findHistoricalMatches(input: {
  title: string; description: string; category?: string; district?: string; state?: string;
  tags?: string[]; suggestedDomains?: string[]; limit?: number;
}) {
  const queryEmbedding = await aiService.generateEmbedding(searchableText(input));
  const candidates = await KnowledgeRecord.find({
    verificationStatus: 'VERIFIED',
    visibility: { $in: ['PUBLIC', 'ADMIN_ONLY'] },
  }).populate({ path: 'solutionId', select: 'title summary implementationDetails technologies resourcesRequired outcome evidenceUrls verificationStatus' }).lean();

  // Embedding models can change between demo and live environments. Re-embed
  // stale records so a 64D demo vector is never compared with a 768D Gemini vector.
  const repairedCandidates = await Promise.all(candidates.map(async (record) => {
    if (Array.isArray(record.embedding) && record.embedding.length === queryEmbedding.length) return record;
    const freshEmbedding = await aiService.generateEmbedding(record.problemText + ' ' + record.solutionText);
    await KnowledgeRecord.updateOne({ _id: record._id }, { $set: { embedding: freshEmbedding } });
    return { ...record, embedding: freshEmbedding };
  }));

  const tagSet = new Set((input.tags || []).map(x => x.toLowerCase()));
  const domainSet = new Set((input.suggestedDomains || []).map(x => x.toLowerCase()));
  const ranked = repairedCandidates.map(record => {
    const semantic = Math.max(0, cosine(queryEmbedding, record.embedding || []));
    const category = input.category && record.category === input.category ? 1 : 0;
    const district = input.district && record.district && record.district.toLowerCase() === input.district.toLowerCase() ? 1 : 0;
    const overlapTags = (record.tags || []).filter(t => tagSet.has(t.toLowerCase())).length;
    const overlapDomains = (record.tags || []).filter(t => domainSet.has(t.toLowerCase())).length;
    const metadata = Math.min(1, category * 0.45 + district * 0.15 + Math.min(0.4, (overlapTags + overlapDomains) * 0.08));
    const score = Math.min(1, semantic * 0.75 + metadata * 0.25);
    return {
      knowledgeRecordId: record._id, title: record.title, category: record.category, district: record.district,
      similarity: Number(score.toFixed(4)), semanticSimilarity: Number(semantic.toFixed(4)),
      explanation: [semantic >= 0.75 ? 'Strong semantic similarity' : semantic >= 0.55 ? 'Moderate semantic similarity' : 'Some semantic overlap', category ? 'same problem category' : null, district ? 'same district' : null].filter(Boolean).join('; '),
      sourceType: record.sourceType, verifiedAt: record.verifiedAt, problemReportId: record.problemReportId,
      solution: record.solutionId,
    };
  }).sort((a, b) => b.similarity - a.similarity);
  const threshold = Number(process.env.HISTORICAL_MATCH_THRESHOLD || '0.55');
  return ranked.filter((match) => match.similarity >= threshold).slice(0, input.limit || 5);
}
