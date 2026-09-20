export type UserRole = 
  | 'CITIZEN' 
  | 'NGO' 
  | 'STUDENT' 
  | 'PROFESSOR' 
  | 'EVALUATOR' 
  | 'ADMIN'
  | 'RESEARCHER'
  | 'COMPANY';

export type ProblemCategory = 
  | 'Broken bridge'
  | 'Damaged road'
  | 'Drinking water shortage'
  | 'Non-functional borewell'
  | 'Streetlight failure'
  | 'Waste-management issue'
  | 'School infrastructure problem'
  | 'Drainage problem'
  | 'Electricity issue'
  | 'Healthcare/access issue'
  | 'Other';

export type ProblemSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ProblemStatus = 
  | 'OPEN' 
  | 'VERIFIED' 
  | 'CLAIMED' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'RESOLVED' 
  | 'REJECTED';

export type ProjectStatus = 
  | 'OPEN' 
  | 'CLAIMED' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'VERIFIED' 
  | 'RESOLVED' 
  | 'REWARDED';

export type SupportedLanguage = 
  | 'en' 
  | 'hi' 
  | 'te' 
  | 'sat' 
  | 'mun' 
  | 'ho';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface AIAnalysisResult {
  detectedLanguage: SupportedLanguage | string;
  originalText: string;
  translatedText: string;
  summary: string;
  category: ProblemCategory;
  subcategory: string;
  severity: ProblemSeverity;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedPopulation: number;
  locationEntities: string[];
  tags: string[];
  suggestedResearchDomains: string[];
  duplicateCandidates: Array<{
    reportId: string;
    clusterId?: string;
    similarity: number;
    title: string;
  }>;
  confidence: number;
  isFallback: boolean;
  provider: string;
}

export interface ResearcherMatch {
  id: string;
  name: string;
  type: 'PROFESSOR' | 'STUDENT_TEAM' | 'DEPARTMENT';
  department: string;
  institution: string;
  domain: string;
  matchScore: number; // 0 - 100
  scoringBreakdown: {
    semanticSimilarity: number;
    domainMatch: number;
    keywordMatch: number;
    departmentMatch: number;
    pastExperience: number;
  };
  explanation: string;
}
