'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type ChecklistItem = {
  code: string;
  title: string;
  markoff_criteria: string | null;
  khan_resource: string | null;
  twinkl_resource: string | null;
  other_ideas: string | null;
};

type TaskValues = {
  subject: string;
  description: string;
  code: string | null;
  markoff: string | null;
  resource: string | null;
  activity_type: string | null;
  days: string[];
  is_recurring: boolean;
  specific_date: string | null;
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function AddTaskForm({
  action,
  checklist,
  initialValues,
  defaultDate,
}: {
  action: (formData: FormData) => void;
  checklist: ChecklistItem[];
  initialValues?: TaskValues;
  defaultDate?: string; // if opened from a calendar click, pre-select "specific date" mode with this date
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isEditing = !!initialValues;
  const [markoff, setMarkoff] = useState(initialValues?.markoff || '');
  const [resource, setResource] = useState(initialValues?.resource || '');
  const [scheduleMode, setScheduleMode] = useState<'weekday' | 'date'>(
    initialValues?.specific_date || defaultDate ? 'date' : 'weekday'
  );

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
      <h2 className="font-semibold mb-1">{isEditing ? 'Edit task' : 'Add a task'}</h2>

      <input name="subject" required defaultValue={initialValues?.subject} placeholder="Subject (e.g. Maths, Spelling)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />
      <input name="description" required defaultValue={initialValues?.description} placeholder="What do they need to do?" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />

      <div>
        <label className="text-xs text-slate-400 block mb-1">Link to a curriculum code (optional)</label>
        <select
          name="code" defaultValue={initialValues?.code || ''} onChange={(e) => onCodeChange(e.target.value)}
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
      <input name="activity_type" defaultValue={initialValues?.activity_type || ''} placeholder="Activity type (e.g. Game, App, Worksheet)" className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm" />

      <div>
        <label className="text-xs text-slate-400 block mb-2">When should this happen?</label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" checked={scheduleMode === 'weekday'} onChange={() => setScheduleMode('weekday')} />
            Repeats on weekday(s)
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input type="radio" checked={scheduleMode === 'date'} onChange={() => setScheduleMode('date')} />
            One exact date
          </label>
        </div>

        {scheduleMode === 'weekday' ? (
          <>
            <div className="flex gap-3 flex-wrap mb-2">
              {DAYS.map((d) => (
                <label key={d} className="flex items-center gap-1 text-sm">
                  <input type="checkbox" name="days" value={d} defaultChecked={initialValues?.days?.includes(d)} /> {d}
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500 mb-2">Leave all unchecked for a flexible &quot;whenever fits&quot; task.</p>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_recurring" defaultChecked={initialValues?.is_recurring} /> Repeat this every week
            </label>
          </>
        ) : (
          <input
            type="date" name="specific_date" defaultValue={initialValues?.specific_date || defaultDate || ''}
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button className="rounded-lg bg-cyan-500 text-black font-semibold py-2 px-4 mt-1">
          {isEditing ? 'Save Changes' : '+ Add Task'}
        </button>
        {isEditing && (
          <button type="button" onClick={() => router.push(pathname)} className="rounded-lg bg-slate-700 text-white py-2 px-4 mt-1">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
