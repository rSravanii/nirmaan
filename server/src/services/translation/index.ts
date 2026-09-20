import { SupportedLanguage } from '../../types/index.js';
import { aiService } from '../ai/index.js';

export interface TranslationStatus {
  sourceLanguage: string;
  targetLanguage: string;
  originalText: string;
  translatedText: string;
  status: 'COMPLETED' | 'FALLBACK_USED' | 'PROVIDER_UNAVAILABLE';
  provider: string;
}

export class MultilingualTranslationService {
  async translate(text: string, fromLang: string, toLang: string = 'en'): Promise<TranslationStatus> {
    if (!text || fromLang === toLang) {
      return {
        sourceLanguage: fromLang,
        targetLanguage: toLang,
        originalText: text,
        translatedText: text,
        status: 'COMPLETED',
        provider: 'Identity / No translation required'
      };
    }

    try {
      const translated = await aiService.translateText(text, fromLang, toLang);
      const isDemo = aiService.isDemoMode();

      return {
        sourceLanguage: fromLang,
        targetLanguage: toLang,
        originalText: text,
        translatedText: translated,
        status: isDemo ? 'FALLBACK_USED' : 'COMPLETED',
        provider: isDemo ? 'Local Multilingual Lexicon / Demo Engine' : 'Cloud Translation API'
      };
    } catch (err: any) {
      console.warn('Translation service error:', err.message);
      return {
        sourceLanguage: fromLang,
        targetLanguage: toLang,
        originalText: text,
        translatedText: text,
        status: 'PROVIDER_UNAVAILABLE',
        provider: 'Fallback Local Passthrough'
      };
    }
  }
}

export const translationService = new MultilingualTranslationService();
