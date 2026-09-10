import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createWorksheet, deleteWorksheet } from './actions';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function WorksheetsListPage({
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

  const { data: worksheets } = await supabase
    .from('worksheets')
    .select('id, title, subject, code, status, submitted_date, marked_date')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  const createWithId = createWorksheet.bind(null, childId);
  const pending = (worksheets || []).filter((w) => w.status === 'submitted');
  const others = (worksheets || []).filter((w) => w.status !== 'submitted');

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href={`/dashboard/children/${childId}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold mt-3 mb-6 flex items-center gap-2">
          <span className="text-3xl">{child!.avatar}</span> {child!.name}&apos;s Worksheets
        </h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form action={createWithId} className="flex flex-col gap-3 bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-sm">Create a worksheet</h2>
          <input name="title" required placeholder="Title (e.g. Friday Maths Quiz)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <input name="subject" placeholder="Subject" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm flex-1" />
            <input name="code" placeholder="Curriculum code (optional)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm flex-1" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Questions, one per line: <code className="text-cyan-400">Prompt | Guidance | Fixed Answer</code> (Guidance and Fixed Answer are optional)
            </label>
            <textarea
              name="questions" required rows={6}
              placeholder={'Solve: 5x + 3 = 28 | | x = 5\nWhich piece of writing are you most proud of, and why? | Genuine and specific, names a real piece |'}
              className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono w-full"
            />
          </div>
          <button className="rounded-lg bg-cyan-500 text-black font-semibold py-2 self-start px-4">Create Worksheet</button>
        </form>

        {pending.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-3 text-yellow-400">Awaiting marking ({pending.length})</h2>
            <div className="flex flex-col gap-2 mb-8">
              {pending.map((w) => <WorksheetRow key={w.id} w={w} childId={childId} onDelete={deleteWorksheet} />)}
            </div>
          </>
        )}

        <h2 className="text-lg font-semibold mb-3">All worksheets</h2>
        <div className="flex flex-col gap-2">
          {others.length === 0 && pending.length === 0 && <p className="text-slate-500 text-sm">None yet.</p>}
          {others.map((w) => <WorksheetRow key={w.id} w={w} childId={childId} onDelete={deleteWorksheet} />)}
        </div>
      </div>
    </main>
  );
}

function WorksheetRow({
  w, childId, onDelete,
}: {
  w: { id: string; title: string; subject: string | null; code: string | null; status: string };
  childId: string;
  onDelete: (childId: string, worksheetId: string) => void;
}) {
  const statusColor = w.status === 'assigned' ? 'text-slate-400' : w.status === 'submitted' ? 'text-yellow-400' : 'text-green-400';
  const deleteWithArgs = onDelete.bind(null, childId, w.id);
  return (
    <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg p-3">
      <Link href={`/dashboard/children/${childId}/worksheets/${w.id}`} className="flex-1">
        <div className="font-semibold text-sm">{w.title}</div>
        <div className="text-xs text-slate-500 flex gap-2 mt-1">
          {w.subject && <span>{w.subject}</span>}
          {w.code && <span className="bg-slate-800 px-2 py-0.5 rounded">{w.code}</span>}
          <span className={statusColor}>{w.status}</span>
        </div>
      </Link>
      <form action={deleteWithArgs}>
        <button className="text-xs text-red-400 underline">Delete</button>
      </form>
    </div>
  );
}
