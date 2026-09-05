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
