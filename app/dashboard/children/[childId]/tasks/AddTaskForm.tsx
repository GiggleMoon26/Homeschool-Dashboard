'use client';

import { useState } from 'react';

type ChecklistItem = {
  code: string;
  title: string;
  markoff_criteria: string | null;
  khan_resource: string | null;
  twinkl_resource: string | null;
  other_ideas: string | null;
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function AddTaskForm({
  action,
  checklist,
}: {
  action: (formData: FormData) => void;
  checklist: ChecklistItem[];
}) {
  const [markoff, setMarkoff] = useState('');
  const [resource, setResource] = useState('');

  function onCodeChange(code: string) {
    const match = checklist.find((c) => c.code === code);
    if (!match) return;
    setMarkoff(match.markoff_criteria || '');
    const combinedResource = [
      match.khan_resource ? `Khan: ${match.khan_resource}` : '',
      match.twinkl_resource ? `Twinkl: ${match.twinkl_resource}` : '',
      match.other_ideas ? `Other ideas: ${match.other_ideas}` : '',
    ].filter(Boolean).join(' | ');
    if (combinedResource) setResource(combinedResource);
  }

  return (
    <form action={action} className="flex flex-col gap-3 bg-slate-900 border border-slate-700 rounded-lg p-4">
      <h2 className="font-semibold mb-1">Add a task</h2>

      <input name="subject" required placeholder="Subject (e.g. Maths, Spelling)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
      <input name="description" required placeholder="What do they need to do?" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />

      <div>
        <label className="text-xs text-slate-400 block mb-1">Link to a curriculum code (optional)</label>
        <select
          name="code" onChange={(e) => onCodeChange(e.target.value)}
          className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm w-full"
        >
          <option value="">— No code —</option>
          {checklist.map((c) => (
            <option key={c.code} value={c.code}>{c.code} — {c.title}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">Picking a code auto-fills the fields below from that outcome — feel free to edit them.</p>
      </div>

      <textarea name="markoff" value={markoff} onChange={(e) => setMarkoff(e.target.value)} placeholder="Mark off when..." rows={2}
        className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
      <textarea name="resource" value={resource} onChange={(e) => setResource(e.target.value)} placeholder="Resources (Khan, Twinkl, other ideas)" rows={2}
        className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
      <input name="activity_type" placeholder="Activity type (e.g. Game, App, Worksheet)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />

      <div>
        <label className="text-xs text-slate-400 block mb-2">Which day(s)? Leave all unchecked for a flexible "whenever fits" task.</label>
        <div className="flex gap-3 flex-wrap">
          {DAYS.map((d) => (
            <label key={d} className="flex items-center gap-1 text-sm">
              <input type="checkbox" name="days" value={d} /> {d}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_recurring" /> Repeat this every week
      </label>

      <button className="rounded-lg bg-cyan-500 text-black font-semibold py-2 mt-1">+ Add Task</button>
    </form>
  );
}
