import { NextResponse } from 'next/server';
import { CHILD_SESSION_COOKIE } from '@/lib/childSession';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CHILD_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
