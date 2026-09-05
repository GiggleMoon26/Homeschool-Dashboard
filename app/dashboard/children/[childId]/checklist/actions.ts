'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function toggleChecklistItem(childId: string, itemId: string, currentlyDone: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase
    .from('checklist_items')
    .update({
      done: !currentlyDone,
      date_ticked: !currentlyDone ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq('id', itemId)
    .eq('child_id', childId);

  revalidatePath(`/dashboard/children/${childId}/checklist`);
}
