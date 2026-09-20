import { AIAnalysisResult, ProblemCategory, ProblemSeverity, SupportedLanguage } from '../../types/index.js';

export interface AIAnalysisInput {
  title: string;
  description: string;
  language?: string;
  district?: string;
  village?: string;
  category?: string;
  severity?: string;
  affectedPopulation?: number;
}

export interface IAIProvider {
  name: string;
  isAvailable(): boolean;
  detectLanguage(text: string): Promise<{ language: SupportedLanguage | string; confidence: number }>;
  translateText(text: string, fromLang: string, toLang: string): Promise<string>;
  analyzeReport(input: AIAnalysisInput): Promise<AIAnalysisResult>;
  generateEmbedding(text: string): Promise<number[]>;
}
