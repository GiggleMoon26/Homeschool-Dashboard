'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); return; }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? `Couldn't reach the server: ${err.message}. Double-check your Supabase environment variables.`
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2">Parent login</h1>
        <input
          type="email" required placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3"
        />
        <input
          type="password" required placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={loading} className="rounded-lg bg-purple-600 py-3 font-semibold disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <p className="text-sm text-slate-400 text-center">
          New here? <Link href="/signup" className="text-cyan-400 underline">Set up a family</Link>
        </p>
      </form>
    </main>
  );
}
