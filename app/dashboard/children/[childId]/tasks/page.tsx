import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { addTask, deleteTask, toggleTaskParent, resetRecurringTasks, bulkAddTasks } from './actions';
import AddTaskForm from './AddTaskForm';

export default async function TaskManagerPage({
  params,
  searchParams,
}: {
  params: Promise<{ childId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { childId } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: child } = await supabase
    .from('child_profiles')
    .select('id, name, avatar')
    .eq('id', childId)
    .single();

  if (!child) redirect('/dashboard?error=' + encodeURIComponent('Child not found.'));

  const { data: checklist } = await supabase
    .from('checklist_items')
    .select('code, title, markoff_criteria, khan_resource, twinkl_resource, other_ideas')
    .eq('child_id', childId)
    .order('subject', { ascending: true });

  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, subject, description, code, days, is_recurring, done, date_completed')
    .eq('child_id', childId)
    .order('created_at', { ascending: true });

  const addTaskWithId = addTask.bind(null, childId);
  const resetRecurringWithId = resetRecurringTasks.bind(null, childId);
  const bulkAddWithId = bulkAddTasks.bind(null, childId);

  const flexTasks = (tasks || []).filter((t) => !t.days || t.days.length === 0);
  const dayTasks = (tasks || []).filter((t) => t.days && t.days.length > 0);
  const recurringCount = (tasks || []).filter((t) => t.is_recurring).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-sm text-slate-400 underline">&larr; Back to dashboard</Link>
        <h1 className="text-2xl font-bold mt-3 mb-6 flex items-center gap-2">
          <span className="text-3xl">{child!.avatar}</span> {child!.name}&apos;s Tasks
        </h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {(!checklist || checklist.length === 0) && (
          <p className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800 rounded-lg p-3 mb-4">
            No curriculum codes found for {child!.name} yet — the code dropdown below will be empty.
            This usually means either their Year level isn&apos;t set on their profile, or their Stage
            doesn&apos;t have curriculum data built in yet (only Stage 1, 3, and 5 exist so far).
            You can still add tasks without linking a code.
          </p>
        )}

        <AddTaskForm action={addTaskWithId} checklist={checklist || []} />

        <details className="mt-4 bg-slate-900 border border-slate-700 rounded-lg p-4">
          <summary className="cursor-pointer font-semibold text-sm">📋 Paste in a whole week's plan at once</summary>
          <p className="text-xs text-slate-500 mt-2 mb-2">
            One task per line: <code className="text-cyan-400">Subject | Description | Code | Days | Recurring</code>
            <br />Code, Days, and Recurring are optional — e.g. <code className="text-cyan-400">Spelling | This week's list | EN3-SPELL-01 | Tue,Wed,Thu | yes</code>
          </p>
          <form action={bulkAddWithId} className="flex flex-col gap-2">
            <textarea
              name="bulk_text" rows={6} placeholder={'Maths | Fractions worksheet | MA3-RQF-01 | Mon,Wed |\nSpelling | This week\u2019s list | EN3-SPELL-01 | Tue,Wed,Thu | yes'}
              className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono"
            />
            <button className="rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 self-start px-4">Import these tasks</button>
          </form>
        </details>

        {recurringCount > 0 && (
          <form action={resetRecurringWithId} className="mt-4">
            <button className="text-sm bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg">
              🔄 Start a new week (reset {recurringCount} recurring task{recurringCount === 1 ? '' : 's'})
            </button>
          </form>
        )}

        <h2 className="text-lg font-semibold mt-8 mb-3">Day-specific tasks ({dayTasks.length})</h2>
        <div className="flex flex-col gap-2 mb-8">
          {dayTasks.length === 0 && <p className="text-slate-500 text-sm">None yet.</p>}
          {dayTasks.map((t) => (
            <TaskRow key={t.id} task={t} childId={childId} onToggle={toggleTaskParent} onDelete={deleteTask} />
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-3">This week, whenever it fits ({flexTasks.length})</h2>
        <div className="flex flex-col gap-2">
          {flexTasks.length === 0 && <p className="text-slate-500 text-sm">None yet.</p>}
          {flexTasks.map((t) => (
            <TaskRow key={t.id} task={t} childId={childId} onToggle={toggleTaskParent} onDelete={deleteTask} />
          ))}
        </div>
      </div>
    </main>
  );
}

function TaskRow({
  task, childId, onToggle, onDelete,
}: {
  task: { id: string; subject: string; description: string; code: string | null; days: string[]; is_recurring: boolean; done: boolean; date_completed: string | null };
  childId: string;
  onToggle: (childId: string, taskId: string, currentlyDone: boolean) => void;
  onDelete: (childId: string, taskId: string) => void;
}) {
  const toggleWithArgs = onToggle.bind(null, childId, task.id, task.done);
  const deleteWithArgs = onDelete.bind(null, childId, task.id);

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border border-slate-700 bg-slate-900 ${task.done ? 'opacity-50' : ''}`}>
      <form action={toggleWithArgs}>
        <button className={`w-6 h-6 rounded border-2 flex items-center justify-center text-sm ${task.done ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
          {task.done ? '✓' : ''}
        </button>
      </form>
      <div className="flex-1">
        <div className={task.done ? 'line-through' : ''}>{task.description}</div>
        <div className="text-xs text-slate-500 mt-1 flex gap-2 flex-wrap items-center">
          <span>{task.subject}</span>
          {task.code && <span className="bg-slate-800 px-2 py-0.5 rounded">{task.code}</span>}
          {task.days?.length > 0 && <span className="bg-slate-800 px-2 py-0.5 rounded">{task.days.join(', ')}</span>}
          {task.is_recurring && <span className="bg-purple-900 text-purple-200 px-2 py-0.5 rounded">🔄 recurring</span>}
        </div>
      </div>
      <form action={deleteWithArgs}>
        <button className="text-xs text-red-400 underline">Delete</button>
      </form>
    </div>
  );
}
