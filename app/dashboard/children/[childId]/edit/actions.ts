'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';
import { stageForYear } from '@/lib/nswStages';

async function getOwnedChild(childId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // This query only ever succeeds if the child belongs to a family this
  // parent owns — Row Level Security enforces it, this isn't just a
  // convenience filter. A parent can never edit or delete another
  // family's child, even by guessing/typing a different ID in the URL.
  const { data: child, error } = await supabase
    .from('child_profiles')
    .select('id, family_id')
    .eq('id', childId)
    .single();

  if (error || !child) redirect('/dashboard?error=' + encodeURIComponent('Child not found.'));
  return { supabase, child: child! };
}

export async function updateChild(childId: string, formData: FormData) {
  const { supabase } = await getOwnedChild(childId);

  const name = String(formData.get('name') || '').trim();
  const yearLevel = String(formData.get('year_level') || '').trim();
  const stage = stageForYear(yearLevel);
  const avatar = String(formData.get('avatar') || '🎮');
  const color = String(formData.get('color') || '#05d9e8');
  const username = String(formData.get('username') || '').trim().toLowerCase();
  const newPassword = String(formData.get('password') || '');

  if (!name || !yearLevel || !username) {
    redirect(`/dashboard/children/${childId}/edit?error=` + encodeURIComponent('Name, year level, and username are required.'));
  }

  type ChildUpdate = {
    name: string; year_level: string; stage: string; avatar: string; color: string; username: string;
    pin_hash?: string;
  };
  const updates: ChildUpdate = { name, year_level: yearLevel, stage, avatar, color, username };

  // Only touch the password if they actually typed a new one — leaving it
  // blank means "keep the current password," not "erase it."
  if (newPassword) {
    if (newPassword.length < 4) {
      redirect(`/dashboard/children/${childId}/edit?error=` + encodeURIComponent('New password must be at least 4 characters.'));
    }
    updates.pin_hash = await bcrypt.hash(newPassword, 10);
  }

  const { error } = await supabase.from('child_profiles').update(updates).eq('id', childId);

  if (error) {
    const message = error.code === '23505'
      ? `The username "${username}" is already taken — try a different one.`
      : error.message;
    redirect(`/dashboard/children/${childId}/edit?error=` + encodeURIComponent(message));
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteChild(childId: string) {
  const { supabase } = await getOwnedChild(childId);

  // Cascades in the database also remove this child's tasks, worksheets,
  // checklist items, etc. — deleting the profile is a real, permanent
  // cleanup, not just hiding it from the list.
  const { error } = await supabase.from('child_profiles').delete().eq('id', childId);

  if (error) {
    redirect(`/dashboard/children/${childId}/edit?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
