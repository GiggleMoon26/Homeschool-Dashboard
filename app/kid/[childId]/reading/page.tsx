import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';
import { todayISO } from '@/lib/dateUtils';
import { addReadingLogEntry, deleteReadingLogEntry } from './actions';

// Always fetch fresh — this page shows live, frequently-changing data
// and must never serve a cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function KidReadingLogPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const cookieStore = await cookies();
  const token = cookieStore.get(CHILD_SESSION_COOKIE)?.value;
  const session = verifyChildSessionToken(token);
  if (!session) redirect('/kid-login');

  const admin = createAdminClient();
  const { data: child } = await admin
    .from('child_profiles')
    .select('id, name, avatar')
    .eq('id', session.childId)
    .single();
  if (!child) redirect('/kid-login');

  const { data: entries } = await admin
    .from('reading_log')
    .select('id, book_title, author, amount_read, date_read, notes')
    .eq('child_id', session.childId)
    .order('date_read', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <Link href={`/kid/${child.id}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-xl font-bold mt-3 mb-6 flex items-center gap-2">
          <span className="text-3xl">{child.avatar}</span> My Reading Log
        </h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form action={addReadingLogEntry} className="flex flex-col gap-3 bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-sm">What are you reading?</h2>
          <input name="book_title" required placeholder="Book title" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
          <input name="author" placeholder="Author (optional)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
          <div>
            <input name="amount_read" placeholder="How much? e.g. 'Finished the book', 'Chapters 1-2', '20 minutes'" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm w-full" />
            <p className="text-xs text-slate-500 mt-1">Whatever makes sense — a whole book, a few chapters, or just how long you read for.</p>
          </div>
          <input name="date_read" type="date" defaultValue={todayISO()} className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
          <textarea name="notes" rows={2} placeholder="What did you think? (optional)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
          <button className="rounded-lg bg-cyan-500 text-black font-semibold py-2 self-start px-4">+ Add to my log</button>
        </form>

        <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">Your reading history ({entries?.length || 0})</h2>
        {(!entries || entries.length === 0) && <p className="text-slate-500 text-sm">Nothing logged yet — add the book you&apos;re reading today above.</p>}

        <div className="flex flex-col gap-2">
          {entries?.map((e) => {
            const deleteWithArgs = deleteReadingLogEntry.bind(null, e.id);
            return (
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
                <form action={deleteWithArgs} className="mt-1">
                  <button className="text-xs text-red-400 underline">Remove</button>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
