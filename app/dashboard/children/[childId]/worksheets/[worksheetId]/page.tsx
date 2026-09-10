import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { setQuestionMark, setFeedback, confirmMarking } from '../actions';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function WorksheetMarkingPage({
  params,
}: {
  params: Promise<{ childId: string; worksheetId: string }>;
}) {
  const { childId, worksheetId } = await params;

  const supabase = await createClient();
  const { data: worksheet } = await supabase
    .from('worksheets')
    .select('id, title, subject, code, status, submitted_date, marked_date, parent_feedback')
    .eq('id', worksheetId)
    .eq('child_id', childId)
    .single();

  if (!worksheet) redirect(`/dashboard/children/${childId}/worksheets?error=` + encodeURIComponent('Worksheet not found.'));

  const { data: questions } = await supabase
    .from('worksheet_questions')
    .select('id, position, prompt, guidance, fixed_answer, kid_answer, mark')
    .eq('worksheet_id', worksheetId)
    .order('position', { ascending: true });

  const setFeedbackWithId = setFeedback.bind(null, childId, worksheetId);
  const confirmWithId = confirmMarking.bind(null, childId, worksheetId);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href={`/dashboard/children/${childId}/worksheets`} className="text-sm text-slate-400 underline">&larr; Back to worksheets</Link>
        <h1 className="text-2xl font-bold mt-3 mb-1">{worksheet!.title}</h1>
        <p className="text-slate-400 text-sm mb-6">
          {worksheet!.subject}{worksheet!.code ? ` — ${worksheet!.code}` : ''} — status: {worksheet!.status}
          {worksheet!.submitted_date && ` — submitted ${worksheet!.submitted_date}`}
        </p>

        {worksheet!.status === 'assigned' && (
          <p className="text-slate-500 text-sm">Not submitted yet — nothing to mark.</p>
        )}

        {worksheet!.status !== 'assigned' && (
          <>
            <div className="flex flex-col gap-4 mb-6">
              {questions?.map((q, i) => (
                <div key={q.id} className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                  <div className="font-semibold text-sm mb-2">{i + 1}. {q.prompt}</div>
                  <div className="bg-slate-950 border border-slate-700 rounded p-2 mb-2 text-sm">
                    <span className="text-slate-500 text-xs">Their answer:</span><br />
                    {q.kid_answer || <em className="text-slate-600">(left blank)</em>}
                  </div>
                  {q.fixed_answer && <div className="text-xs text-slate-400 mb-1">Answer: <b className="text-green-400">{q.fixed_answer}</b></div>}
                  {q.guidance && <div className="text-xs text-slate-500 mb-2">What to look for: {q.guidance}</div>}
                  <div className="flex gap-2">
                    <MarkButton childId={childId} worksheetId={worksheetId} questionId={q.id} mark="correct" active={q.mark === 'correct'} label="✔ Correct" />
                    <MarkButton childId={childId} worksheetId={worksheetId} questionId={q.id} mark="incorrect" active={q.mark === 'incorrect'} label="✖ Needs Work" />
                  </div>
                </div>
              ))}
            </div>

            <form action={setFeedbackWithId} className="flex flex-col gap-2 mb-4">
              <label className="text-sm text-slate-400">Feedback (optional)</label>
              <textarea name="feedback" defaultValue={worksheet!.parent_feedback || ''} rows={2} className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
              <button className="text-xs bg-slate-700 text-white rounded-lg py-1.5 px-3 self-start">Save Feedback</button>
            </form>

            {worksheet!.status === 'submitted' ? (
              <form action={confirmWithId}>
                <button className="bg-yellow-500 text-black font-semibold rounded-lg py-2 px-4">Confirm Marking</button>
              </form>
            ) : (
              <p className="text-green-400 text-sm">✅ Marked {worksheet!.marked_date}</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function MarkButton({
  childId, worksheetId, questionId, mark, active, label,
}: {
  childId: string; worksheetId: string; questionId: string; mark: 'correct' | 'incorrect'; active: boolean; label: string;
}) {
  const action = setQuestionMark.bind(null, childId, worksheetId, questionId, mark);
  return (
    <form action={action}>
      <button className={`text-xs px-3 py-1.5 rounded-lg border ${active ? (mark === 'correct' ? 'bg-green-600 border-green-500' : 'bg-red-900 border-red-700') : 'border-slate-600 bg-slate-800'}`}>
        {label}
      </button>
    </form>
  );
}
