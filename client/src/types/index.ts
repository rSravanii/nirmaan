export type UserRole = 
  | 'CITIZEN' 
  | 'NGO' 
  | 'STUDENT' 
  | 'PROFESSOR' 
  | 'EVALUATOR' 
  | 'ADMIN'
  | 'RESEARCHER'
  | 'COMPANY';

export type SupportedLanguage = 'en' | 'hi' | 'te' | 'sat' | 'mun' | 'ho';
export type ProblemStatus = 'OPEN' | 'VERIFIED' | 'CLAIMED' | 'IN_PROGRESS' | 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
export interface ProblemStatusHistoryEntry { status: ProblemStatus; note: string; updatedAt: string; updatedBy?: { _id: string; name?: string; role?: string }; }

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  department?: string;
  district?: string;
  phone?: string;
  avatarUrl?: string;
  impactPoints: number;
  badges: string[];
  isDemoAccount?: boolean;
}

export interface ProblemReport {
  _id: string;
  title: string;
  description: string;
  originalLanguage: string;
  translatedText?: string;
  aiSummary?: string;
  category: string;
  subcategory?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedPopulation: number;
  locationName: string;
  village: string;
  district: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  photos: string[];
  cameraCaptured: boolean;
  reportedBy?: {
    _id: string;
    name: string;
    role: string;
    district?: string;
  };
  isAnonymous: boolean;
  clusterId?: {
    _id: string;
    title: string;
    reportCount: number;
  };
  duplicateConfidence?: number;
  isDuplicate: boolean;
  status: ProblemStatus;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verificationNotes?: string;
  claimedByProjectId?: Project | string;
  statusHistory?: ProblemStatusHistoryEntry[];
  tags: string[];
  suggestedDomains: string[];
  upvotes: number;
  aiMetadata?: {
    confidence: number;
    provider: string;
    isFallback: boolean;
    extractedEntities: string[];
  };
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectMilestone {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  phaseNumber: number;
  evidenceFiles: string[];
  evidenceNotes?: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  reviewerNotes?: string;
  reviewedBy?: any;
  submittedAt?: string;
  verifiedAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  problemReportId: ProblemReport;
  clusterId?: any;
  leadStudentId: User;
  teamMembers: User[];
  institution: string;
  department: string;
  mentorProfessorId?: User;
  status: 'OPEN' | 'CLAIMED' | 'IN_PROGRESS' | 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'RESOLVED' | 'REWARDED';
  milestones: ProjectMilestone[];
  impactScore: number;
  impactPointsAwarded: number;
  solutionSummary?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  evaluatorRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearcherMatch {
  id: string;
  name: string;
  type: 'PROFESSOR' | 'STUDENT_TEAM' | 'DEPARTMENT';
  department: string;
  institution: string;
  domain: string;
  matchScore: number;
  scoringBreakdown: {
    semanticSimilarity: number;
    domainMatch: number;
    keywordMatch: number;
    departmentMatch: number;
    pastExperience: number;
  };
  explanation: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'MATCH' | 'VERIFICATION';
  link?: string;
  read: boolean;
  createdAt: string;
}
