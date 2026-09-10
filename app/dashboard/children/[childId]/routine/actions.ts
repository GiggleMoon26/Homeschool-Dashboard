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

export async function addRoutineItem(childId: string, formData: FormData) {
  const { supabase, child } = await getOwnedChild(childId);

  const title = String(formData.get('title') || '').trim();
  const category = String(formData.get('category') || 'morning');

  if (!title) redirect(`/dashboard/children/${childId}/routine?error=` + encodeURIComponent('Please enter a title.'));

  const { error } = await supabase.from('routine_items').insert({
    family_id: child.family_id,
    child_id: childId,
    title, category,
  });

  if (error) {
    // Without this, a failed insert (e.g. the table not existing yet)
    // would look exactly like nothing happened — the form clears, but
    // nothing gets saved and there's no clue why.
    redirect(`/dashboard/children/${childId}/routine?error=` + encodeURIComponent(error.message));
  }

  revalidatePath(`/dashboard/children/${childId}/routine`);
  revalidatePath(`/kid/${childId}`);
}

export async function deleteRoutineItem(childId: string, itemId: string) {
  const { supabase } = await getOwnedChild(childId);
  await supabase.from('routine_items').delete().eq('id', itemId).eq('child_id', childId);
  revalidatePath(`/dashboard/children/${childId}/routine`);
  revalidatePath(`/kid/${childId}`);
}

export async function updateRoutineItem(childId: string, itemId: string, formData: FormData) {
  const { supabase } = await getOwnedChild(childId);
  const title = String(formData.get('title') || '').trim();
  const category = String(formData.get('category') || 'morning');
  if (!title) return;

  await supabase.from('routine_items').update({ title, category }).eq('id', itemId).eq('child_id', childId);
  revalidatePath(`/dashboard/children/${childId}/routine`);
  revalidatePath(`/kid/${childId}`);
}
