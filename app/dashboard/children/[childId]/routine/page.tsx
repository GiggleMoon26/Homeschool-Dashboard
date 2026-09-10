import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { addRoutineItem, deleteRoutineItem } from './actions';
import { todayISO } from '@/lib/dateUtils';

// Always fetch fresh — this page shows live, frequently-changing data
// and must never serve a cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function RoutinePage({
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

  const { data: items } = await supabase
    .from('routine_items')
    .select('id, title, category, last_completed_date')
    .eq('child_id', childId)
    .order('category', { ascending: true });

  const addWithId = addRoutineItem.bind(null, childId);
  const morning = (items || []).filter((i) => i.category === 'morning');
  const chores = (items || []).filter((i) => i.category === 'chore');

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link href={`/dashboard/children/${childId}`} className="text-sm text-slate-400 underline">&larr; Back to {child!.name}</Link>
        <h1 className="text-2xl font-bold mt-3 mb-6 flex items-center gap-2">
          <span className="text-3xl">{child!.avatar}</span> {child!.name}&apos;s Routine &amp; Chores
        </h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form action={addWithId} className="flex flex-col gap-3 bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-sm">Add an item</h2>
          <input name="title" required placeholder="e.g. Make bed, Brush teeth, Feed the dog" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
          <select name="category" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm">
            <option value="morning">Morning routine</option>
            <option value="chore">Daily chore</option>
          </select>
          <button className="rounded-lg bg-cyan-500 text-black font-semibold py-2 self-start px-4">+ Add</button>
        </form>

        <h2 className="text-lg font-semibold mb-3">Morning routine ({morning.length})</h2>
        <div className="flex flex-col gap-2 mb-8">
          {morning.length === 0 && <p className="text-slate-500 text-sm">None yet.</p>}
          {morning.map((i) => <ItemRow key={i.id} item={i} childId={childId} />)}
        </div>

        <h2 className="text-lg font-semibold mb-3">Daily chores ({chores.length})</h2>
        <div className="flex flex-col gap-2">
          {chores.length === 0 && <p className="text-slate-500 text-sm">None yet.</p>}
          {chores.map((i) => <ItemRow key={i.id} item={i} childId={childId} />)}
        </div>
      </div>
    </main>
  );
}

function ItemRow({ item, childId }: { item: { id: string; title: string; last_completed_date: string | null }; childId: string }) {
  const deleteWithArgs = deleteRoutineItem.bind(null, childId, item.id);
  const today = todayISO();
  const doneToday = item.last_completed_date === today;
  return (
    <div className="flex justify-between items-center bg-slate-900 border border-slate-700 rounded-lg p-3">
      <span className="text-sm">{item.title} {doneToday && <span className="text-green-400 text-xs ml-2">✓ done today</span>}</span>
      <form action={deleteWithArgs}><button className="text-xs text-red-400 underline">Delete</button></form>
    </div>
  );
}
