import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold text-center">🎮 Homeschool Dashboard</h1>
      <p className="text-slate-400 text-center max-w-md">
        A family homeschool planner — tasks, curriculum tracking, and worksheets, all in one place.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/kid-login"
          className="text-center rounded-lg bg-cyan-500 text-black font-semibold py-3 hover:bg-cyan-400 transition"
        >
          I&apos;m a kid — log in
        </Link>
        <Link
          href="/login"
          className="text-center rounded-lg bg-purple-600 py-3 hover:bg-purple-500 transition"
        >
          Parent login
        </Link>
        <Link
          href="/signup"
          className="text-center rounded-lg border border-slate-600 py-3 hover:bg-slate-800 transition text-slate-300"
        >
          Set up a new family
        </Link>
      </div>
    </main>
  );
}
