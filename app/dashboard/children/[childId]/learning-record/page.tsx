import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { updateTaskRecord } from './actions';

// Always fetch fresh — this page shows live, frequently-changing data
// and must never serve a cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function LearningRecordPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const supabase = await createClient();
  const { data: child } = await supabase
    .from('child_profiles')
    .select('id, name, avatar')
    .eq('id', childId)
    .single();

  if (!child) redirect('/dashboard?error=' + encodeURIComponent('Child not found.'));

  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, subject, description, code, date_completed, evidence, notes')
    .eq('child_id', childId)
    .eq('done', true)
    .order('date_completed', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link href={`/dashboard/children/${childId}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold mt-3 mb-1 flex items-center gap-2">
          <span className="text-3xl">{child!.avatar}</span> {child!.name}&apos;s Learning Record
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Every completed task, with evidence and notes for your registration records.
        </p>

        {(!tasks || tasks.length === 0) && (
          <p className="text-slate-500 text-sm">Nothing completed yet — this fills in automatically as tasks get ticked off.</p>
        )}

        {tasks && tasks.length > 0 && (
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              {/* Header row */}
              <div className="grid grid-cols-[2fr_1.3fr_1.5fr_auto] gap-2 px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-700">
                <div>Task</div>
                <div>Evidence</div>
                <div>Notes</div>
                <div></div>
              </div>

              {tasks.map((t, i) => {
                const updateWithArgs = updateTaskRecord.bind(null, childId, t.id);
                return (
                  <form
                    key={t.id} action={updateWithArgs}
                    className={`grid grid-cols-[2fr_1.3fr_1.5fr_auto] gap-2 items-center px-2 py-2 ${i % 2 ? 'bg-slate-900/50' : ''}`}
                  >
                    <div className="text-sm">
                      <div>{t.description}</div>
                      <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                        <span>{t.subject}</span>
                        {t.code && <span className="bg-slate-800 px-1.5 py-0.5 rounded">{t.code}</span>}
                        <span>{t.date_completed}</span>
                      </div>
                    </div>
                    <input
                      name="evidence" defaultValue={t.evidence || ''} placeholder="e.g. photo saved"
                      className="rounded bg-slate-800 border border-slate-700 px-2 py-1.5 text-sm w-full"
                    />
                    <input
                      name="notes" defaultValue={t.notes || ''} placeholder="Observations..."
                      className="rounded bg-slate-800 border border-slate-700 px-2 py-1.5 text-sm w-full"
                    />
                    <button className="text-xs bg-cyan-500 text-black font-semibold rounded px-2 py-1.5 whitespace-nowrap">Save</button>
                  </form>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
