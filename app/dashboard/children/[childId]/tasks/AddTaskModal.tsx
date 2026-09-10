'use client';

import { useState } from 'react';
import AddTaskForm from './AddTaskForm';

type ChecklistItem = {
  code: string;
  title: string;
  markoff_criteria: string | null;
  khan_resource: string | null;
  twinkl_resource: string | null;
  other_ideas: string | null;
};

export default function AddTaskModal({
  action,
  checklist,
}: {
  action: (formData: FormData) => void;
  checklist: ChecklistItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-cyan-500 text-black font-semibold py-3 rounded-lg mb-6"
      >
        + Add Task
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="w-full max-w-md mt-8 mb-8">
            <div className="flex justify-end mb-2">
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white text-sm">✕ Close</button>
            </div>
            <AddTaskForm action={action} checklist={checklist} />
          </div>
        </div>
      )}
    </>
  );
}
