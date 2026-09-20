import { AIAnalysisInput, IAIProvider } from './types.js';
import { AIAnalysisResult, ProblemCategory, ProblemSeverity, SupportedLanguage } from '../../types/index.js';

export class DemoFallbackProvider implements IAIProvider {
  name = 'DemoFallbackProvider (Local Deterministic)';

  isAvailable(): boolean {
    return true;
  }

  async detectLanguage(text: string): Promise<{ language: SupportedLanguage | string; confidence: number }> {
    const lower = text.toLowerCase();

    // Check for Devanagari script (Hindi)
    if (/[\u0900-\u097F]/.test(text)) {
      return { language: 'hi', confidence: 0.98 };
    }
    // Check for Telugu script
    if (/[\u0C00-\u0C7F]/.test(text)) {
      return { language: 'te', confidence: 0.98 };
    }
    // Check for Ol Chiki script (Santhali)
    if (/[\u1C50-\u1C7F]/.test(text)) {
      return { language: 'sat', confidence: 0.96 };
    }

    // Romanized keyword checks
    if (lower.includes('pul') || lower.includes('toot') || lower.includes('sadak') || lower.includes('paani') || lower.includes('bijli') || lower.includes('gaav')) {
      return { language: 'hi', confidence: 0.91 };
    }
    if (lower.includes('vanthena') || lower.includes('neellu') || lower.includes('roaddlu') || lower.includes('baagolevu') || lower.includes('graamam')) {
      return { language: 'te', confidence: 0.92 };
    }
    if (lower.includes('sakow') || lower.includes('bagraw') || lower.includes('abohatu') || lower.includes('gidra') || lower.includes('dak\'')) {
      return { language: 'sat', confidence: 0.94 };
    }
    if (lower.includes('sanko') || lower.includes('barijana') || lower.includes('daah')) {
      return { language: 'mun', confidence: 0.89 };
    }
    if (lower.includes('bagro-yana') || lower.includes('da-a')) {
      return { language: 'ho', confidence: 0.88 };
    }

    return { language: 'en', confidence: 0.95 };
  }

  async translateText(text: string, fromLang: string, toLang: string = 'en'): Promise<string> {
    if (fromLang === 'en' || !text) return text;

    const lower = text.toLowerCase().trim();

    // Hindi translations
    if (fromLang === 'hi' || /[\u0900-\u097F]/.test(text)) {
      if (text.includes('पुल') || lower.includes('pul toot')) {
        return 'The bridge near our village has been damaged and children cannot safely cross it.';
      }
      if (text.includes('सड़क') || lower.includes('sadak kharab')) {
        return 'The connecting road between the villages is severely eroded with large potholes.';
      }
      if (text.includes('पानी') || text.includes('हैंडपंप') || lower.includes('paani') || lower.includes('borewell')) {
        return 'Drinking water shortage due to three non-functional community borewells.';
      }
      if (text.includes('बिजली') || text.includes('स्ट्रीटलाइट') || lower.includes('bijli')) {
        return 'Frequent power outages and broken streetlights along the main village corridor.';
      }
      return `[Hindi Translated] ${text.replace(/[\u0900-\u097F]/g, '').trim() || 'Community issue reported regarding local village infrastructure.'}`;
    }

    // Telugu translations
    if (fromLang === 'te' || /[\u0C00-\u0C7F]/.test(text)) {
      if (text.includes('వంతెన') || lower.includes('vanthena')) {
        return 'The bridge near our village has been damaged and children cannot safely cross it.';
      }
      if (text.includes('నీళ్లు') || lower.includes('neellu')) {
        return 'Severe drinking water crisis due to dried up village borewells and bore pumps.';
      }
      if (text.includes('రోడ్డు') || lower.includes('roaddlu')) {
        return 'Damaged village road causing severe transport difficulty during rains.';
      }
      return `[Telugu Translated] ${text}`;
    }

    // Santhali translations
    if (fromLang === 'sat' || lower.includes('sakow') || lower.includes('bagraw')) {
      return 'The bridge near our village has been damaged and children cannot safely cross it.';
    }

    // Mundari translations
    if (fromLang === 'mun' || lower.includes('sanko')) {
      return 'The rural bridge has collapsed and needs urgent structural replacement.';
    }

    // Ho translations
    if (fromLang === 'ho' || lower.includes('bagro-yana')) {
      return 'The village river bridge is damaged, cutting off road communication.';
    }

    return text;
  }

