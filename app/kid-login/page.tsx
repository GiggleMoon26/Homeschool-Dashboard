'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KidLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/child-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }
      router.push(`/kid/${data.childId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-2">🎮 Kid Login</h1>
        <input
          value={username} onChange={(e) => setUsername(e.target.value)}
          required placeholder="Username" autoCapitalize="none" autoFocus
          className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3"
        />
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          required placeholder="Password"
          className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3"
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button disabled={loading} className="rounded-lg bg-cyan-500 text-black font-semibold py-3 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </main>
  );
}
