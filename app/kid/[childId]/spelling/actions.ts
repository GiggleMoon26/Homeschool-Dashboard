'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';

export async function recordSpellingAttempt(score: number, total: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CHILD_SESSION_COOKIE)?.value;
  const session = verifyChildSessionToken(token);
  if (!session) redirect('/kid-login');

  const admin = createAdminClient();
  await admin.from('spelling_practice_history').insert({
    child_id: session.childId,
    score, total,
  });
}
