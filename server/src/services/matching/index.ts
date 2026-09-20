import { ResearcherMatch } from '../../types/index.js';
import { User, IUser } from '../../models/User.js';
import { StudentProfile } from '../../models/StudentProfile.js';
import { ProfessorProfile } from '../../models/ProfessorProfile.js';
import { calculateCosineSimilarity } from '../deduplication/index.js';
import { aiService } from '../ai/index.js';

export interface MatchingWeights {
  semanticSimilarity: number;
  domainMatch: number;
  keywordMatch: number;
  departmentMatch: number;
  pastExperience: number;
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  semanticSimilarity: 0.55,
  domainMatch: 0.20,
  keywordMatch: 0.10,
  departmentMatch: 0.10,
  pastExperience: 0.05,
};

export class SmartMatchingEngine {
  private weights: MatchingWeights;

  constructor(customWeights?: Partial<MatchingWeights>) {
    this.weights = { ...DEFAULT_WEIGHTS, ...customWeights };
  }

  async matchProblemToResearchers(
    problemTitle: string,
    problemDescription: string,
    category: string,
    suggestedDomains: string[],
    problemEmbedding?: number[]
  ): Promise<ResearcherMatch[]> {
    const textToMatch = `${problemTitle} ${problemDescription} ${category} ${suggestedDomains.join(' ')}`.toLowerCase();
    const embedding = problemEmbedding || (await aiService.generateEmbedding(textToMatch));

    const matches: ResearcherMatch[] = [];

    // 1. Match Professors
    const professors = await ProfessorProfile.find().populate<{ userId: IUser }>('userId');
    for (const prof of professors) {
      if (!prof.userId) continue;

      // Semantic similarity using expertise
      const profText = `${prof.department} ${prof.expertiseAreas.join(' ')} ${prof.publishedTopics.join(' ')}`.toLowerCase();
      const profEmbedding = await aiService.generateEmbedding(profText);
      const semSim = calculateCosineSimilarity(embedding, profEmbedding);

      // Domain match: does any suggestedDomain overlap with expertise?
      const hasDomainOverlap = suggestedDomains.some(d =>
        prof.expertiseAreas.some(e => e.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(e.toLowerCase()))
      );
      const domainScore = hasDomainOverlap ? 1.0 : (prof.department.toLowerCase().includes('civil') && category.includes('bridge')) ? 0.9 : 0.4;

      // Keyword match
      const kwMatches = prof.expertiseAreas.filter(area => textToMatch.includes(area.toLowerCase())).length;
      const kwScore = Math.min(1.0, kwMatches * 0.4 + (hasDomainOverlap ? 0.4 : 0));

      // Department match
      let deptScore = 0.3;
      if (
        (category.includes('bridge') || category.includes('road')) && prof.department.toLowerCase().includes('civil') ||
        (category.includes('water') || category.includes('drainage')) && (prof.department.toLowerCase().includes('environmental') || prof.department.toLowerCase().includes('civil')) ||
        (category.includes('light') || category.includes('electric')) && prof.department.toLowerCase().includes('electric')
      ) {
        deptScore = 1.0;
      }

      // Past experience
      const expScore = Math.min(1.0, (prof.mentoredProjectsCount || 0) * 0.2);

      // Transparent weighted score
      const rawScore =
        semSim * this.weights.semanticSimilarity +
        domainScore * this.weights.domainMatch +
        kwScore * this.weights.keywordMatch +
        deptScore * this.weights.departmentMatch +
        expScore * this.weights.pastExperience;

      const finalScore = Math.min(99, Math.max(40, Math.round(rawScore * 100)));

      matches.push({
        id: prof.userId._id.toString(),
        name: prof.userId.name,
        type: 'PROFESSOR',
        department: prof.department,
        institution: prof.institution || prof.userId.institution || 'BIT Mesra',
        domain: prof.expertiseAreas[0] || prof.department,
        matchScore: finalScore,
        scoringBreakdown: {
          semanticSimilarity: Number((semSim * 100).toFixed(1)),
          domainMatch: Number((domainScore * 100).toFixed(1)),
          keywordMatch: Number((kwScore * 100).toFixed(1)),
          departmentMatch: Number((deptScore * 100).toFixed(1)),
          pastExperience: Number((expScore * 100).toFixed(1)),
        },
        explanation: `Expertise in ${prof.expertiseAreas.slice(0, 2).join(', ')} aligns with ${category}. Strong ${prof.department} background with ${prof.mentoredProjectsCount} verified projects.`
      });
    }

    // 2. Match Students / Student Teams
    const students = await StudentProfile.find().populate<{ userId: IUser }>('userId');
    for (const student of students) {
      if (!student.userId) continue;

      const studentText = `${student.department} ${student.skills.join(' ')} ${student.interestDomains.join(' ')}`.toLowerCase();
      const studentEmbedding = await aiService.generateEmbedding(studentText);
      const semSim = calculateCosineSimilarity(embedding, studentEmbedding);

      const hasDomainOverlap = suggestedDomains.some(d =>
        student.interestDomains.some(i => i.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(i.toLowerCase()))
      );
      const domainScore = hasDomainOverlap ? 0.95 : 0.45;

      const kwMatches = student.skills.filter(s => textToMatch.includes(s.toLowerCase())).length;
      const kwScore = Math.min(1.0, kwMatches * 0.35 + (hasDomainOverlap ? 0.3 : 0));

      let deptScore = 0.3;
      if (
        (category.includes('bridge') || category.includes('road')) && student.department.toLowerCase().includes('civil') ||
        (category.includes('water') || category.includes('drainage')) && (student.department.toLowerCase().includes('environmental') || student.department.toLowerCase().includes('civil')) ||
        (category.includes('light') || category.includes('electric')) && student.department.toLowerCase().includes('electrical')
      ) {
        deptScore = 1.0;
      }

      const expScore = Math.min(1.0, (student.completedProjectsCount || 0) * 0.3);

      const rawScore =
        semSim * this.weights.semanticSimilarity +
        domainScore * this.weights.domainMatch +
        kwScore * this.weights.keywordMatch +
        deptScore * this.weights.departmentMatch +
        expScore * this.weights.pastExperience;

      const finalScore = Math.min(99, Math.max(40, Math.round(rawScore * 100)));

      matches.push({
        id: student.userId._id.toString(),
        name: `${student.userId.name} (Student Team)`,
        type: 'STUDENT_TEAM',
        department: student.department,
        institution: student.institution || student.userId.institution || 'IIT (ISM) Dhanbad',
        domain: student.interestDomains[0] || student.department,
        matchScore: finalScore,
        scoringBreakdown: {
          semanticSimilarity: Number((semSim * 100).toFixed(1)),
          domainMatch: Number((domainScore * 100).toFixed(1)),
          keywordMatch: Number((kwScore * 100).toFixed(1)),
          departmentMatch: Number((deptScore * 100).toFixed(1)),
          pastExperience: Number((expScore * 100).toFixed(1)),
        },
        explanation: `Skills in ${student.skills.slice(0, 3).join(', ')} match problem needs. Relevant coursework in ${student.department}.`
      });
    }

    // Sort descending by matchScore
    matches.sort((a, b) => b.matchScore - a.matchScore);
    return matches.slice(0, 6);
  }
}

export const smartMatchingEngine = new SmartMatchingEngine();
