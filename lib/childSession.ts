import { createHmac, timingSafeEqual } from 'crypto';
import { CHILD_SESSION_COOKIE } from './childSessionConstants';
export { CHILD_SESSION_COOKIE };

export type ChildSessionPayload = {
  familyId: string;
  childId: string;
  exp: number;
};

const SECRET = process.env.CHILD_SESSION_SECRET || 'dev-only-insecure-secret-change-me';
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 14;

function sign(payloadB64: string): string {
  return createHmac('sha256', SECRET).update(payloadB64).digest('base64url');
}

export function createChildSessionToken(familyId: string, childId: string): string {
  const payload: ChildSessionPayload = {
    familyId,
    childId,
    exp: Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = sign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function verifyChildSessionToken(token: string | undefined | null): ChildSessionPayload | null {
  if (!token) return null;
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return null;

  const expectedSig = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload: ChildSessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
