'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function getOwnedChild(childId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: child, error } = await supabase
    .from('child_profiles')
    .select('id, family_id')
    .eq('id', childId)
    .single();

  if (error || !child) redirect('/dashboard?error=' + encodeURIComponent('Child not found.'));
  return { supabase, child: child! };
}

export async function updateTaskRecord(childId: string, taskId: string, formData: FormData) {
  const { supabase } = await getOwnedChild(childId);
  const evidence = String(formData.get('evidence') || '').trim() || null;
  const notes = String(formData.get('notes') || '').trim() || null;

  await supabase.from('tasks').update({ evidence, notes }).eq('id', taskId).eq('child_id', childId);
  revalidatePath(`/dashboard/children/${childId}/learning-record`);
}
