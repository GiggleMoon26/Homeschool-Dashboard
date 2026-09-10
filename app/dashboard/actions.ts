'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createFamily(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const name = String(formData.get('name') || '').trim();
  if (!name) redirect('/dashboard?error=' + encodeURIComponent('Please enter a family name.'));

  const { error } = await supabase.from('families').insert({ name, owner_user_id: user!.id });

  if (error) {
    redirect('/dashboard?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

async function getOwnedFamily() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: family } = await supabase
    .from('families')
    .select('id')
    .eq('owner_user_id', user!.id)
    .single();
  if (!family) redirect('/dashboard');

  return { supabase, family: family! };
}

export async function addParentTodo(formData: FormData) {
  const { supabase, family } = await getOwnedFamily();
  const title = String(formData.get('title') || '').trim();
  if (!title) return;

  const { error } = await supabase.from('parent_todos').insert({ family_id: family.id, title });

  if (error) {
    // Surface it rather than silently doing nothing — same lesson learned
    // from the routine items bug: a missing table should never look like
    // "nothing happened."
    redirect('/dashboard?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/dashboard');
}

export async function toggleParentTodo(todoId: string, currentlyDone: boolean) {
  const { supabase } = await getOwnedFamily();
  await supabase.from('parent_todos').update({ done: !currentlyDone }).eq('id', todoId);
  revalidatePath('/dashboard');
}

export async function deleteParentTodo(todoId: string) {
  const { supabase } = await getOwnedFamily();
  await supabase.from('parent_todos').delete().eq('id', todoId);
  revalidatePath('/dashboard');
}
