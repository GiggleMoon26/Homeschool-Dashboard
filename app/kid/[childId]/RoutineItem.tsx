'use client';

import { useTransition } from 'react';
import { toggleRoutineItem } from './actions';

type RoutineItemType = {
  id: string;
  title: string;
  doneToday: boolean;
};

export default function RoutineItem({ item }: { item: RoutineItemType }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-lg border border-slate-700 bg-slate-900 ${item.doneToday ? 'opacity-50' : ''}`}>
      <button
        onClick={() => startTransition(() => toggleRoutineItem(item.id, item.doneToday))}
        disabled={isPending}
        className={`w-6 h-6 flex-shrink-0 rounded border-2 flex items-center justify-center text-sm ${
          item.doneToday ? 'bg-green-500 border-green-500' : 'border-slate-500'
        }`}
      >
        {item.doneToday ? '✓' : ''}
      </button>
      <div className={item.doneToday ? 'line-through text-sm' : 'text-sm'}>{item.title}</div>
    </div>
  );
}
