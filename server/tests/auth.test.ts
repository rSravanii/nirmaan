import { describe, it, expect } from 'vitest';
import { maskPhoneNumber, maskEmail, sanitizePublicSummary } from '../src/utils/privacy.js';

describe('Privacy & PII Protection', () => {
  it('should mask Indian 10-digit mobile numbers', () => {
    const masked = maskPhoneNumber('+919876543210');
    expect(masked).toContain('******');
    expect(masked).not.toBe('+919876543210');
  });

  it('should mask email addresses safely', () => {
    const masked = maskEmail('citizen.ranchi@gmail.com');
    expect(masked).toContain('***');
    expect(masked).toContain('@gmail.com');
  });

  it('should scrub phone numbers and aadhaar-like tokens from public AI summaries', () => {
    const raw = 'Please contact Birsa at 9876543210 regarding the bridge';
    const scrubbed = sanitizePublicSummary(raw);
    expect(scrubbed).not.toContain('9876543210');
    expect(scrubbed).toContain('XXXXXXXXXX');
  });
});
