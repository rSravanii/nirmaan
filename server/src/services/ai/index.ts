import { DemoFallbackProvider } from './DemoFallbackProvider.js';
import { GeminiProvider } from './GeminiProvider.js';
import { IAIProvider, AIAnalysisInput } from './types.js';
import { AIAnalysisResult } from '../../types/index.js';

class AIServiceManager {
  private activeProvider: IAIProvider;
  private demoFallbackProvider: DemoFallbackProvider;

  constructor() {
    this.demoFallbackProvider = new DemoFallbackProvider();
    const requested = (process.env.AI_PROVIDER || 'auto').toLowerCase();
    const hasKey = Boolean(process.env.AI_API_KEY?.trim());

    if ((requested === 'gemini' || requested === 'auto') && hasKey) {
      this.activeProvider = new GeminiProvider();
      console.log('AI Service initialized with Google Gemini Provider.');
    } else {
      this.activeProvider = this.demoFallbackProvider;
      console.log('AI Service initialized with Demo Fallback Provider.');
    }
  }

  getProviderName(): string { return this.activeProvider.name; }
  isDemoMode(): boolean { return this.activeProvider === this.demoFallbackProvider; }

  async analyzeReport(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const delay = this.isDemoMode() ? parseInt(process.env.DEMO_AI_LATENCY_MS || '400', 10) : 0;
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    return this.activeProvider.analyzeReport(input);
  }

  async detectLanguage(text: string) { return this.activeProvider.detectLanguage(text); }
  async translateText(text: string, fromLang: string, toLang = 'en') { return this.activeProvider.translateText(text, fromLang, toLang); }
  async generateEmbedding(text: string): Promise<number[]> { return this.activeProvider.generateEmbedding(text); }
}

export const aiService = new AIServiceManager();
export * from './types.js';
