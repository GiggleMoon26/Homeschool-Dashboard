import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function KidWorksheetsListPage() {
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

  const { data: worksheets } = await admin
    .from('worksheets')
    .select('id, title, subject, status')
    .eq('child_id', session.childId)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link href={`/kid/${child.id}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-xl font-bold mt-3 mb-6 flex items-center gap-2">
          <span className="text-3xl">{child.avatar}</span> Worksheets
        </h1>

        {(!worksheets || worksheets.length === 0) && <p className="text-slate-500 text-sm">Nothing here yet.</p>}

        <div className="flex flex-col gap-2">
          {worksheets?.map((w) => {
            const statusLabel = w.status === 'assigned' ? 'TO DO' : w.status === 'submitted' ? 'SUBMITTED — AWAITING MARKING' : 'MARKED';
            const statusColor = w.status === 'assigned' ? 'text-yellow-400' : w.status === 'submitted' ? 'text-cyan-400' : 'text-green-400';
            return (
              <Link key={w.id} href={`/kid/${child.id}/worksheets/${w.id}`} className="block bg-slate-900 border border-slate-700 rounded-lg p-4">
                <div className="font-semibold">{w.title}</div>
                <div className="text-xs mt-1 flex gap-2">
                  <span className="text-slate-500">{w.subject}</span>
                  <span className={statusColor}>{statusLabel}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
