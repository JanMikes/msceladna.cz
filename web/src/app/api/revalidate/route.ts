import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { revalidateTags } from '@/lib/strapi/cache';

// Internal endpoint called by Strapi lifecycle hooks to purge cached Strapi
// responses by tag. Not meant to be reachable from the public internet — it is
// guarded by a shared secret and should only be exposed on the internal network.
export const dynamic = 'force-dynamic';

const SECRET = process.env.STRAPI_WEBHOOK_SECRET || '';

function safeEqual(a: string, b: string): boolean {
  // HMAC both sides with a per-call random key before comparing. The digests
  // are always the same length, so this avoids leaking the secret's length via
  // an early length-mismatch return (which would defeat timingSafeEqual).
  const key = crypto.randomBytes(32);
  const ha = crypto.createHmac('sha256', key).update(a).digest();
  const hb = crypto.createHmac('sha256', key).update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const provided = req.headers.get('x-revalidate-secret') ?? '';
  if (!SECRET || !safeEqual(provided, SECRET)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { tags?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === 'string')
    : [];

  if (tags.length === 0) {
    return NextResponse.json({ error: 'no tags provided' }, { status: 400 });
  }

  const purged = await revalidateTags(tags);
  console.log('[revalidate] purged tags:', purged.join(', '));
  return NextResponse.json({ purged });
}
