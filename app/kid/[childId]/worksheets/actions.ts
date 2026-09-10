'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';
import { todayISO } from '@/lib/dateUtils';

async function requireChildSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CHILD_SESSION_COOKIE)?.value;
  const session = verifyChildSessionToken(token);
  if (!session) redirect('/kid-login');
  return session;
}

export async function saveAnswer(worksheetId: string, questionId: string, answer: string) {
  const session = await requireChildSession();
  const admin = createAdminClient();

  // Only ever write to a worksheet that's genuinely this child's, and only
  // while it's still in "assigned" (not yet submitted/locked) status.
  const { data: ws } = await admin.from('worksheets').select('id, child_id, status').eq('id', worksheetId).single();
  if (!ws || ws.child_id !== session.childId || ws.status !== 'assigned') return;

  await admin.from('worksheet_questions').update({ kid_answer: answer }).eq('id', questionId).eq('worksheet_id', worksheetId);
}

export async function submitWorksheet(worksheetId: string) {
  const session = await requireChildSession();
  const admin = createAdminClient();

  const { data: ws } = await admin.from('worksheets').select('id, child_id').eq('id', worksheetId).single();
  if (!ws || ws.child_id !== session.childId) redirect('/kid-login');

  await admin.from('worksheets').update({
    status: 'submitted',
    submitted_date: todayISO(),
  }).eq('id', worksheetId);

  revalidatePath(`/kid/${session.childId}/worksheets`);
  redirect(`/kid/${session.childId}/worksheets`);
}
