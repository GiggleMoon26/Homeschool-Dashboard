import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// Always fetch fresh — this page shows live, frequently-changing data
// and must never serve a cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function ChildHubPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const supabase = await createClient();
  const { data: child } = await supabase
    .from('child_profiles')
    .select('id, name, avatar, color, year_level, stage, username')
    .eq('id', childId)
    .single();

  if (!child) redirect('/dashboard?error=' + encodeURIComponent('Child not found.'));

  const { count: outstandingCount } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('child_id', childId)
    .eq('done', false);

  const { count: pendingMarkingCount } = await supabase
    .from('worksheets')
    .select('id', { count: 'exact', head: true })
    .eq('child_id', childId)
    .eq('status', 'submitted');

  const sections = [
    { href: `/dashboard/children/${childId}/tasks`, label: 'Tasks', icon: '\u2713', color: 'bg-cyan-700 hover:bg-cyan-600', badge: outstandingCount },
    { href: `/dashboard/children/${childId}/checklist`, label: 'Checklist', icon: '\ud83d\udccb', color: 'bg-purple-700 hover:bg-purple-600' },
    { href: `/dashboard/children/${childId}/spelling`, label: 'Spelling', icon: '\ud83d\udd24', color: 'bg-pink-700 hover:bg-pink-600' },
    { href: `/dashboard/children/${childId}/worksheets`, label: 'Worksheets', icon: '\ud83d\udcdd', color: 'bg-yellow-700 hover:bg-yellow-600', badge: pendingMarkingCount },
    { href: `/dashboard/children/${childId}/routine`, label: 'Routine & Chores', icon: '\u2600\ufe0f', color: 'bg-orange-700 hover:bg-orange-600' },
    { href: `/dashboard/children/${childId}/reading`, label: 'Reading Log', icon: '\ud83d\udcd6', color: 'bg-emerald-700 hover:bg-emerald-600' },
    { href: `/dashboard/children/${childId}/learning-record`, label: 'Learning Record', icon: '\ud83d\udcda', color: 'bg-green-700 hover:bg-green-600' },
    { href: `/dashboard/children/${childId}/edit`, label: 'Edit Profile', icon: '\u2699\ufe0f', color: 'bg-slate-700 hover:bg-slate-600' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link href="/dashboard" className="text-sm text-slate-400 underline">&larr; All children</Link>

        <div className="flex items-center gap-3 mt-3 mb-8">
          <span className="text-4xl">{child!.avatar}</span>
          <div>
            <h1 className="text-2xl font-bold">{child!.name}</h1>
            <p className="text-sm text-slate-400">{child!.year_level} · {child!.stage}</p>
            <p className="text-xs text-slate-500">Login: <span className="text-cyan-400">{child!.username || '(not set)'}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {sections.map((s) => (
            <Link key={s.href} href={s.href} className={`relative text-center rounded-lg py-5 ${s.color} transition`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-sm font-semibold">{s.label}</div>
              {!!s.badge && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {s.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
