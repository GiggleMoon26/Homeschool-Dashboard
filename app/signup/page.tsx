'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }
      if (data.session) {
        router.push('/dashboard');
      } else {
        setCheckEmail(true);
      }
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

  if (checkEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-3">Check your email</h1>
          <p className="text-slate-400">
            We&apos;ve sent a confirmation link to <b>{email}</b>. Click it, then come back and log in.
          </p>
          <Link href="/login" className="inline-block mt-6 text-cyan-400 underline">Go to login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2">Set up your family</h1>
        <input
          type="email" required placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3"
        />
        <input
          type="password" required minLength={6} placeholder="Password (min 6 characters)" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-3"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={loading} className="rounded-lg bg-cyan-500 text-black font-semibold py-3 disabled:opacity-50">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-sm text-slate-400 text-center">
          Already have an account? <Link href="/login" className="text-cyan-400 underline">Log in</Link>
        </p>
      </form>
    </main>
  );
}
