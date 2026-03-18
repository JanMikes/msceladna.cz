import { createHmac } from 'crypto';
import { config } from './config';

function getSecret(): string {
  const secret = config.formTokenSecret;
  if (!secret) throw new Error('FORM_TOKEN_SECRET environment variable is not configured');
  return secret;
}

export function createFormToken(recipients: string[]): string {
  const payload = JSON.stringify(recipients);
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = createHmac('sha256', getSecret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyFormToken(token: string): string[] | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;

    const expected = createHmac('sha256', getSecret()).update(encoded).digest('base64url');
    if (signature !== expected) return null;

    const payload = Buffer.from(encoded, 'base64url').toString('utf-8');
    const recipients = JSON.parse(payload);
    if (!Array.isArray(recipients) || recipients.length === 0) return null;

    return recipients;
  } catch {
    return null;
  }
}
