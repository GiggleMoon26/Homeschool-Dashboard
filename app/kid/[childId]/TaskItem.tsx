'use client';

import { useTransition } from 'react';
import { toggleTask } from './actions';

type Task = {
  id: string;
  subject: string;
  description: string;
  code: string | null;
  done: boolean;
};

export default function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border border-slate-700 bg-slate-900 ${task.done ? 'opacity-50' : ''}`}
    >
      <button
        onClick={() => startTransition(() => toggleTask(task.id, task.done))}
        disabled={isPending}
        className={`w-6 h-6 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center text-sm ${
          task.done ? 'bg-green-500 border-green-500' : 'border-slate-500'
        }`}
      >
        {task.done ? '✓' : ''}
      </button>
      <div>
        <div className={task.done ? 'line-through' : ''}>{task.description}</div>
        <div className="text-xs text-slate-500 mt-1 flex gap-2">
          <span>{task.subject}</span>
          {task.code && <span className="bg-slate-800 px-2 py-0.5 rounded">{task.code}</span>}
        </div>
      </div>
    </div>
  );
}
