'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveAnswer, submitWorksheet } from '../actions';

type Question = {
  id: string;
  prompt: string;
  kid_answer: string;
  mark: string | null;
};

export default function WorksheetFillView({
  worksheetId,
  questions,
  status,
  parentFeedback,
}: {
  worksheetId: string;
  questions: Question[];
  status: string;
  parentFeedback: string | null;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(questions.map((q) => [q.id, q.kid_answer || '']))
  );
  const [isPending, startTransition] = useTransition();
  const locked = status !== 'assigned';

  function handleBlur(questionId: string) {
    if (locked) return;
    startTransition(() => saveAnswer(worksheetId, questionId, answers[questionId]));
  }

  function handleSubmit() {
    if (!confirm('Submit this worksheet? You won\u2019t be able to change your answers after this.')) return;
    startTransition(() => submitWorksheet(worksheetId));
  }

  return (
    <div>
      {questions.map((q, i) => (
        <div key={q.id} className="mb-6">
          <div className="font-semibold mb-2"><b>{i + 1}.</b> {q.prompt}</div>
          <textarea
            rows={3} disabled={locked}
            value={answers[q.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            onBlur={() => handleBlur(q.id)}
            placeholder="Type your answer..."
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm disabled:opacity-60"
          />
          {status === 'marked' && (
            <div className="text-xs mt-1">
              {q.mark === 'correct' ? <span className="text-green-400">✅ Correct</span> : q.mark === 'incorrect' ? <span className="text-red-400">❌ Needs another look</span> : <span className="text-slate-500">– Reviewed</span>}
            </div>
          )}
        </div>
      ))}

      {status === 'assigned' && (
        <button onClick={handleSubmit} disabled={isPending} className="bg-cyan-500 text-black font-semibold rounded-lg py-2 px-6 disabled:opacity-50">
          Submit for Checking
        </button>
      )}
      {status === 'submitted' && <p className="text-slate-500 text-sm">Submitted — waiting for it to be marked.</p>}
      {status === 'marked' && parentFeedback && (
        <div className="bg-slate-900 border border-green-800 rounded-lg p-3 mt-2">
          <b className="text-green-400 text-sm">Feedback:</b> <span className="text-sm">{parentFeedback}</span>
        </div>
      )}

      <button onClick={() => router.back()} className="block mt-6 text-sm text-slate-400 underline">&larr; Back to worksheets</button>
    </div>
  );
}
