import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function KidChecklistPage() {
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

  const { data: items } = await admin
    .from('checklist_items')
    .select('code, title, subject, is_ongoing, done')
    .eq('child_id', session.childId)
    .order('subject', { ascending: true });

  const subjects = [...new Set((items || []).map((i) => i.subject))];
  const totalDone = (items || []).filter((i) => i.done).length;
  const total = (items || []).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <Link href={`/kid/${child.id}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-xl font-bold mt-3 mb-1 flex items-center gap-2">
          <span className="text-3xl">{child.avatar}</span> My Checklist
        </h1>
        <p className="text-slate-400 text-sm mb-6">{totalDone}/{total} ticked off so far — your parent confirms these once you've shown them.</p>

        {subjects.map((subject) => {
          const subjectItems = (items || []).filter((i) => i.subject === subject);
          const subjectDone = subjectItems.filter((i) => i.done).length;
          return (
            <div key={subject} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-sm">{subject}</h2>
                <span className="text-xs text-slate-500">{subjectDone}/{subjectItems.length}</span>
              </div>
              <div className="flex flex-col gap-1">
                {subjectItems.map((item) => (
                  <div key={item.code} className={`flex items-center gap-2 text-sm p-2 rounded ${item.done ? 'text-slate-500 line-through' : ''}`}>
                    <span>{item.done ? '✅' : '⬜'}</span>
                    <span>{item.title}</span>
                    {item.is_ongoing && <span className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded">ongoing</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
