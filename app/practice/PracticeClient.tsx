'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface DarijaWord {
  id: string; darija: string; arabic: string; english: string; french: string;
  pronunciation: string; category: string; part_of_speech: string; gender?: string;
  cultural_note?: string; register: string; tags: string[];
  examples: { darija: string; arabic: string; english: string; french: string }[];
}

interface CardProgress {
  wordId: string;
  level: number;       // 0=new, 1-5=learning levels
  nextReview: number;  // timestamp
  correct: number;
  incorrect: number;
}

type DeckMode = 'arabic-to-english' | 'english-to-arabic' | 'darija-to-english';

const INTERVALS = [0, 60, 300, 1800, 86400, 259200]; // seconds: now, 1min, 5min, 30min, 1day, 3days

// ─── Storage helpers ───
function loadProgress(): Record<string, CardProgress> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('darija-progress') || '{}');
  } catch { return {}; }
}
function saveProgress(progress: Record<string, CardProgress>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('darija-progress', JSON.stringify(progress));
}

const DECK_OPTIONS = [
  { id: 'first-day', label: 'First Day Survival', tag: 'first-day', icon: '🚀' },
  { id: 'essential', label: 'Essential Words', tag: 'essential', icon: '⭐' },
  { id: 'food', label: 'Food & Drink', category: 'food', icon: '🫖' },
  { id: 'greetings', label: 'Greetings & Social', category: 'greetings', icon: '👋' },
  { id: 'shopping', label: 'At the Souk', category: 'shopping', icon: '🏪' },
  { id: 'transport', label: 'Getting Around', category: 'transport', icon: '🚕' },
  { id: 'religion', label: 'Faith & Blessings', category: 'religion', icon: '🕌' },
  { id: 'emotions', label: 'Feelings', category: 'emotions', icon: '💭' },
  { id: 'family', label: 'Family & People', category: 'family', icon: '👨‍👩‍👧' },
  { id: 'health', label: 'Health & Body', category: 'health', icon: '🏥' },
  { id: 'nature', label: 'Nature & Weather', category: 'nature', icon: '🌿' },
  { id: 'city', label: 'City & Medina', category: 'city', icon: '🏛️' },
  { id: 'culture', label: 'Culture', category: 'culture', icon: '🎭' },
  { id: 'colors', label: 'Colors', category: 'colors', icon: '🎨' },
  { id: 'verbs', label: 'Verbs', category: 'verbs', icon: '✊' },
  { id: 'numbers', label: 'Numbers', category: 'numbers', icon: '🔢' },
];

