'use client';

import { useState, useTransition } from 'react';
import { toggleTask } from '../actions';

type Task = {
  id: string;
  subject: string;
  description: string;
  code: string | null;
  done: boolean;
  days: string[];
  specific_date: string | null;
};

const DAY_CODES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function fmtISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function startOfWeek(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}
function monthGridDates(cursor: Date): Date[] {
  const start = startOfWeek(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
  const cells: Date[] = [];
  const d = new Date(start);
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return cells;
}
function isFlexible(t: Task): boolean {
  return !t.specific_date && (!t.days || t.days.length === 0);
}

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  const [mode, setMode] = useState<'today' | 'week' | 'month'>('today');
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPending, startTransition] = useTransition();

  const todayDate = new Date();
  const todayISO = fmtISO(todayDate);
  const selectedISO = fmtISO(selectedDate);

  function navigate(dir: number) {
    const c = new Date(cursor);
    if (mode === 'week') c.setDate(c.getDate() + 7 * dir);
    else c.setMonth(c.getMonth() + dir);
    setCursor(c);
  }

  function tasksForDate(iso: string, dayCode: string): Task[] {
    return tasks.filter((t) => {
      if (t.specific_date) return t.specific_date === iso;
      if (isFlexible(t)) return false; // flexible tasks are never "on" a specific date
      return t.days.includes(dayCode);
    });
  }

  function switchMode(m: 'today' | 'week' | 'month') {
    setMode(m);
    setCursor(new Date());
    if (m === 'today') setSelectedDate(new Date());
  }

  // ---- TODAY VIEW: only what's genuinely on today, no flexible pool ----
  if (mode === 'today') {
    const todayDayCode = DAY_CODES[todayDate.getDay()];
    const todayTasks = tasksForDate(todayISO, todayDayCode);
    return (
      <div>
        <ModeToggle mode={mode} onChange={switchMode} />
        <h3 className="text-sm font-semibold mb-3">
          {todayDate.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })} (Today)
        </h3>
        <div className="flex flex-col gap-2">
          {todayTasks.length === 0 && <p className="text-slate-500 text-sm">Nothing specifically scheduled for today.</p>}
          {todayTasks.map((t) => (
            <TaskRow key={t.id} task={t} isPending={isPending} onToggle={() => startTransition(() => toggleTask(t.id, t.done))} />
          ))}
        </div>
      </div>
    );
  }

  const selectedDayCode = DAY_CODES[selectedDate.getDay()];
  const selectedTasks = tasksForDate(selectedISO, selectedDayCode);

  return (
    <div>
      <ModeToggle mode={mode} onChange={switchMode} />

      <div className="flex justify-between items-center mb-3">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-400">&larr; Prev</button>
        <div className="text-sm font-semibold">
          {mode === 'month'
            ? cursor.toLocaleString('en-AU', { month: 'long', year: 'numeric' })
            : (() => { const s = startOfWeek(cursor); const e = new Date(s); e.setDate(e.getDate() + 6); return `${s.getDate()} \u2013 ${e.getDate()} ${e.toLocaleString('en-AU', { month: 'short' })}`; })()}
        </div>
        <button onClick={() => navigate(1)} className="text-sm text-slate-400">Next &rarr;</button>
      </div>

      {mode === 'month' ? (
        <div className="grid grid-cols-7 gap-1 mb-4 text-center">
          {WEEK_LABELS.map((d) => <div key={d} className="text-xs text-slate-500">{d[0]}</div>)}
          {monthGridDates(cursor).map((d, i) => {
            const iso = fmtISO(d);
            const inMonth = d.getMonth() === cursor.getMonth();
            const hasStuff = tasksForDate(iso, DAY_CODES[d.getDay()]).length > 0;
            return (
              <button
                key={i} onClick={() => setSelectedDate(d)}
                className={`text-sm py-2 rounded ${iso === selectedISO ? 'bg-cyan-500 text-black' : iso === todayISO ? 'bg-green-900/40 border border-green-600' : 'bg-slate-900'} ${!inMonth ? 'opacity-30' : ''}`}
              >
                {d.getDate()}{hasStuff && <div className="w-1 h-1 bg-purple-400 rounded-full mx-auto mt-0.5" />}
              </button>
            );
          })}
        </div>
      ) : (
        // Week view — all 7 days, weekends included, per your request
        <div className="grid grid-cols-7 gap-1 mb-4">
          {WEEK_LABELS.map((label, offset) => {
            const d = new Date(startOfWeek(cursor));
            d.setDate(d.getDate() + offset);
            const iso = fmtISO(d);
            return (
              <button
                key={offset} onClick={() => setSelectedDate(d)}
                className={`text-center py-2 rounded-lg ${iso === selectedISO ? 'bg-cyan-500 text-black' : iso === todayISO ? 'bg-green-900/40 border border-green-600' : 'bg-slate-900'}`}
              >
                <div className="text-[10px]">{label}</div>
                <div className="text-base font-bold">{d.getDate()}</div>
              </button>
            );
          })}
        </div>
      )}

      <h3 className="text-sm font-semibold mb-2">
        {selectedDate.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
        {selectedISO === todayISO ? ' (Today)' : ''}
      </h3>
      <div className="flex flex-col gap-2 mb-6">
        {selectedTasks.length === 0 && <p className="text-slate-500 text-sm">Nothing scheduled this day.</p>}
        {selectedTasks.map((t) => (
          <TaskRow key={t.id} task={t} isPending={isPending} onToggle={() => startTransition(() => toggleTask(t.id, t.done))} />
        ))}
      </div>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: 'today' | 'week' | 'month'; onChange: (m: 'today' | 'week' | 'month') => void }) {
  return (
    <div className="flex gap-2 mb-3">
      {(['today', 'week', 'month'] as const).map((m) => (
        <button key={m} onClick={() => onChange(m)} className={`text-xs px-3 py-1 rounded-lg capitalize ${mode === m ? 'bg-cyan-500 text-black' : 'bg-slate-800'}`}>
          {m}
        </button>
      ))}
    </div>
  );
}

function TaskRow({ task, isPending, onToggle }: { task: Task; isPending: boolean; onToggle: () => void }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border border-slate-700 bg-slate-900 ${task.done ? 'opacity-50' : ''}`}>
      <button
        onClick={onToggle} disabled={isPending}
        className={`w-6 h-6 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center text-sm ${task.done ? 'bg-green-500 border-green-500' : 'border-slate-500'}`}
      >
        {task.done ? '\u2713' : ''}
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
