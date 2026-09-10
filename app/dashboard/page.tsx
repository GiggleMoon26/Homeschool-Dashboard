import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createFamily, signOut, addParentTodo, toggleParentTodo, deleteParentTodo } from './actions';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: family, error: familyError } = await supabase
    .from('families')
    .select('id, name')
    .eq('owner_user_id', user!.id)
    .maybeSingle();

  if (familyError) {
    // This should be impossible now that families.owner_user_id has a
    // unique constraint (migration 006) — but if it ever happens again,
    // show it clearly instead of silently looping back to "create a family"
    // forever, which is what caused a very confusing bug before.
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <p className="text-red-400 max-w-sm text-center">
          Something&apos;s wrong loading your family: {familyError.message}. Please contact support rather than trying to create a new family.
        </p>
      </main>
    );
  }

  if (!family) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <form action={createFamily} className="w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Welcome! 👋</h1>
          <p className="text-slate-400 text-sm">First, give your family a name — this is just for your own reference.</p>
          <input
            name="name" required placeholder="e.g. The Smith Family" autoFocus
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="rounded-lg bg-cyan-500 text-black font-semibold py-3">Continue</button>
        </form>
      </main>
    );
  }

  const { data: children } = await supabase
    .from('child_profiles')
    .select('id, name, avatar, color, year_level, stage')
    .eq('family_id', family.id)
    .order('created_at', { ascending: true });

  const { data: todos } = await supabase
    .from('parent_todos')
    .select('id, title, done')
    .eq('family_id', family.id)
    .order('created_at', { ascending: true });

  const pendingTodos = (todos || []).filter((t) => !t.done);
  const doneTodos = (todos || []).filter((t) => t.done);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{family.name}</h1>
          <form action={signOut}><button className="text-sm text-slate-400 underline">Sign out</button></form>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-300">
            Kids log in at <code className="text-cyan-400">/kid-login</code> on this same site, using
            their own username and password — no special link needed.
          </p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <h2 className="text-lg font-semibold mb-3">This Week&apos;s To-Do (Parent)</h2>
        <p className="text-xs text-slate-500 mb-3">Your own prep tasks — print worksheets, buy supplies, book something in — separate from the kids&apos; tasks.</p>
        <form action={addParentTodo} className="flex gap-2 mb-4">
          <input name="title" required placeholder="e.g. Print George's spelling test" className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm" />
          <button className="bg-cyan-500 text-black font-semibold rounded-lg px-4 text-sm">+ Add</button>
        </form>

        {pendingTodos.length === 0 && doneTodos.length === 0 && (
          <p className="text-slate-500 text-sm mb-8">Nothing on your list yet.</p>
        )}

        <div className="flex flex-col gap-2 mb-4">
          {pendingTodos.map((t) => <TodoRow key={t.id} todo={t} />)}
        </div>

        {doneTodos.length > 0 && (
          <details className="mb-8">
            <summary className="cursor-pointer text-sm text-slate-400">Done ({doneTodos.length})</summary>
            <div className="flex flex-col gap-2 mt-2">
              {doneTodos.map((t) => <TodoRow key={t.id} todo={t} />)}
            </div>
          </details>
        )}
        {pendingTodos.length > 0 && doneTodos.length === 0 && <div className="mb-4" />}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Children</h2>
          <Link href="/dashboard/children/new" className="text-sm bg-purple-600 px-4 py-2 rounded-lg">+ Add child</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {children?.map((c) => (
            <Link
              key={c.id} href={`/dashboard/children/${c.id}`}
              className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-cyan-500 transition"
              style={{ borderColor: c.color }}
            >
              <div className="text-3xl mb-2">{c.avatar}</div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-slate-400">{c.year_level} · {c.stage}</div>
            </Link>
          ))}
          {(!children || children.length === 0) && (
            <p className="text-slate-400 text-sm">No children added yet — click &ldquo;Add child&rdquo; to get started.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function TodoRow({ todo }: { todo: { id: string; title: string; done: boolean } }) {
  const toggleWithArgs = toggleParentTodo.bind(null, todo.id, todo.done);
  const deleteWithArgs = deleteParentTodo.bind(null, todo.id);
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-lg border border-slate-700 bg-slate-900 ${todo.done ? 'opacity-50' : ''}`}>
      <form action={toggleWithArgs}>
        <button className={`w-6 h-6 rounded border-2 flex items-center justify-center text-sm flex-shrink-0 ${todo.done ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
          {todo.done ? '\u2713' : ''}
        </button>
      </form>
      <span className={`flex-1 text-sm ${todo.done ? 'line-through text-slate-500' : ''}`}>{todo.title}</span>
      <form action={deleteWithArgs}>
        <button className="text-xs text-red-400 underline">Delete</button>
      </form>
    </div>
  );
}
