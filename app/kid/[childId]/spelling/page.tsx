import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function KidSpellingPage() {
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

  const { data: activeList } = await admin
    .from('spelling_lists')
    .select('list_name, words, sentences')
    .eq('child_id', session.childId)
    .eq('is_active', true)
    .maybeSingle();

  const { data: history } = await admin
    .from('spelling_practice_history')
    .select('score, total, attempted_at')
    .eq('child_id', session.childId)
    .order('attempted_at', { ascending: false })
    .limit(5);

  const { data: ideas } = await admin
    .from('idea_items')
    .select('category, item_text')
    .eq('child_id', session.childId)
    .eq('list_type', 'spelling')
    .order('category', { ascending: true });

  const categories = [...new Set((ideas || []).map((i) => i.category))];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <Link href={`/kid/${child.id}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-xl font-bold mt-3 mb-1 flex items-center gap-2">
          <span className="text-3xl">{child.avatar}</span> Spelling
        </h1>

        {activeList ? (
          <>
            <p className="text-slate-400 text-sm mb-3">{activeList.list_name}</p>
            <div className="flex flex-col gap-2 mb-6">
              {activeList.words.map((w: string, i: number) => {
                const sentence = activeList.sentences?.[i];
                return (
                  <div key={w} className="bg-pink-950/40 border border-pink-800 rounded-lg p-3">
                    <div className="font-semibold text-center">{w}</div>
                    {sentence && <div className="text-xs text-slate-400 text-center mt-1">&ldquo;{sentence}&rdquo;</div>}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-slate-500 text-sm mb-6">No spelling list set yet — ask a parent to add one.</p>
        )}

        {/* A genuinely separate page — the word list above never appears
            anywhere in this page's content, only spoken aloud during the
            quiz. No need for an actual new browser tab to achieve that. */}
        <Link
          href={`/kid/${child.id}/spelling/quiz`}
          className="block text-center bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded-lg text-lg mb-6"
        >
          🎮 Open Spelling Test
        </Link>

        {history && history.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Your recent scores</h2>
            {history.map((h, i) => (
              <div key={i} className="text-sm text-slate-400 mb-1">
                {new Date(h.attempted_at).toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' })}: <b className="text-green-400">{h.score}/{h.total}</b>
              </div>
            ))}
          </div>
        )}

        {categories.length > 0 && (
          <>
            <h2 className="text-sm font-semibold mb-2">Ways to practise</h2>
            {categories.map((cat) => (
              <div key={cat} className="mb-4">
                <h3 className="text-xs font-semibold text-pink-400 mb-1">{cat}</h3>
                {(ideas || []).filter((i) => i.category === cat).map((i, idx) => (
                  <div key={idx} className="text-sm bg-slate-900 border border-slate-700 rounded-lg p-2 mb-1">{i.item_text}</div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
