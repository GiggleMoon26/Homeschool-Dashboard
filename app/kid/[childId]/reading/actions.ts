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

export async function addReadingLogEntry(formData: FormData) {
  const session = await requireChildSession();
  const admin = createAdminClient();

  const bookTitle = String(formData.get('book_title') || '').trim();
  const author = String(formData.get('author') || '').trim() || null;
  const amountRead = String(formData.get('amount_read') || '').trim() || null;
  const notes = String(formData.get('notes') || '').trim() || null;
  const dateRead = String(formData.get('date_read') || '').trim() || todayISO();

  if (!bookTitle) {
    redirect(`/kid/${session.childId}/reading?error=` + encodeURIComponent('Please enter a book title.'));
  }

  const { error } = await admin.from('reading_log').insert({
    family_id: session.familyId,
    child_id: session.childId,
    book_title: bookTitle,
    author,
    amount_read: amountRead,
    notes,
    date_read: dateRead,
  });

  if (error) {
    // Without this, a failed insert (e.g. a missing column/table) would
    // look exactly like nothing happened — the same silent-failure trap
    // this project has hit and fixed several times before.
    redirect(`/kid/${session.childId}/reading?error=` + encodeURIComponent(error.message));
  }

  revalidatePath(`/kid/${session.childId}/reading`);
}

export async function deleteReadingLogEntry(entryId: string) {
  const session = await requireChildSession();
  const admin = createAdminClient();
  const { error } = await admin.from('reading_log').delete().eq('id', entryId).eq('child_id', session.childId);
  if (error) {
    redirect(`/kid/${session.childId}/reading?error=` + encodeURIComponent(error.message));
  }
  revalidatePath(`/kid/${session.childId}/reading`);
}
