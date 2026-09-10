import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// Always fetch fresh — this page shows live, frequently-changing data
// and must never serve a cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function ParentReadingLogPage({
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

  const { data: entries } = await supabase
    .from('reading_log')
    .select('id, book_title, author, amount_read, date_read, notes')
    .eq('child_id', childId)
    .order('date_read', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link href={`/dashboard/children/${childId}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold mt-3 mb-1 flex items-center gap-2">
          <span className="text-3xl">{child!.avatar}</span> {child!.name}&apos;s Reading Log
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          {child!.name} logs this themselves from their own dashboard — this is just your view for records purposes.
        </p>

        {(!entries || entries.length === 0) && <p className="text-slate-500 text-sm">Nothing logged yet.</p>}

        <div className="flex flex-col gap-2">
          {entries?.map((e) => (
            <div key={e.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-sm">{e.book_title}</div>
                  {e.author && <div className="text-xs text-slate-500">by {e.author}</div>}
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{e.date_read}</span>
              </div>
              {e.amount_read && <div className="text-xs text-cyan-400 mt-1">{e.amount_read}</div>}
              {e.notes && <div className="text-xs text-slate-400 mt-1 italic">{e.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
