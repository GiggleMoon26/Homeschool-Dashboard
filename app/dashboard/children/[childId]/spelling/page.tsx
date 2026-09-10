import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { setSpellingList, addSpellingIdea, deleteSpellingIdea } from './actions';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function SpellingManagePage({
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
    .select('id, name, avatar')
    .eq('id', childId)
    .single();

  if (!child) redirect('/dashboard?error=' + encodeURIComponent('Child not found.'));

  const { data: activeList } = await supabase
    .from('spelling_lists')
    .select('id, list_name, words, sentences, created_at')
    .eq('child_id', childId)
    .eq('is_active', true)
    .maybeSingle();

  const { data: history } = await supabase
    .from('spelling_practice_history')
    .select('id, attempted_at, score, total')
    .eq('child_id', childId)
    .order('attempted_at', { ascending: false })
    .limit(10);

  const { data: ideas } = await supabase
    .from('idea_items')
    .select('id, category, item_text')
    .eq('child_id', childId)
    .eq('list_type', 'spelling')
    .order('category', { ascending: true });

  const setListWithId = setSpellingList.bind(null, childId);
  const addIdeaWithId = addSpellingIdea.bind(null, childId);

  const categories = [...new Set((ideas || []).map((i) => i.category))];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link href={`/dashboard/children/${childId}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold mt-3 mb-6 flex items-center gap-2">
          <span className="text-3xl">{child!.avatar}</span> {child!.name}&apos;s Spelling
        </h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {activeList && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-sm mb-2">Current active list: {activeList.list_name}</h2>
            <div className="flex flex-col gap-1">
              {activeList.words.map((w: string, i: number) => {
                const sentence = activeList.sentences?.[i];
                return (
                  <div key={w} className="text-sm">
                    <span className="bg-slate-800 px-2 py-1 rounded font-semibold">{w}</span>
                    {sentence ? (
                      <span className="text-slate-400 ml-2">&ldquo;{sentence}&rdquo;</span>
                    ) : (
                      <span className="text-amber-500 ml-2 text-xs">no sentence set — fine unless this word has a homophone (sea/see, etc.)</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <form action={setListWithId} className="flex flex-col gap-3 bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-sm">Set this week&apos;s list</h2>
          <input name="list_name" required placeholder="List name (e.g. List 8)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
          <textarea
            name="words" required rows={5}
            placeholder={'One word per line, with an optional example sentence after a |\nsee | I can see the birds.\nsea | We swam in the sea.\ntree\nread'}
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono"
          />
          <button className="rounded-lg bg-cyan-500 text-black font-semibold py-2 self-start px-4">Set as active list</button>
        </form>

        <h2 className="text-lg font-semibold mb-3">Recent practice scores</h2>
        {(!history || history.length === 0) && <p className="text-slate-500 text-sm mb-6">No practice attempts yet — they can play the spelling quiz as often as they like from their own dashboard.</p>}
        <div className="flex flex-col gap-2 mb-8">
          {history?.map((h) => (
            <div key={h.id} className="flex justify-between text-sm bg-slate-900 border border-slate-700 rounded-lg p-3">
              <span className="text-slate-400">{new Date(h.attempted_at).toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' })}</span>
              <span className="font-semibold text-green-400">{h.score}/{h.total}</span>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-3">Ways to practise (shown to {child!.name})</h2>
        {categories.map((cat) => (
          <div key={cat} className="mb-4">
            <h3 className="text-sm font-semibold text-pink-400 mb-1">{cat}</h3>
            <div className="flex flex-col gap-1">
              {(ideas || []).filter((i) => i.category === cat).map((i) => {
                const deleteWithArgs = deleteSpellingIdea.bind(null, childId, i.id);
                return (
                  <div key={i.id} className="flex justify-between items-center text-sm bg-slate-900 border border-slate-700 rounded-lg p-2">
                    <span>{i.item_text}</span>
                    <form action={deleteWithArgs}><button className="text-xs text-red-400 underline">Remove</button></form>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <form action={addIdeaWithId} className="flex flex-col gap-2 bg-slate-900 border border-slate-700 rounded-lg p-4 mt-2">
          <h3 className="text-sm font-semibold">Add a practice idea</h3>
          <input name="category" required placeholder="Category (e.g. Games & Hunts)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
          <input name="item_text" required placeholder="The idea (e.g. Lego spelling board)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
          <button className="rounded-lg bg-purple-700 text-white font-semibold py-2 self-start px-4">+ Add Idea</button>
        </form>
      </div>
    </main>
  );
}
