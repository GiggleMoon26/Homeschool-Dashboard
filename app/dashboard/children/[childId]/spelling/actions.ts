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

export async function setSpellingList(childId: string, formData: FormData) {
  const { supabase, child } = await getOwnedChild(childId);

  const listName = String(formData.get('list_name') || '').trim();
  const wordsRaw = String(formData.get('words') || '');
  // One word per line: "word | example sentence" — the sentence is optional,
  // but strongly recommended for any word with a homophone (sea/see, etc.)
  // since the quiz can only speak the word aloud, not show it.
  const lines = wordsRaw.split('\n').map((l) => l.trim()).filter(Boolean);
  const words: string[] = [];
  const sentences: string[] = [];
  for (const line of lines) {
    const [word, sentence] = line.split('|').map((p) => p.trim());
    if (word) {
      words.push(word);
      sentences.push(sentence || '');
    }
  }

  if (!listName || words.length === 0) {
    redirect(`/dashboard/children/${childId}/spelling?error=` + encodeURIComponent('Please give the list a name and at least one word.'));
  }

  // Only one active list per child at a time — deactivate any previous one
  // rather than deleting it, so past lists/history stay intact.
  await supabase.from('spelling_lists').update({ is_active: false }).eq('child_id', childId);

  const { error } = await supabase.from('spelling_lists').insert({
    family_id: child.family_id,
    child_id: childId,
    list_name: listName,
    words,
    sentences,
    is_active: true,
  });

  if (error) redirect(`/dashboard/children/${childId}/spelling?error=` + encodeURIComponent(error.message));

  revalidatePath(`/dashboard/children/${childId}/spelling`);
  redirect(`/dashboard/children/${childId}/spelling`);
}

export async function addSpellingIdea(childId: string, formData: FormData) {
  const { supabase, child } = await getOwnedChild(childId);

  const category = String(formData.get('category') || '').trim();
  const itemText = String(formData.get('item_text') || '').trim();

  if (!category || !itemText) {
    redirect(`/dashboard/children/${childId}/spelling?error=` + encodeURIComponent('Please fill in both a category and an idea.'));
  }

  await supabase.from('idea_items').insert({
    family_id: child.family_id,
    child_id: childId,
    list_type: 'spelling',
    category,
    item_text: itemText,
  });

  revalidatePath(`/dashboard/children/${childId}/spelling`);
}

export async function deleteSpellingIdea(childId: string, ideaId: string) {
  const { supabase } = await getOwnedChild(childId);
  await supabase.from('idea_items').delete().eq('id', ideaId).eq('child_id', childId);
  revalidatePath(`/dashboard/children/${childId}/spelling`);
}
