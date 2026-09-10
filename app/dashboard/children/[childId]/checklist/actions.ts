'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { todayISO } from '@/lib/dateUtils';

export async function toggleChecklistItem(childId: string, itemId: string, currentlyDone: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('checklist_items')
    .update({
      done: !currentlyDone,
      date_ticked: !currentlyDone ? todayISO() : null,
    })
    .eq('id', itemId)
    .eq('child_id', childId);

  revalidatePath(`/dashboard/children/${childId}/checklist`);
}

export async function updateMarkoffCriteria(childId: string, itemId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const markoffCriteria = String(formData.get('markoff_criteria') || '').trim() || null;

  await supabase
    .from('checklist_items')
    .update({ markoff_criteria: markoffCriteria })
    .eq('id', itemId)
    .eq('child_id', childId);

  revalidatePath(`/dashboard/children/${childId}/checklist`);
}
