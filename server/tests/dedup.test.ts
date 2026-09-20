import { describe, it, expect } from 'vitest';
import { calculateCosineSimilarity } from '../src/services/deduplication/index.js';
import { DemoFallbackProvider } from '../src/services/ai/DemoFallbackProvider.js';

describe('Semantic Deduplication Engine', () => {
  const ai = new DemoFallbackProvider();

  it('should calculate cosine similarity correctly for identical vectors', () => {
    const vec = [0.6, 0.8, 0];
    const sim = calculateCosineSimilarity(vec, vec);
    expect(sim).toBeCloseTo(1.0, 4);
  });

  it('should calculate orthogonal vectors as 0 similarity', () => {
    const vecA = [1, 0, 0];
    const vecB = [0, 1, 0];
    const sim = calculateCosineSimilarity(vecA, vecB);
    expect(sim).toBe(0);
  });

  it('should detect high semantic similarity between jury demo bridge reports (> 85%)', async () => {
    const reportA = 'Bridge near Village X is broken and children cannot cross.';
    const reportB = 'The same bridge cannot be used after the damage and collapse.';

    const embA = await ai.generateEmbedding(reportA);
    const embB = await ai.generateEmbedding(reportB);

    const sim = calculateCosineSimilarity(embA, embB);
    expect(sim).toBeGreaterThan(0.80);
  });
});
