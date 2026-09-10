import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';
import SpellingQuizView from './SpellingQuizView';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

// Deliberately its own page (opened in a new tab from the main Spelling
// page) — this page's rendered content never includes the actual word
// list anywhere, only the interactive quiz that speaks each word aloud.
export default async function SpellingQuizPage() {
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
    .select('words, sentences')
    .eq('child_id', session.childId)
    .eq('is_active', true)
    .maybeSingle();

  const pairs = (activeList?.words || []).map((word: string, i: number) => ({
    word,
    sentence: activeList?.sentences?.[i] || '',
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <span className="text-3xl">{child.avatar}</span> Spelling Test
        </h1>
        <SpellingQuizView pairs={pairs} recentHistory={[]} />
      </div>
    </main>
  );
}
