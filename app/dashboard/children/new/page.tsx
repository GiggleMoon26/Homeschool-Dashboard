import { addChild } from './actions';
import { YEAR_OPTIONS } from '@/lib/nswStages';

const AVATARS = ['🎮', '🕹️', '👾', '⭐', '🚀', '🦖', '🐉', '🎨'];
const COLORS = ['#05d9e8', '#ff2079', '#f9c80e', '#39ff14', '#a239ff'];

export default async function NewChildPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <form action={addChild} className="max-w-sm mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2">Add a child</h1>

        <input name="name" required placeholder="First name" className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3" />

        <div>
          <label className="text-sm text-slate-400 block mb-1">Year level</label>
          <select name="year_level" required defaultValue="" className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 w-full">
            <option value="" disabled>Choose a year...</option>
            {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <p className="text-xs text-slate-500 mt-1">Their curriculum Stage is worked out automatically from this — no need to type it separately.</p>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Avatar</label>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <label key={a} className="cursor-pointer">
                <input type="radio" name="avatar" value={a} defaultChecked={a === AVATARS[0]} className="peer sr-only" />
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
                <input type="radio" name="color" value={c} defaultChecked={c === COLORS[0]} className="peer sr-only" />
                <span
                  className="w-8 h-8 rounded-full block border-2 border-transparent peer-checked:border-white"
                  style={{ backgroundColor: c }}
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-1">Username (what they log in with)</label>
          <input
            name="username" required placeholder="e.g. george" autoCapitalize="none"
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 w-full"
          />
          <p className="text-xs text-slate-500 mt-1">Just for logging in — doesn&apos;t need to be their real name if you&apos;d rather keep it simple.</p>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-1">Password</label>
          <input
            name="password" required minLength={4} type="text" placeholder="At least 4 characters"
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 w-full"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button className="rounded-lg bg-cyan-500 text-black font-semibold py-3 mt-2">Add child</button>
      </form>
    </main>
  );
}
