import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { toggleChecklistItem } from './actions';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const supabase = await createClient();
  const { data: child } = await supabase
    .from('child_profiles')
    .select('id, name, avatar, stage')
    .eq('id', childId)
    .single();

  if (!child) redirect('/dashboard?error=' + encodeURIComponent('Child not found.'));

  const { data: items } = await supabase
    .from('checklist_items')
    .select('id, code, title, plain_explanation, subject, khan_resource, twinkl_resource, other_ideas, markoff_criteria, is_ongoing, done, date_ticked')
    .eq('child_id', childId)
    .order('subject', { ascending: true });

  const subjects = [...new Set((items || []).map((i) => i.subject))];
  const totalDone = (items || []).filter((i) => i.done).length;
  const total = (items || []).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href={`/dashboard/children/${childId}`} className="text-sm text-slate-400 underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold mt-3 mb-1 flex items-center gap-2">
          <span className="text-3xl">{child!.avatar}</span> {child!.name}&apos;s Checklist
        </h1>
        <p className="text-slate-400 text-sm mb-6">{child!.stage} &middot; {totalDone}/{total} outcomes ticked off</p>

        {total === 0 && (
          <p className="text-slate-400 text-sm">
            No checklist items yet — this gets populated automatically from the stage set on their profile.
            Edit their profile and make sure Stage is set to something like &ldquo;Stage 1&rdquo;, &ldquo;Stage 3&rdquo;, or &ldquo;Stage 5&rdquo;.
          </p>
        )}

        {subjects.map((subject) => {
          const subjectItems = (items || []).filter((i) => i.subject === subject);
          const subjectDone = subjectItems.filter((i) => i.done).length;
          return (
            <div key={subject} className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">{subject}</h2>
                <span className="text-xs text-slate-500">{subjectDone}/{subjectItems.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {subjectItems.map((item) => {
                  const toggleWithArgs = toggleChecklistItem.bind(null, childId, item.id, item.done);
                  const resources = [
                    item.khan_resource ? `Khan: ${item.khan_resource}` : '',
                    item.twinkl_resource ? `Twinkl: ${item.twinkl_resource}` : '',
                    item.other_ideas ? `Other: ${item.other_ideas}` : '',
                  ].filter(Boolean);
                  return (
                    <div key={item.id} className={`p-3 rounded-lg border border-slate-700 bg-slate-900 ${item.done ? 'opacity-60' : ''}`}>
                      <div className="flex items-start gap-3">
                        <form action={toggleWithArgs}>
                          <button className={`w-6 h-6 rounded border-2 flex items-center justify-center text-sm flex-shrink-0 ${item.done ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}>
                            {item.done ? '✓' : ''}
                          </button>
                        </form>
                        <div className="flex-1">
                          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm items-baseline">
                            <span className="text-xs text-slate-500 font-semibold">Code:</span>
                            <span className="text-cyan-400 font-mono text-xs">
                              {item.code}
                              {item.is_ongoing && <span className="ml-2 bg-purple-900 text-purple-200 px-2 py-0.5 rounded">ongoing</span>}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">Outcome:</span>
                            <span>
                              {item.title}
                              {item.plain_explanation && <span className="block text-xs text-slate-500 italic mt-0.5">{item.plain_explanation}</span>}
                            </span>
                          </div>
                          {resources.length > 0 && (
                            <div className="text-xs text-slate-600 mt-1.5">{resources.join(' · ')}</div>
                          )}
                          {item.done && item.date_ticked && (
                            <div className="text-xs text-green-600 mt-1">Ticked {item.date_ticked}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
