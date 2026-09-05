'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';

async function requireChildSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CHILD_SESSION_COOKIE)?.value;
  const session = verifyChildSessionToken(token);
  if (!session) redirect('/kid-login');
  return session;
}

export async function toggleTask(taskId: string, currentlyDone: boolean) {
  const session = await requireChildSession();
  const admin = createAdminClient();

  await admin
    .from('tasks')
    .update({
      done: !currentlyDone,
      date_completed: !currentlyDone ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq('id', taskId)
    .eq('child_id', session.childId);

  revalidatePath(`/kid/${session.childId}`);
}

export async function kidLogout() {
  const cookieStore = await cookies();
  cookieStore.set(CHILD_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  redirect('/kid-login');
}
