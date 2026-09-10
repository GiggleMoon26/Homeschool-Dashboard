import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';
import CalendarView from './CalendarView';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function KidCalendarPage() {
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

  const { data: tasks } = await admin
    .from('tasks')
    .select('id, subject, description, code, done, days, specific_date')
    .eq('child_id', session.childId)
    .order('created_at', { ascending: true });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link href={`/kid/${child.id}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-xl font-bold mt-3 mb-6 flex items-center gap-2">
          <span className="text-3xl">{child.avatar}</span> {child.name}&apos;s Calendar
        </h1>
        <CalendarView tasks={tasks || []} />
      </div>
    </main>
  );
}
