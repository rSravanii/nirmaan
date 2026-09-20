export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 6) return '******';
  return cleaned.substring(0, 2) + '******' + cleaned.substring(cleaned.length - 2);
}

export function maskEmail(email?: string): string {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!domain) return '***@***.com';
  const maskedLocal = local.length > 2 ? local[0] + '***' + local[local.length - 1] : '***';
  return `${maskedLocal}@${domain}`;
}

export function sanitizePublicSummary(text: string): string {
  if (!text) return '';
  // Mask 10-digit phone numbers
  let sanitized = text.replace(/(\b[6-9]\d{9}\b)/g, 'XXXXXXXXXX');
  // Mask emails
  sanitized = sanitized.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '[email protected]');
  // Mask Aadhaar-like 12 digit numbers
  sanitized = sanitized.replace(/(\b\d{4}\s?\d{4}\s?\d{4}\b)/g, 'XXXX-XXXX-XXXX');
  return sanitized;
}
