import { AIAnalysisInput, IAIProvider } from './types.js';
import { AIAnalysisResult, SupportedLanguage } from '../../types/index.js';
import { DemoFallbackProvider } from './DemoFallbackProvider.js';

export class GeminiProvider implements IAIProvider {
  name = 'Google Gemini AI (Cloud API)';
  private apiKey: string;
  private model: string;
  private fallback: DemoFallbackProvider;

  constructor(apiKey?: string, model: string = process.env.AI_MODEL || 'gemini-3.8-flash') {
    this.apiKey = apiKey || process.env.AI_API_KEY || '';
    this.model = model || process.env.AI_MODEL || 'gemini-3.8-flash';
    this.fallback = new DemoFallbackProvider();
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  async detectLanguage(text: string): Promise<{ language: SupportedLanguage | string; confidence: number }> {
    if (!this.isAvailable()) {
      return this.fallback.detectLanguage(text);
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Detect the language of this rural civic complaint. Return ONLY valid JSON format: {"language": "en"|"hi"|"te"|"sat"|"mun"|"ho", "confidence": 0.95}.\nText: "${text}"`
            }]
          }]
        })
      });

      if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
      const data = (await response.json()) as any;
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const cleaned = String(content || '').replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (err) {
      console.warn('Gemini detectLanguage error, falling back to local provider:', err);
      return this.fallback.detectLanguage(text);
    }
  }

  async translateText(text: string, fromLang: string, toLang: string = 'en'): Promise<string> {
    if (!this.isAvailable() || fromLang === toLang) {
      return this.fallback.translateText(text, fromLang, toLang);
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate this civic issue description from ${fromLang} to ${toLang}. Output only the translated text.\nText: "${text}"`
            }]
          }]
        })
      });

      if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
      const data = (await response.json()) as any;
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;
    } catch (err) {
      console.warn('Gemini translateText error, falling back to local provider:', err);
      return this.fallback.translateText(text, fromLang, toLang);
    }
  }

  async analyzeReport(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    if (!this.isAvailable()) {
      return this.fallback.analyzeReport(input);
    }

    try {
      const prompt = `You are the GramUtthan AI civic analyzer for the Government of Jharkhand.
Analyze this civic issue report and output strictly structured JSON matching this schema:
{
  "detectedLanguage": "en" | "hi" | "te" | "sat" | "mun" | "ho",
  "originalText": string,
  "translatedText": string,
  "summary": string,
  "category": "Broken bridge" | "Damaged road" | "Drinking water shortage" | "Non-functional borewell" | "Streetlight failure" | "Waste-management issue" | "School infrastructure problem" | "Drainage problem" | "Electricity issue" | "Healthcare/access issue" | "Other",
  "subcategory": string,
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "affectedPopulation": number,
  "locationEntities": string[],
  "tags": string[],
  "suggestedResearchDomains": string[],
  "duplicateCandidates": [],
  "confidence": number
}

Input:
Title: ${input.title}
Description: ${input.description}
District: ${input.district || 'Jharkhand'}
Village: ${input.village || ''}
Category hint: ${input.category || ''}
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (!response.ok) throw new Error(`Gemini API returned ${response.status}`);
      const data = (await response.json()) as any;
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const cleaned = String(rawText || '').replace(/```json|```/g, '').trim();
      if (!cleaned) throw new Error('Gemini returned an empty analysis.');
      const parsed = JSON.parse(cleaned);

      return {
        ...parsed,
        isFallback: false,
        provider: `Google Gemini (${this.model})`
      };
    } catch (err) {
      console.warn('Gemini analyzeReport failed, falling back to local demo provider:', err);
      const fallbackResult = await this.fallback.analyzeReport(input);
      fallbackResult.provider = 'Demo AI Pipeline (Gemini fallback)';
      return fallbackResult;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.isAvailable()) return this.fallback.generateEmbedding(text);
    try {
      const embeddingModel = process.env.AI_EMBEDDING_MODEL || 'gemini-embedding-001';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify({
          model: `models/${embeddingModel}`,
          content: { parts: [{ text }] },
          taskType: 'SEMANTIC_SIMILARITY',
          outputDimensionality: 768,
        })
      });
      if (!response.ok) throw new Error(`Gemini embedding API returned ${response.status}`);
      const data = await response.json() as any;
      const values = data.embeddings?.[0]?.values;
      if (!Array.isArray(values) || values.length === 0) throw new Error('Gemini returned no embedding');
      return values.map((v: unknown) => Number(v));
    } catch (err) {
      console.warn('Gemini embedding failed, using deterministic fallback:', err);
      return this.fallback.generateEmbedding(text);
    }
  }
}
