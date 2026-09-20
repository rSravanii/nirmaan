import { describe, it, expect } from 'vitest';
import { DemoFallbackProvider } from '../src/services/ai/DemoFallbackProvider.js';

describe('AI Orchestration Service', () => {
  const provider = new DemoFallbackProvider();

  it('should detect Hindi language from Devanagari text', async () => {
    const text = 'हमारे गाँव के पास का पुल टूट गया है और बच्चे सुरक्षित रूप से पार नहीं कर सकते।';
    const result = await provider.detectLanguage(text);
    expect(result.language).toBe('hi');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('should detect Telugu language from Telugu script', async () => {
    const text = 'మా గ్రామం సమీపంలో వంతెన దెబ్బతింది';
    const result = await provider.detectLanguage(text);
    expect(result.language).toBe('te');
  });

  it('should translate Hindi bridge complaint into English', async () => {
    const text = 'गाँव का पुल टूट गया है';
    const translated = await provider.translateText(text, 'hi', 'en');
    expect(translated.toLowerCase()).toContain('bridge');
  });

  it('should classify broken bridge problem and suggest Civil Engineering domains', async () => {
    const result = await provider.analyzeReport({
      title: 'Broken bridge near Hesal village',
      description: 'Bridge collapsed after heavy rain, children cannot cross safely to school.',
      district: 'Ranchi',
      village: 'Hesal'
    });

    expect(result.category).toBe('Broken bridge');
    expect(result.severity).toBe('HIGH');
    expect(result.suggestedResearchDomains).toContain('Civil Engineering');
    expect(result.locationEntities).toContain('Ranchi');
  });

  it('should generate normalized 64-dimensional unit embeddings', async () => {
    const vec = await provider.generateEmbedding('Broken rural bridge Angara Ranchi');
    expect(vec.length).toBe(64);
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
    expect(norm).toBeCloseTo(1, 1);
  });
});
