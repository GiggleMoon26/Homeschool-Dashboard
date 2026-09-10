import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyChildSessionToken, CHILD_SESSION_COOKIE } from '@/lib/childSession';
import { createAdminClient } from '@/lib/supabase/admin';
import WorksheetFillView from './WorksheetFillView';

// Always fetch fresh — this page shows live, frequently-changing data
// (tasks, checklist progress, worksheet status) and must never serve a
// cached response from an earlier visit.
export const dynamic = "force-dynamic";

export default async function KidWorksheetFillPage({
  params,
}: {
  params: Promise<{ childId: string; worksheetId: string }>;
}) {
  const { worksheetId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(CHILD_SESSION_COOKIE)?.value;
  const session = verifyChildSessionToken(token);
  if (!session) redirect('/kid-login');

  const admin = createAdminClient();

  const { data: worksheet } = await admin
    .from('worksheets')
    .select('id, title, subject, status, parent_feedback, child_id')
    .eq('id', worksheetId)
    .single();

  if (!worksheet || worksheet.child_id !== session.childId) redirect(`/kid/${session.childId}/worksheets`);

  const { data: questions } = await admin
    .from('worksheet_questions')
    .select('id, prompt, kid_answer, mark')
    .eq('worksheet_id', worksheetId)
    .order('position', { ascending: true });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-1">{worksheet.title}</h1>
        <p className="text-slate-400 text-sm mb-6">{worksheet.subject}</p>
        <WorksheetFillView
          worksheetId={worksheetId}
          questions={questions || []}
          status={worksheet.status}
          parentFeedback={worksheet.parent_feedback}
        />
      </div>
    </main>
  );
}
