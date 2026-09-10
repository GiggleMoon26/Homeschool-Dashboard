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

export async function addTask(childId: string, formData: FormData) {
  const { supabase, child } = await getOwnedChild(childId);

  const subject = String(formData.get('subject') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const code = String(formData.get('code') || '').trim() || null;
  const markoff = String(formData.get('markoff') || '').trim() || null;
  const resource = String(formData.get('resource') || '').trim() || null;
  const activityType = String(formData.get('activity_type') || '').trim() || null;
  const days = formData.getAll('days').map(String); // e.g. ['Tue','Wed','Thu']; empty = flexible
  const isRecurring = formData.get('is_recurring') === 'on';
  const specificDate = String(formData.get('specific_date') || '').trim() || null;

  if (!subject || !description) {
    redirect(`/dashboard/children/${childId}/tasks?error=` + encodeURIComponent('Subject and description are required.'));
  }

  const { error } = await supabase.from('tasks').insert({
    family_id: child.family_id,
    child_id: childId,
    subject, description, code, markoff, resource,
    activity_type: activityType,
    // A specific date takes priority — clear the weekday pattern so the two
    // scheduling modes can never both apply to the same task at once.
    days: specificDate ? [] : days,
    is_recurring: specificDate ? false : isRecurring,
    specific_date: specificDate,
  });

  if (error) redirect(`/dashboard/children/${childId}/tasks?error=` + encodeURIComponent(error.message));

  revalidatePath(`/dashboard/children/${childId}/tasks`);
  redirect(`/dashboard/children/${childId}/tasks`);
}

export async function deleteTask(childId: string, taskId: string) {
  const { supabase } = await getOwnedChild(childId);
  await supabase.from('tasks').delete().eq('id', taskId).eq('child_id', childId);
  revalidatePath(`/dashboard/children/${childId}/tasks`);
}

export async function updateTask(childId: string, taskId: string, formData: FormData) {
  const { supabase } = await getOwnedChild(childId);

  const subject = String(formData.get('subject') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const code = String(formData.get('code') || '').trim() || null;
  const markoff = String(formData.get('markoff') || '').trim() || null;
  const resource = String(formData.get('resource') || '').trim() || null;
  const activityType = String(formData.get('activity_type') || '').trim() || null;
  const days = formData.getAll('days').map(String);
  const isRecurring = formData.get('is_recurring') === 'on';
  const specificDate = String(formData.get('specific_date') || '').trim() || null;

  if (!subject || !description) {
    redirect(`/dashboard/children/${childId}/tasks?error=` + encodeURIComponent('Subject and description are required.'));
  }

  const { error } = await supabase.from('tasks').update({
    subject, description, code, markoff, resource,
    activity_type: activityType,
    days: specificDate ? [] : days,
    is_recurring: specificDate ? false : isRecurring,
    specific_date: specificDate,
  }).eq('id', taskId).eq('child_id', childId);

  if (error) redirect(`/dashboard/children/${childId}/tasks?error=` + encodeURIComponent(error.message));

  revalidatePath(`/dashboard/children/${childId}/tasks`);
  redirect(`/dashboard/children/${childId}/tasks`);
}

export async function toggleTaskParent(childId: string, taskId: string, currentlyDone: boolean) {
  const { supabase } = await getOwnedChild(childId);
  await supabase.from('tasks').update({
    done: !currentlyDone,
    date_completed: !currentlyDone ? todayISO() : null,
  }).eq('id', taskId).eq('child_id', childId);
  revalidatePath(`/dashboard/children/${childId}/tasks`);
}

// Manually resets every recurring task back to "not done" for this child —
// run this at the start of a new week so spelling practice etc. reappears
// instead of staying stuck in Completed forever.
export async function resetRecurringTasks(childId: string) {
  const { supabase } = await getOwnedChild(childId);
  await supabase
    .from('tasks')
    .update({ done: false, date_completed: null })
    .eq('child_id', childId)
    .eq('is_recurring', true);
  revalidatePath(`/dashboard/children/${childId}/tasks`);
  revalidatePath(`/kid/${childId}`);
}

// Bulk import — paste a whole week's plan in one go instead of clicking
// "Add Task" a dozen times. Format, one task per line:
//   Subject | Description | Code (optional) | Days (optional, comma-separated) | Recurring (yes/no) | Specific date (optional, YYYY-MM-DD)
// Example:
//   Maths | Practice fractions worksheet | MA3-RQF-01 | Mon,Wed |
//   Spelling | This week's list, Tue-Thu choice | EN3-SPELL-01 | Tue,Wed,Thu | yes
//   Excursion | Local museum visit | | | | 2026-09-15
export async function bulkAddTasks(childId: string, formData: FormData) {
  const { supabase, child } = await getOwnedChild(childId);
  const raw = String(formData.get('bulk_text') || '');

  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const rows = lines.map((line) => {
    const parts = line.split('|').map((p) => p.trim());
    const [subject, description, code, daysRaw, recurringRaw, specificDateRaw] = parts;
    const specificDate = (specificDateRaw || '').trim() || null;
    const days = specificDate ? [] : (daysRaw || '').split(',').map((d) => d.trim()).filter(Boolean);
    const isRecurring = specificDate ? false : (recurringRaw || '').toLowerCase().startsWith('y');
    return {
      family_id: child.family_id,
      child_id: childId,
      subject: subject || 'General',
      description: description || line, // fall back to the raw line if it wasn't formatted with |
      code: code || null,
      days,
      is_recurring: isRecurring,
      specific_date: specificDate,
    };
  }).filter((r) => r.description);

  if (rows.length === 0) {
    redirect(`/dashboard/children/${childId}/tasks?error=` + encodeURIComponent('Nothing to import — paste at least one line.'));
  }

  const { error } = await supabase.from('tasks').insert(rows);
  if (error) redirect(`/dashboard/children/${childId}/tasks?error=` + encodeURIComponent(error.message));

  revalidatePath(`/dashboard/children/${childId}/tasks`);
  redirect(`/dashboard/children/${childId}/tasks`);
}
