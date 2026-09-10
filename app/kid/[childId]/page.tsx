import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';
import { kidLogout } from './actions';
import TaskItem from './TaskItem';
import RoutineItem from './RoutineItem';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

import { fmtLocalISO, dayCodeFor, formatLongDateSydney } from '@/lib/dateUtils';
const WEEKDAY_ORDER: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

export default async function KidDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CHILD_SESSION_COOKIE)?.value;
  const session = verifyChildSessionToken(token);
  if (!session) redirect('/kid-login');

  const admin = createAdminClient();

  const { data: child } = await admin
    .from('child_profiles')
    .select('id, name, avatar, color')
    .eq('id', session.childId)
    .single();

  if (!child) redirect('/kid-login');

  const { data: tasks } = await admin
    .from('tasks')
    .select('id, subject, description, code, done, days, specific_date')
    .eq('child_id', session.childId)
    .order('created_at', { ascending: true });

  const { data: routineItems } = await admin
    .from('routine_items')
    .select('id, title, category, last_completed_date')
    .eq('child_id', session.childId)
    .order('category', { ascending: true });

  const now = new Date();
  const today = dayCodeFor(now);
  const todayISO = fmtLocalISO(now);
  const allTasks = tasks || [];

  // Only tasks genuinely allocated to today — either a specific date match,
  // or a recurring weekday match. Flexible/unallocated tasks are
  // deliberately excluded here; they stay in the parent's Task Manager
  // until allocated to a day, per your request.
  const todayTasks = allTasks.filter((t) => {
    if (t.done) return false;
    if (t.specific_date) return t.specific_date === todayISO;
    return t.days && t.days.length > 0 && t.days.includes(today);
  });

  // Overdue: a specific date that's already passed, or a weekday allocation
  // earlier this week that never got ticked off. Not deleted or hidden —
  // just surfaced clearly so it doesn't quietly slip past unnoticed. It'll
  // keep showing here (and reappear next week for weekday tasks) until
  // it's either done, or a parent removes it after checking in.
  const todayWeekdayOrder = WEEKDAY_ORDER[today] ?? 0;
  const overdueTasks = allTasks.filter((t) => {
    if (t.done) return false;
    if (t.specific_date) return t.specific_date < todayISO;
    if (t.days && t.days.length > 0) {
      return t.days.some((d: string) => (WEEKDAY_ORDER[d] ?? 0) < todayWeekdayOrder);
    }
    return false;
  });

  const completedTasks = allTasks.filter((t) => t.done);

  const morning = (routineItems || []).map((i) => ({ ...i, doneToday: i.last_completed_date === todayISO })).filter((i) => i.category === 'morning');
  const chores = (routineItems || []).map((i) => ({ ...i, doneToday: i.last_completed_date === todayISO })).filter((i) => i.category === 'chore');

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-3xl">{child.avatar}</span> Welcome back, {child.name}!
          </h1>
          <form action={kidLogout}><button className="text-xs text-slate-400 underline mt-2">Switch player</button></form>
        </div>
        <p className="text-slate-400 text-sm mb-1">This is what we have for you today.</p>
        <p className="text-cyan-400 text-2xl sm:text-3xl font-bold mb-6">
          {formatLongDateSydney(now)}
        </p>

        {overdueTasks.length > 0 && (
          <>
            <h2 className="text-sm uppercase tracking-wide text-amber-400 mb-2">⚠️ Overdue ({overdueTasks.length})</h2>
            <p className="text-xs text-slate-500 mb-2">These didn&apos;t get done when first scheduled — still worth doing if you can!</p>
            <div className="flex flex-col gap-2 mb-6">
              {overdueTasks.map((t) => <TaskItem key={t.id} task={t} />)}
            </div>
          </>
        )}

        {morning.length > 0 && (
          <>
            <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">Morning Routine</h2>
            <div className="flex flex-col gap-2 mb-6">
              {morning.map((i) => <RoutineItem key={i.id} item={i} />)}
            </div>
          </>
        )}

        {chores.length > 0 && (
          <>
            <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">Daily Chores</h2>
            <div className="flex flex-col gap-2 mb-6">
              {chores.map((i) => <RoutineItem key={i.id} item={i} />)}
            </div>
          </>
        )}

        <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">Today&apos;s Tasks</h2>
        <div className="flex flex-col gap-2 mb-8">
          {todayTasks.length === 0 && <p className="text-slate-500 text-sm">Nothing scheduled for today — nice work! 🎉</p>}
          {todayTasks.map((t) => <TaskItem key={t.id} task={t} />)}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <Link href={`/kid/${child.id}/calendar`} className="flex-1 text-center text-sm bg-cyan-700 hover:bg-cyan-600 rounded-lg py-2 min-w-[45%]">
            🗓️ Calendar
          </Link>
          <Link href={`/kid/${child.id}/spelling`} className="flex-1 text-center text-sm bg-pink-700 hover:bg-pink-600 rounded-lg py-2 min-w-[45%]">
            🔤 Spelling
          </Link>
          <Link href={`/kid/${child.id}/worksheets`} className="flex-1 text-center text-sm bg-yellow-700 hover:bg-yellow-600 rounded-lg py-2 min-w-[45%]">
            📝 Worksheets
          </Link>
          <Link href={`/kid/${child.id}/reading`} className="flex-1 text-center text-sm bg-emerald-700 hover:bg-emerald-600 rounded-lg py-2 min-w-[45%]">
            📚 Reading Log
          </Link>
        </div>

        {completedTasks.length > 0 && (
          <>
            <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">Completed ({completedTasks.length})</h2>
            <div className="flex flex-col gap-2">
              {completedTasks.map((t) => <TaskItem key={t.id} task={t} />)}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
