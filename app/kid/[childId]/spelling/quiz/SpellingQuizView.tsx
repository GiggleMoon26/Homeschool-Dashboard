'use client';

import { useState, useRef } from 'react';
import { recordSpellingAttempt } from '../actions';

type WordPair = { word: string; sentence: string };

type QuizState = {
  pairs: WordPair[];
  index: number;
  score: number;
  input: string;
  feedback: 'correct' | 'incorrect' | null;
  results: { word: string; typed: string; correct: boolean }[];
  finished: boolean;
};

function shuffle(arr: WordPair[]): WordPair[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => { cachedVoices = window.speechSynthesis.getVoices(); };
}
function pickBestVoice(): SpeechSynthesisVoice | null {
  if (!cachedVoices.length) return null;
  const english = cachedVoices.filter((v) => v.lang?.toLowerCase().startsWith('en'));
  if (!english.length) return null;
  const nonCompact = english.filter((v) => !/compact/i.test(v.name));
  const pool = nonCompact.length ? nonCompact : english;
  return pool.find((v) => v.lang.toLowerCase() === 'en-au')
    || pool.find((v) => v.lang.toLowerCase() === 'en-gb')
    || pool.find((v) => v.lang.toLowerCase() === 'en-us')
    || pool[0];
}
// Speaks the word, then the sentence (with the word still audible in
// context), then the word again — the standard real-world spelling test
// pattern, and the only reliable way to disambiguate homophones like
// sea/see when the child can't see the word written down.
function speakPair(pair: WordPair) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (!cachedVoices.length) loadVoices();
  window.speechSynthesis.cancel();
  const text = pair.sentence ? `${pair.word}. ${pair.sentence}. ${pair.word}.` : pair.word;
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickBestVoice();
  if (voice) u.voice = voice;
  u.rate = 0.92;
  window.speechSynthesis.speak(u);
}

export default function SpellingQuizView({ pairs, recentHistory }: { pairs: WordPair[]; recentHistory: { score: number; total: number; attempted_at: string }[] }) {
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const initialized = useRef(false);

  if (!initialized.current) {
    loadVoices();
    initialized.current = true;
  }

  function start() {
    const shuffled = shuffle(pairs);
    setQuiz({ pairs: shuffled, index: 0, score: 0, input: '', feedback: null, results: [], finished: false });
    setTimeout(() => speakPair(shuffled[0]), 300);
  }

  function check() {
    if (!quiz || quiz.feedback) return;
    const pair = quiz.pairs[quiz.index];
    const correct = quiz.input.trim().toLowerCase() === pair.word.toLowerCase();
    setQuiz({
      ...quiz,
      feedback: correct ? 'correct' : 'incorrect',
      score: correct ? quiz.score + 1 : quiz.score,
      results: [...quiz.results, { word: pair.word, typed: quiz.input, correct }],
    });
  }

  function next() {
    if (!quiz) return;
    if (quiz.index + 1 >= quiz.pairs.length) {
      setQuiz({ ...quiz, finished: true });
      recordSpellingAttempt(quiz.score, quiz.pairs.length);
      return;
    }
    const nextIndex = quiz.index + 1;
    setQuiz({ ...quiz, index: nextIndex, input: '', feedback: null });
    setTimeout(() => speakPair(quiz.pairs[nextIndex]), 300);
  }

  if (pairs.length === 0) {
    return <p className="text-slate-500 text-sm">No spelling list set for you yet — ask a parent to add one.</p>;
  }

  if (!quiz) {
    return (
      <div>
        <button onClick={start} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded-lg text-lg">
          🎮 Play Spelling Test
        </button>
        {recentHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Your recent scores</h3>
            {recentHistory.map((h, i) => (
              <div key={i} className="text-sm text-slate-400 mb-1">
                {new Date(h.attempted_at).toLocaleDateString('en-AU')}: <b className="text-green-400">{h.score}/{h.total}</b>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (quiz.finished) {
    const missed = quiz.results.filter((r) => !r.correct);
    return (
      <div className="text-center">
        <div className="text-xl font-bold text-yellow-400 mb-2">QUIZ COMPLETE!</div>
        <div className="text-4xl font-bold text-green-400 mb-4">{quiz.score} / {quiz.pairs.length}</div>
        {missed.length > 0 ? (
          <div className="text-left mt-4">
            <h3 className="font-semibold mb-2">Words to double-check</h3>
            {missed.map((m, i) => (
              <div key={i} className="text-sm text-slate-400 mb-1">
                You typed &lsquo;{m.typed || '(nothing)'}&rsquo; — correct: <b className="text-pink-400">{m.word}</b>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-green-400">Perfect score! 🌟</p>
        )}
        <div className="flex gap-2 justify-center mt-6">
          <button onClick={start} className="bg-pink-600 text-white font-semibold px-4 py-2 rounded-lg">🔄 Play Again</button>
          <button onClick={() => setQuiz(null)} className="bg-slate-700 text-white px-4 py-2 rounded-lg">Back</button>
        </div>
      </div>
    );
  }

  const pair = quiz.pairs[quiz.index];
  return (
    <div className="text-center">
      <button onClick={() => setQuiz(null)} className="text-sm text-slate-400 underline mb-4">&larr; Exit</button>
      <p className="text-slate-400 text-sm mb-2">Word {quiz.index + 1} of {quiz.pairs.length} — Score so far: {quiz.score}</p>
      <button onClick={() => speakPair(pair)} className="bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg mb-2">🔊 Hear the Word</button>
      {pair.sentence && <p className="text-xs text-slate-500 mb-4">(You&apos;ll hear it in a sentence too, to help with tricky sound-alikes)</p>}
      <div>
        <input
          type="text" value={quiz.input} onChange={(e) => setQuiz({ ...quiz, input: e.target.value })}
          disabled={!!quiz.feedback} onKeyDown={(e) => e.key === 'Enter' && check()}
          autoCapitalize="off" autoCorrect="off" autoComplete="off"
          className="text-center text-xl rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 w-64"
          placeholder="Type it here..."
        />
      </div>
      {!quiz.feedback && <button onClick={check} className="mt-4 bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg">Check</button>}
      {quiz.feedback === 'correct' && <div className="mt-4 text-green-400 font-bold">✅ Correct!</div>}
      {quiz.feedback === 'incorrect' && <div className="mt-4 text-pink-400 font-bold">❌ Not quite — it&apos;s &lsquo;{pair.word}&rsquo;</div>}
      {quiz.feedback && (
        <button onClick={next} className="mt-4 bg-cyan-500 text-black font-semibold px-6 py-2 rounded-lg">
          {quiz.index + 1 >= quiz.pairs.length ? 'See Results' : 'Next Word'}
        </button>
      )}
    </div>
  );
}
