'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';
import { checklistForStage } from '@/lib/curriculumSeeds';
import { stageForYear } from '@/lib/nswStages';

export async function addChild(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: family } = await supabase
    .from('families')
    .select('id')
    .eq('owner_user_id', user!.id)
    .single();
  if (!family) redirect('/dashboard');

  const name = String(formData.get('name') || '').trim();
  const yearLevel = String(formData.get('year_level') || '').trim();
  const stage = stageForYear(yearLevel); // derived, never manually typed
  const avatar = String(formData.get('avatar') || '🎮');
  const color = String(formData.get('color') || '#05d9e8');
  const username = String(formData.get('username') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!name || !yearLevel || !username || password.length < 4) {
    redirect('/dashboard/children/new?error=' + encodeURIComponent(
      'Please fill in a name, choose a year level, and set a username and password of at least 4 characters.'
    ));
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: newChild, error } = await supabase
    .from('child_profiles')
    .insert({
      family_id: family!.id,
      name, year_level: yearLevel, stage, avatar, color,
      username, pin_hash: passwordHash,
    })
    .select('id')
    .single();

  if (error) {
    const message = error.code === '23505'
      ? `The username "${username}" is already taken — try a different one.`
      : error.message;
    redirect('/dashboard/children/new?error=' + encodeURIComponent(message));
  }

  // Auto-populate their curriculum checklist based on the stage you set —
  // no need to type in 50+ outcome codes by hand.
  const seeds = checklistForStage(stage);
  if (seeds.length > 0 && newChild) {
    await supabase.from('checklist_items').insert(
      seeds.map((s) => ({
        family_id: family!.id,
        child_id: newChild.id,
        code: s.code,
        title: s.title,
        subject: s.subject,
        khan_resource: s.khanResource || null,
        twinkl_resource: s.twinklResource || null,
        other_ideas: s.otherIdeas || null,
        markoff_criteria: s.markoffCriteria || null,
        is_ongoing: s.isOngoing || false,
      }))
    );
  } else if (newChild) {
    // We only have checklist data built for Stage 1, 3, and 5 so far
    // (matching George, Louis, and a Year 10 example) — being upfront
    // about this rather than silently leaving an empty checklist.
    redirect('/dashboard?error=' + encodeURIComponent(
      `${name} was added, but ${stage || 'their stage'} doesn't have curriculum data built in yet ` +
      `(only Stage 1, 3, and 5 are seeded so far) — their checklist is empty for now.`
    ));
  }

  redirect('/dashboard');
}
