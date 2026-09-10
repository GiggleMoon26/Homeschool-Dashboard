'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { todayISO } from '@/lib/dateUtils';

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

// Questions are pasted one per line: Prompt | Guidance | Fixed Answer
// (Guidance and Fixed Answer are both optional — for open-ended/interpretive
// questions, just leave them blank and use Guidance to note what to look for.)
export async function createWorksheet(childId: string, formData: FormData) {
  const { supabase, child } = await getOwnedChild(childId);

  const title = String(formData.get('title') || '').trim();
  const subject = String(formData.get('subject') || '').trim();
  const code = String(formData.get('code') || '').trim() || null;
  const questionsRaw = String(formData.get('questions') || '');
  const lines = questionsRaw.split('\n').map((l) => l.trim()).filter(Boolean);

  if (!title || lines.length === 0) {
    redirect(`/dashboard/children/${childId}/worksheets?error=` + encodeURIComponent('Please give the worksheet a title and at least one question.'));
  }

  const { data: ws, error } = await supabase.from('worksheets').insert({
    family_id: child.family_id,
    child_id: childId,
    title, subject: subject || null, code,
    status: 'assigned',
  }).select('id').single();

  if (error || !ws) redirect(`/dashboard/children/${childId}/worksheets?error=` + encodeURIComponent(error?.message || 'Could not create worksheet.'));

  const questionRows = lines.map((line, i) => {
    const [prompt, guidance, fixedAnswer] = line.split('|').map((p) => p.trim());
    return {
      worksheet_id: ws!.id,
      position: i,
      prompt: prompt || line,
      guidance: guidance || null,
      fixed_answer: fixedAnswer || null,
      kid_answer: '',
    };
  });

  await supabase.from('worksheet_questions').insert(questionRows);

  revalidatePath(`/dashboard/children/${childId}/worksheets`);
  redirect(`/dashboard/children/${childId}/worksheets`);
}

export async function deleteWorksheet(childId: string, worksheetId: string) {
  const { supabase } = await getOwnedChild(childId);
  await supabase.from('worksheets').delete().eq('id', worksheetId).eq('child_id', childId);
  revalidatePath(`/dashboard/children/${childId}/worksheets`);
}

export async function setQuestionMark(childId: string, worksheetId: string, questionId: string, mark: 'correct' | 'incorrect') {
  const { supabase } = await getOwnedChild(childId);
  await supabase.from('worksheet_questions').update({ mark }).eq('id', questionId).eq('worksheet_id', worksheetId);
  revalidatePath(`/dashboard/children/${childId}/worksheets/${worksheetId}`);
}

export async function setFeedback(childId: string, worksheetId: string, formData: FormData) {
  const { supabase } = await getOwnedChild(childId);
  const feedback = String(formData.get('feedback') || '').trim() || null;
  await supabase.from('worksheets').update({ parent_feedback: feedback }).eq('id', worksheetId).eq('child_id', childId);
  revalidatePath(`/dashboard/children/${childId}/worksheets/${worksheetId}`);
}

export async function confirmMarking(childId: string, worksheetId: string) {
  const { supabase } = await getOwnedChild(childId);

  const { data: ws } = await supabase.from('worksheets').select('code').eq('id', worksheetId).single();

  await supabase.from('worksheets').update({
    status: 'marked',
    marked_date: todayISO(),
  }).eq('id', worksheetId).eq('child_id', childId);

  // If this worksheet is linked to a curriculum code, offer it as evidence
  // by auto-ticking that checklist item too — same behaviour as the old
  // HTML dashboard's marking flow.
  if (ws?.code) {
    const firstCode = ws.code.split(',')[0].trim();
    await supabase
      .from('checklist_items')
      .update({ done: true, date_ticked: todayISO() })
      .eq('child_id', childId)
      .eq('code', firstCode)
      .eq('done', false);
  }

  revalidatePath(`/dashboard/children/${childId}/worksheets`);
  redirect(`/dashboard/children/${childId}/worksheets`);
}
