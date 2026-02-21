'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DarijaWord {
  id: string; darija: string; arabic: string; english: string; french: string;
  pronunciation: string; category: string; part_of_speech: string; gender?: string;
  conjugation?: Record<string, Record<string, string>>; examples: { darija: string; arabic: string; english: string; french: string }[];
  cultural_note?: string; register: string; tags: string[];
}

interface Props {
  words: DarijaWord[];
  categories: { id: string; name: string; count: number }[];
  currentSlug: string;
  currentName: string;
  description: string;
}

export default function CategoryClient({ words, categories, currentSlug, currentName, description }: Props) {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  const CAT_NAMES: Record<string, string> = {
    greetings: 'Greetings', food: 'Food & Drink', shopping: 'Shopping', transport: 'Transport',
    home: 'Home & House', emotions: 'Feelings', time: 'Time', numbers: 'Numbers',
    family: 'Family & People', city: 'City & Medina', money: 'Money', health: 'Health',
    religion: 'Faith & Blessings', slang: 'Street Slang', verbs: 'Verbs', directions: 'Directions',
    crafts: 'Crafts & Materials', animals: 'Animals', nature: 'Nature & Weather', clothing: 'Clothing',
    colors: 'Colors', music: 'Music & Culture', technology: 'Technology', education: 'Education',
    work: 'Work & Professions', pronouns: 'Pronouns & Grammar', culture: 'Culture',
    architecture: 'Architecture', blessings: 'Blessings & Prayers', compliments: 'Compliments',
    emergency: 'Emergency', adjectives: 'Adjectives', sports: 'Sports', survival: 'Survival Kit',
  };

  const renderWord = (w: DarijaWord) => {
    const exp = expandedWord === w.id;
    const displayTags = (w.tags || []).filter(t => !['essential','first-day','common','basic','advanced','intermediate'].includes(t));
    return (
      <div key={w.id} onClick={() => setExpandedWord(exp ? null : w.id)}
        className={`group cursor-pointer py-6 ${exp ? '' : 'border-b border-neutral-100 hover:border-neutral-300'} transition-all`}>
        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          <div className="flex items-baseline gap-5">
            <span className="font-arabic text-3xl md:text-4xl text-[#c53a1a] leading-none">{w.arabic}</span>
            <span className="font-display text-2xl md:text-3xl">{w.darija}</span>
            <span className="hidden md:inline-flex items-baseline gap-2">
              {displayTags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs text-neutral-500 uppercase tracking-wider">{tag}</span>
              ))}
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-neutral-900">{w.english}</span>
            <svg className={`w-4 h-4 text-neutral-500 transition-transform ${exp ? 'rotate-45' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </div>
        </div>
        {exp && (
          <div className="mt-8 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Pronunciation</p>
              <p className="font-display text-xl mb-6">/{w.pronunciation}/</p>
              <p className="text-neutral-500 text-sm">{w.french}</p>
            </div>
            <div className="md:col-span-4">
              {w.examples?.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">In use</p>
                  {w.examples.map((ex, i) => (
                    <div key={i} className="space-y-1 mb-4">
                      <p className="font-arabic text-xl text-black">{ex.arabic}</p>
                      <p className="text-neutral-900">{ex.darija}</p>
                      <p className="text-sm text-neutral-500">{ex.english}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {w.cultural_note && (
              <div className="md:col-span-3">
                <div className="border-l-2 border-[#d4931a] pl-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-2">Cultural note</p>
                  <p className="text-sm text-neutral-900 leading-relaxed">{w.cultural_note}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-8 md:px-[8%] lg:px-[12%] pt-20 pb-12">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 inline-block">&larr; Back to Dictionary</Link>
        <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">{words.length} words</p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-6">{currentName}</h1>
        {description && <p className="text-neutral-500 text-lg max-w-2xl leading-relaxed">{description}</p>}
      </section>

      {/* Category nav */}
      <section className="px-8 md:px-[8%] lg:px-[12%] pb-8 border-b border-neutral-100">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {categories.map(c => (
            <Link key={c.id} href={`/category/${c.id}`}
              className={`text-sm py-1 transition-colors ${c.id === currentSlug ? 'text-[#c53a1a] font-medium border-b border-[#c53a1a]' : 'text-neutral-500 hover:text-neutral-900'}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Words */}
      <section className="px-8 md:px-[8%] lg:px-[12%] py-16">
        {words.map(renderWord)}
      </section>
    </div>
  );
}
