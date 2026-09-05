import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';
import { kidLogout } from './actions';
import TaskItem from './TaskItem';

const DAY_CODES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    .select('id, subject, description, code, done, days')
    .eq('child_id', session.childId)
    .order('created_at', { ascending: true });

  const today = DAY_CODES[new Date().getDay()];
  const allTasks = tasks || [];
  const todayTasks = allTasks.filter((t) => !t.done && (!t.days || t.days.length === 0 || t.days.includes(today)));
  const completedTasks = allTasks.filter((t) => t.done);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-3xl">{child.avatar}</span> {child.name}
          </h1>
          <form action={kidLogout}><button className="text-sm text-slate-400 underline">Switch player</button></form>
        </div>

        <Link href={`/kid/${child.id}/checklist`} className="block text-center text-sm bg-purple-700 hover:bg-purple-600 rounded-lg py-2 mb-6">
          📋 View my curriculum checklist
        </Link>

        <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">Today &amp; flexible tasks</h2>
        <div className="flex flex-col gap-2 mb-8">
          {todayTasks.length === 0 && <p className="text-slate-500 text-sm">Nothing left — nice work! 🎉</p>}
          {todayTasks.map((t) => <TaskItem key={t.id} task={t} />)}
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