  async analyzeReport(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const text = `${input.title} ${input.description}`;
    const detected = await this.detectLanguage(text);
    const translated = await this.translateText(text, detected.language, 'en');

    const lowerCombined = (text + ' ' + translated).toLowerCase();

    // Category detection
    let category: ProblemCategory = 'Other';
    let subcategory = 'General Rural Infrastructure';
    let suggestedDomains = ['Rural Development', 'Public Policy'];

    if (lowerCombined.includes('bridge') || lowerCombined.includes('pul') || lowerCombined.includes('vanthena') || lowerCombined.includes('sakow') || lowerCombined.includes('sanko')) {
      category = 'Broken bridge';
      subcategory = 'Culvert & Small River Bridge Structural Failure';
      suggestedDomains = ['Civil Engineering', 'Structural Engineering', 'Rural Infrastructure', 'Disaster Resilience'];
    } else if (lowerCombined.includes('road') || lowerCombined.includes('sadak') || lowerCombined.includes('roaddlu') || lowerCombined.includes('pothole')) {
      category = 'Damaged road';
      subcategory = 'Potholes & Asphalt Erosion';
      suggestedDomains = ['Transportation Engineering', 'Civil Engineering', 'Pavement Materials'];
    } else if (lowerCombined.includes('borewell') || lowerCombined.includes('handpump') || lowerCombined.includes('neellu') || lowerCombined.includes('water') || lowerCombined.includes('paani') || lowerCombined.includes('dak')) {
      category = lowerCombined.includes('borewell') || lowerCombined.includes('handpump') ? 'Non-functional borewell' : 'Drinking water shortage';
      subcategory = 'Groundwater Extraction & Filtration Failure';
      suggestedDomains = ['Environmental Engineering', 'Hydrology & Water Resources', 'Mechanical Engineering (Pumps)'];
    } else if (lowerCombined.includes('light') || lowerCombined.includes('streetlight') || lowerCombined.includes('bijli') || lowerCombined.includes('solar')) {
      category = 'Streetlight failure';
      subcategory = 'Solar Panel & Battery Circuit Fault';
      suggestedDomains = ['Electrical Engineering', 'Renewable Energy Systems', 'IoT & Sensor Networks'];
    } else if (lowerCombined.includes('school') || lowerCombined.includes('toilet') || lowerCombined.includes('classroom')) {
      category = 'School infrastructure problem';
      subcategory = 'Sanitation & Classroom Roof Integrity';
      suggestedDomains = ['Civil Engineering', 'Public Health & Sanitation', 'Social Innovation'];
    } else if (lowerCombined.includes('drainage') || lowerCombined.includes('naali') || lowerCombined.includes('sewage') || lowerCombined.includes('overflow')) {
      category = 'Drainage problem';
      subcategory = 'Monsoon Waterlogging & Clogged Culverts';
      suggestedDomains = ['Civil Engineering', 'Urban & Rural Planning', 'Environmental Health'];
    } else if (lowerCombined.includes('health') || lowerCombined.includes('hospital') || lowerCombined.includes('clinic') || lowerCombined.includes('medicine')) {
      category = 'Healthcare/access issue';
      subcategory = 'Primary Health Sub-centre Supply & Staffing';
      suggestedDomains = ['Biomedical Engineering', 'Public Health Administration', 'Telemedicine'];
    }

    // Severity scoring
    let severity: ProblemSeverity = 'MEDIUM';
    let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';

    if (
      lowerCombined.includes('child') ||
      lowerCombined.includes('danger') ||
      lowerCombined.includes('collapse') ||
      lowerCombined.includes('cross') ||
      lowerCombined.includes('emergency') ||
      lowerCombined.includes('accident') ||
      lowerCombined.includes('injured') ||
      lowerCombined.includes('cannot safely')
    ) {
      severity = 'HIGH';
      urgency = 'HIGH';
    }

    if (lowerCombined.includes('critical') || lowerCombined.includes('death') || lowerCombined.includes('submerged') || lowerCombined.includes('epidemic')) {
      severity = 'CRITICAL';
      urgency = 'CRITICAL';
    }

    // Entity extraction
    const locationEntities: string[] = [];
    const knownLocations = ['Ranchi', 'East Singhbhum', 'West Singhbhum', 'Hazaribagh', 'Bokaro', 'Dhanbad', 'Dumka', 'Deoghar', 'Gumla', 'Simdega', 'Angara', 'Namkum', 'Ormanjhi', 'Kanke', 'Sonahatu', 'Silli'];
    for (const loc of knownLocations) {
      if (new RegExp(`\\b${loc}\\b`, 'i').test(text + ' ' + (input.village || '') + ' ' + (input.district || ''))) {
        locationEntities.push(loc);
      }
    }
    if (input.district && !locationEntities.includes(input.district)) {
      locationEntities.push(input.district);
    }
    if (input.village && !locationEntities.includes(input.village)) {
      locationEntities.push(input.village);
    }

    // Tags extraction
    const tags = [
      category.toLowerCase().replace(/\s+/g, '-'),
      ...(input.district ? [input.district.toLowerCase().replace(/\s+/g, '-')] : []),
      ...suggestedDomains.map(d => d.toLowerCase().replace(/\s+/g, '-')),
      'rural-civic-issue',
      'jharkhand-pragati'
    ];

    // Summary generation
    const summary = translated.length > 20
      ? translated
      : `Rural issue in ${input.district || 'Jharkhand'} involving ${category.toLowerCase()} affecting community safety and daily access.`;

    // Generate deterministic embedding
    const embedding = await this.generateEmbedding(`${translated} ${category} ${subcategory}`);

    return {
      detectedLanguage: detected.language,
      originalText: text,
      translatedText: translated,
      summary,
      category,
      subcategory,
      severity,
      urgency,
      affectedPopulation: input.affectedPopulation || (severity === 'HIGH' ? 850 : 320),
      locationEntities: Array.from(new Set(locationEntities)),
      tags: Array.from(new Set(tags)),
      suggestedResearchDomains: suggestedDomains,
      duplicateCandidates: [],
      confidence: 0.94,
      isFallback: true,
      provider: 'Demo AI Pipeline (Deterministic SIH Fallback)'
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Deterministic 64-dimensional pseudo-semantic vector based on token frequencies and domain hashes
    const vector = new Array(64).fill(0);
    const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

    // Semantic key seeds
    const keySeeds: Record<string, number[]> = {
      bridge: [1, 5, 9, 14, 28, 42, 55],
      broken: [1, 9, 20, 28, 35, 42],
      damage: [1, 9, 20, 28, 35, 42],
      cross: [5, 14, 28, 55],
      road: [2, 6, 10, 15, 29, 43],
      water: [3, 7, 11, 16, 30, 44],
      borewell: [3, 11, 16, 30, 44, 58],
      light: [4, 8, 12, 17, 31, 45],
      electricity: [4, 8, 12, 17, 31, 45],
      school: [13, 21, 25, 33, 49],
      toilet: [13, 22, 26, 34, 50],
      children: [5, 13, 28, 42, 55]
    };

    for (const token of tokens) {
      // Direct semantic seeding
      for (const [key, indices] of Object.entries(keySeeds)) {
        if (token.includes(key) || key.includes(token)) {
          for (const idx of indices) {
            vector[idx] += 1.8;
          }
        }
      }

      // Hash bag of words for distributed dimensions
      let hash = 0;
      for (let i = 0; i < token.length; i++) {
        hash = (hash << 5) - hash + token.charCodeAt(i);
        hash |= 0;
      }
      const dim = Math.abs(hash) % 64;
      vector[dim] += 0.5;
    }

    // Normalize vector to unit length (L2 norm)
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map(v => Number((v / norm).toFixed(4)));
  }
}
