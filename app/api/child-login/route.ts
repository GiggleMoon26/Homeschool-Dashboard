import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase/admin';
import { createChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: child, error } = await admin
    .from('child_profiles')
    .select('id, family_id, name, pin_hash')
    .eq('username', String(username).trim().toLowerCase())
    .single();

  if (error || !child) {
    return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(password, child.pin_hash);
  if (!passwordMatches) {
    return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 });
  }

  const token = createChildSessionToken(child.family_id, child.id);
  const res = NextResponse.json({ ok: true, name: child.name, childId: child.id });
  res.cookies.set(CHILD_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
