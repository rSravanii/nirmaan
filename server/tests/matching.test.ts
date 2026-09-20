import { describe, it, expect } from 'vitest';
import { SmartMatchingEngine, DEFAULT_WEIGHTS } from '../src/services/matching/index.js';

describe('Smart Matching Engine Formula & Weights', () => {
  it('should verify configured SIH weights sum to 1.0', () => {
    const sum =
      DEFAULT_WEIGHTS.semanticSimilarity +
      DEFAULT_WEIGHTS.domainMatch +
      DEFAULT_WEIGHTS.keywordMatch +
      DEFAULT_WEIGHTS.departmentMatch +
      DEFAULT_WEIGHTS.pastExperience;

    expect(sum).toBeCloseTo(1.0, 5);
  });

  it('should instantiate matching engine with default or custom weights', () => {
    const engine = new SmartMatchingEngine({ semanticSimilarity: 0.60 });
    expect(engine).toBeDefined();
  });
});