export default function PracticeClient() {
  const [phase, setPhase] = useState<'select' | 'practice' | 'done'>('select');
  const [words, setWords] = useState<DarijaWord[]>([]);
  const [queue, setQueue] = useState<DarijaWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [mode, setMode] = useState<DeckMode>('arabic-to-english');
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<string>('');

  // Load saved progress on mount
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  // Fetch deck words
  const loadDeck = useCallback(async (deck: typeof DECK_OPTIONS[0]) => {
    setLoading(true);
    try {
      const url = deck.tag
        ? `/api/words?tag=${deck.tag}`
        : `/api/words?category=${deck.category}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.length === 0) {
        setLoading(false);
        return;
      }
      setWords(data);
      // Build queue: prioritize due cards, then new cards, shuffle
      const now = Date.now() / 1000;
      const prog = loadProgress();
      const due: DarijaWord[] = [];
      const fresh: DarijaWord[] = [];
      for (const w of data) {
        const p = prog[w.id];
        if (!p) { fresh.push(w); }
        else if (p.nextReview <= now) { due.push(w); }
      }
      // Shuffle both
      shuffle(due);
      shuffle(fresh);
      // Due first, then new cards, cap at 20 per session
      const q = [...due, ...fresh].slice(0, 20);
      if (q.length === 0) {
        // All cards reviewed and not due yet — show all shuffled
        const all = [...data];
        shuffle(all);
        setQueue(all.slice(0, 20));
      } else {
        setQueue(q);
      }
      setCurrentIndex(0);
      setFlipped(false);
      setSessionStats({ correct: 0, incorrect: 0, total: 0 });
      setPhase('practice');
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  function shuffle(arr: DarijaWord[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Handle answer
  function handleAnswer(correct: boolean) {
    const word = queue[currentIndex];
    if (!word) return;

    const now = Date.now() / 1000;
    const prev = progress[word.id] || { wordId: word.id, level: 0, nextReview: 0, correct: 0, incorrect: 0 };

    let newLevel: number;
    if (correct) {
      newLevel = Math.min(prev.level + 1, INTERVALS.length - 1);
    } else {
      newLevel = Math.max(prev.level - 1, 0);
    }

    const updated: CardProgress = {
      wordId: word.id,
      level: newLevel,
      nextReview: now + INTERVALS[newLevel],
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    };

    const newProgress = { ...progress, [word.id]: updated };
    setProgress(newProgress);
    saveProgress(newProgress);

    setSessionStats(s => ({
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
      total: s.total + 1,
    }));

    // If wrong, re-insert card 3-5 positions later
    if (!correct && currentIndex < queue.length - 1) {
      const reinsertAt = Math.min(currentIndex + 3 + Math.floor(Math.random() * 3), queue.length);
      const newQueue = [...queue];
      newQueue.splice(reinsertAt, 0, word);
      setQueue(newQueue);
    }

    // Next card
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      setPhase('done');
    }
  }

  // Keyboard controls
  useEffect(() => {
    if (phase !== 'practice') return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      }
      if (flipped && (e.key === 'ArrowRight' || e.key === '1')) handleAnswer(true);
      if (flipped && (e.key === 'ArrowLeft' || e.key === '2')) handleAnswer(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, flipped, currentIndex, queue]);

  const currentWord = queue[currentIndex];

  // ═══ DECK SELECTION ═══
  if (phase === 'select') {
    return (
      <div className="min-h-screen">
        <section className="px-8 md:px-[8%] lg:px-[12%] pt-20 pb-8">
          <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-8 inline-block">&larr; Back to Dictionary</Link>
          <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Practice</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-6">Flash<em>cards</em></h1>
          <p className="text-neutral-500 text-lg max-w-xl leading-relaxed">Pick a deck. Flip the card. Mark what you know. Words you miss come back until you get them.</p>
        </section>

        {/* Mode selector */}
        <section className="px-8 md:px-[8%] lg:px-[12%] py-6 border-b border-neutral-100">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-3">Card direction</p>
          <div className="flex gap-4 flex-wrap">
            {([
              ['arabic-to-english', 'Arabic → English'],
              ['english-to-arabic', 'English → Arabic'],
              ['darija-to-english', 'Darija → English'],
            ] as [DeckMode, string][]).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`text-sm py-2 px-4 border transition-colors ${mode === m ? 'border-[#c53a1a] text-[#c53a1a]' : 'border-neutral-200 text-neutral-400 hover:border-neutral-400'}`}>
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Deck grid */}
        <section className="px-8 md:px-[8%] lg:px-[12%] py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {DECK_OPTIONS.map(deck => {
              // Count progress for this deck
              const progKeys = Object.values(progress).filter(p => p.level >= 2).length;
              return (
                <button key={deck.id} onClick={() => { setSelectedDeck(deck.id); loadDeck(deck); }}
                  disabled={loading}
                  className="group text-left p-6 border border-neutral-100 hover:border-neutral-300 transition-all hover:shadow-sm">
                  <span className="text-2xl block mb-3">{deck.icon}</span>
                  <span className="font-display text-lg block mb-1 group-hover:text-[#c53a1a] transition-colors">{deck.label}</span>
                  <span className="text-xs text-neutral-400">
                    {loading && selectedDeck === deck.id ? 'Loading...' : 'Tap to start'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Keyboard hint */}
        <section className="px-8 md:px-[8%] lg:px-[12%] py-8 text-center">
          <p className="text-xs text-neutral-300">Keyboard: <span className="text-neutral-400">Space</span> to flip · <span className="text-neutral-400">→</span> got it · <span className="text-neutral-400">←</span> again</p>
        </section>
      </div>
    );
  }

  // ═══ SESSION DONE ═══
  if (phase === 'done') {
    const pct = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-8 max-w-lg">
          <span className="font-arabic text-8xl text-neutral-100 block mb-6">
            {pct >= 80 ? '🔥' : pct >= 50 ? '👍' : '💪'}
          </span>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            {pct >= 80 ? 'Mzyan bzzaf!' : pct >= 50 ? 'Labas!' : 'Keep going!'}
          </h2>
          <p className="text-neutral-500 text-lg mb-8">
            {sessionStats.correct} of {sessionStats.total} correct — {pct}%
          </p>
          <div className="flex gap-8 justify-center mb-12">
            <div>
              <span className="font-display text-3xl text-green-600 block">{sessionStats.correct}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">Got it</span>
            </div>
            <div>
              <span className="font-display text-3xl text-[#c53a1a] block">{sessionStats.incorrect}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">Again</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => { setPhase('select'); }} className="px-8 py-4 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-700 transition-colors">New Deck</button>
            <button onClick={() => { setCurrentIndex(0); setFlipped(false); setSessionStats({ correct: 0, incorrect: 0, total: 0 }); shuffle(queue); setQueue([...queue]); setPhase('practice'); }}
              className="px-8 py-4 border border-neutral-200 text-neutral-600 text-sm tracking-wide hover:border-neutral-400 transition-colors">Practice Again</button>
            <Link href="/" className="px-8 py-4 border border-neutral-200 text-neutral-600 text-sm tracking-wide hover:border-neutral-400 transition-colors">Back to Dictionary</Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══ PRACTICE ═══
  if (!currentWord) return null;

  // Card content based on mode
  let frontContent: React.ReactNode;
  let backContent: React.ReactNode;

  if (mode === 'arabic-to-english') {
    frontContent = (
      <div className="text-center">
        <span className="font-arabic text-7xl md:text-8xl text-[#c53a1a] block leading-tight">{currentWord.arabic}</span>
      </div>
    );
    backContent = (
      <div className="text-center">
        <span className="font-arabic text-5xl text-[#c53a1a]/30 block mb-6">{currentWord.arabic}</span>
        <span className="font-display text-4xl md:text-5xl block mb-2">{currentWord.darija}</span>
        <span className="text-2xl text-neutral-700 block mb-1">{currentWord.english}</span>
        <span className="text-lg text-neutral-400 block mb-4">{currentWord.french}</span>
        <span className="text-neutral-400 text-sm block">/{currentWord.pronunciation}/</span>
      </div>
    );
  } else if (mode === 'english-to-arabic') {
    frontContent = (
      <div className="text-center">
        <span className="font-display text-5xl md:text-6xl block">{currentWord.english}</span>
        <span className="text-lg text-neutral-400 mt-2 block">{currentWord.french}</span>
      </div>
    );
    backContent = (
      <div className="text-center">
        <span className="font-arabic text-7xl md:text-8xl text-[#c53a1a] block mb-4">{currentWord.arabic}</span>
        <span className="font-display text-3xl block mb-2">{currentWord.darija}</span>
        <span className="text-neutral-400 text-sm block">/{currentWord.pronunciation}/</span>
      </div>
    );
  } else {
    frontContent = (
      <div className="text-center">
        <span className="font-display text-5xl md:text-6xl block">{currentWord.darija}</span>
        <span className="text-neutral-400 text-sm mt-2 block">/{currentWord.pronunciation}/</span>
      </div>
    );
    backContent = (
      <div className="text-center">
        <span className="font-arabic text-5xl text-[#c53a1a] block mb-4">{currentWord.arabic}</span>
        <span className="font-display text-3xl text-neutral-400 block mb-2">{currentWord.darija}</span>
        <span className="text-2xl text-neutral-700 block mb-1">{currentWord.english}</span>
        <span className="text-lg text-neutral-400 block">{currentWord.french}</span>
      </div>
    );
  }

  const wordProgress = progress[currentWord.id];
  const levelLabel = ['New', 'Learning', 'Learning', 'Reviewing', 'Known', 'Mastered'][wordProgress?.level || 0];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="px-8 md:px-[8%] lg:px-[12%] py-4 flex items-center justify-between border-b border-neutral-100">
        <button onClick={() => setPhase('select')} className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">&larr; Decks</button>
        <div className="flex items-center gap-6">
          <span className="text-xs text-neutral-400">{currentIndex + 1} / {queue.length}</span>
          {/* Progress bar */}
          <div className="w-32 h-1 bg-neutral-100 overflow-hidden hidden md:block">
            <div className="h-full bg-[#c53a1a] transition-all duration-300" style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }} />
          </div>
          <div className="flex gap-3 text-xs">
            <span className="text-green-600">{sessionStats.correct} ✓</span>
            <span className="text-[#c53a1a]">{sessionStats.incorrect} ✗</span>
          </div>
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-xl">
          {/* The card */}
          <div
            onClick={() => { if (!flipped) setFlipped(true); }}
            className={`relative w-full aspect-[4/3] border transition-all duration-500 cursor-pointer flex items-center justify-center px-12
              ${flipped ? 'border-neutral-200 bg-white' : 'border-neutral-100 bg-neutral-50/50 hover:border-neutral-300 hover:shadow-sm'}`}
          >
            {/* Level badge */}
            <div className="absolute top-4 left-5">
              <span className={`text-[10px] uppercase tracking-[0.2em] ${
                levelLabel === 'Mastered' ? 'text-green-500' :
                levelLabel === 'Known' ? 'text-green-400' :
                levelLabel === 'New' ? 'text-neutral-300' : 'text-neutral-400'
              }`}>{levelLabel}</span>
            </div>

            {/* Tap hint */}
            {!flipped && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-xs text-neutral-300">tap to reveal</span>
              </div>
            )}

            {/* Content */}
            {flipped ? backContent : frontContent}
          </div>

          {/* Cultural note (shown after flip) */}
          {flipped && currentWord.cultural_note && (
            <div className="mt-6 border-l-2 border-[#d4931a] pl-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-1">Cultural note</p>
              <p className="text-sm text-neutral-600 leading-relaxed">{currentWord.cultural_note}</p>
            </div>
          )}

          {/* Answer buttons (shown after flip) */}
          {flipped && (
            <div className="flex gap-4 mt-8">
              <button onClick={() => handleAnswer(false)}
                className="flex-1 py-5 border-2 border-[#c53a1a]/20 text-[#c53a1a] text-sm uppercase tracking-wider hover:bg-[#c53a1a]/5 transition-colors">
                Again <span className="text-neutral-400 ml-2 hidden md:inline">←</span>
              </button>
              <button onClick={() => handleAnswer(true)}
                className="flex-1 py-5 bg-neutral-900 text-white text-sm uppercase tracking-wider hover:bg-neutral-700 transition-colors">
                Got it <span className="text-white/40 ml-2 hidden md:inline">→</span>
              </button>
            </div>
          )}

          {/* Skip to flip hint when not flipped */}
          {!flipped && (
            <div className="text-center mt-8">
              <button onClick={() => setFlipped(true)} className="text-sm text-neutral-300 hover:text-neutral-500 transition-colors">
                Show answer <span className="text-neutral-300 ml-1">↵</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
