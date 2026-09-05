import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createFamily, signOut } from './actions';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: family } = await supabase
    .from('families')
    .select('id, name')
    .eq('owner_user_id', user!.id)
    .maybeSingle();

  if (!family) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <form action={createFamily} className="w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Welcome! 👋</h1>
          <p className="text-slate-400 text-sm">First, give your family a name — this is just for your own reference.</p>
          <input
            name="name" required placeholder="e.g. The Smith Family" autoFocus
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="rounded-lg bg-cyan-500 text-black font-semibold py-3">Continue</button>
        </form>
      </main>
    );
  }

  const { data: children } = await supabase
    .from('child_profiles')
    .select('id, name, avatar, color, year_level, stage, username')
    .eq('family_id', family.id)
    .order('created_at', { ascending: true });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{family.name}</h1>
          <form action={signOut}><button className="text-sm text-slate-400 underline">Sign out</button></form>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-300">
            Kids log in at <code className="text-cyan-400">/kid-login</code> on this same site, using
            their own username and password — no special link needed, just tell them what you set below.
          </p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Children</h2>
          <Link href="/dashboard/children/new" className="text-sm bg-purple-600 px-4 py-2 rounded-lg">+ Add child</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {children?.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-700 rounded-lg p-4" style={{ borderColor: c.color }}>
              <div className="text-3xl mb-2">{c.avatar}</div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-slate-400">{c.year_level} · {c.stage}</div>
              <div className="text-xs text-slate-500 mt-2">
                Login username: <span className="text-cyan-400">{c.username || '(not set — edit to add one)'}</span>
              </div>
              <div className="flex gap-3 mt-3">
                <Link href={`/dashboard/children/${c.id}/tasks`} className="text-xs text-cyan-400 underline">Tasks</Link>
                <Link href={`/dashboard/children/${c.id}/checklist`} className="text-xs text-cyan-400 underline">Checklist</Link>
                <Link href={`/dashboard/children/${c.id}/edit`} className="text-xs text-slate-400 underline">Edit</Link>
              </div>
            </div>
          ))}
          {(!children || children.length === 0) && (
            <p className="text-slate-400 text-sm">No children added yet — click &ldquo;Add child&rdquo; to get started.</p>
          )}
        </div>
      </div>
    </main>
  );
}
