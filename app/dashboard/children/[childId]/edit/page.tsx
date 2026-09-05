import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { updateChild, deleteChild } from './actions';
import DeleteChildButton from './DeleteChildButton';
import { YEAR_OPTIONS } from '@/lib/nswStages';

const AVATARS = ['🎮', '🕹️', '👾', '⭐', '🚀', '🦖', '🐉', '🎨'];
const COLORS = ['#05d9e8', '#ff2079', '#f9c80e', '#39ff14', '#a239ff'];

export default async function EditChildPage({
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
    .select('id, name, year_level, stage, avatar, color, username')
    .eq('id', childId)
    .single();

  if (!child) redirect('/dashboard?error=' + encodeURIComponent('Child not found.'));

  const updateChildWithId = updateChild.bind(null, childId);
  const deleteChildWithId = deleteChild.bind(null, childId);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <form action={updateChildWithId} className="max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2">Edit {child!.name}</h1>

        <input name="name" required defaultValue={child!.name} placeholder="First name" className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3" />

        <div>
          <label className="text-sm text-slate-400 block mb-1">Year level</label>
          <select name="year_level" required defaultValue={child!.year_level || ''} className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 w-full">
            <option value="" disabled>Choose a year...</option>
            {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            Current stage: <span className="text-cyan-400">{child!.stage || 'not set'}</span> — changing year level updates this automatically, but won&apos;t re-generate an already-created checklist.
          </p>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Avatar</label>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <label key={a} className="cursor-pointer">
                <input type="radio" name="avatar" value={a} defaultChecked={a === child!.avatar} className="peer sr-only" />
                <span className="text-2xl p-2 rounded-lg block border border-slate-700 peer-checked:border-cyan-400 peer-checked:bg-slate-800">{a}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Colour</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <label key={c} className="cursor-pointer">
                <input type="radio" name="color" value={c} defaultChecked={c === child!.color} className="peer sr-only" />
                <span
                  className="w-8 h-8 rounded-full block border-2 border-transparent peer-checked:border-white"
                  style={{ backgroundColor: c }}
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-1">Username</label>
          <input
            name="username" required defaultValue={child!.username || ''} placeholder="e.g. george" autoCapitalize="none"
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 w-full"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-1">New password (optional)</label>
          <input
            name="password" minLength={4} type="text" placeholder="Leave blank to keep the current password"
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 w-full"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button className="rounded-lg bg-cyan-500 text-black font-semibold py-3 mt-2">Save changes</button>
      </form>

      <div className="max-w-sm mx-auto mt-10 pt-6 border-t border-slate-800">
        <h2 className="text-red-400 font-semibold mb-2">Danger zone</h2>
        <p className="text-slate-500 text-sm mb-3">
          This permanently deletes {child!.name}&apos;s profile and everything attached to it
          (tasks, worksheets, checklist progress). This can&apos;t be undone.
        </p>
        <DeleteChildButton childName={child!.name} deleteAction={deleteChildWithId} />
      </div>
    </main>
  );
}
