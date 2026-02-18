'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DarijaWord {
  id: string; darija: string; arabic: string; english: string; french: string;
  pronunciation: string; category: string; part_of_speech: string; gender?: string;
  cultural_note?: string; register: string; tags: string[];
  examples: { darija: string; arabic: string; english: string; french: string }[];
}

// Group words into thematic sections
const SECTIONS = [
  { tag: 'greetings', label: 'Greetings & Social' },
  { tag: 'food', label: 'Food & Drink' },
  { tag: 'directions', label: 'Getting Around' },
  { tag: 'shopping', label: 'At the Souk' },
  { tag: 'numbers', label: 'Numbers' },
  { tag: 'emergency', label: 'Emergency' },
];

export default function FirstDayClient({ words }: { words: DarijaWord[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Group by category, keeping order
  const grouped = new Map<string, DarijaWord[]>();
  const usedIds = new Set<string>();
  
  for (const section of SECTIONS) {
    const matches = words.filter(w => w.category === section.tag && !usedIds.has(w.id));
    matches.forEach(w => usedIds.add(w.id));
    if (matches.length > 0) grouped.set(section.label, matches);
  }
  // Remaining words
  const remaining = words.filter(w => !usedIds.has(w.id));
  if (remaining.length > 0) grouped.set('More Essentials', remaining);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-8 md:px-[8%] lg:px-[12%] pt-20 pb-16">
        <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-8 inline-block">&larr; Back to Dictionary</Link>
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7">
            <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Survival Kit</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9]">Your first<br /><em>day</em> words</h1>
          </div>
          <div className="md:col-span-4 md:col-start-9 flex items-end">
            <div>
              <p className="text-neutral-500 leading-relaxed mb-4">These {words.length} words get you through Day 1 in Morocco. Say them badly — Moroccans will love you for trying.</p>
              <p className="text-neutral-400 text-sm">Print this page. Screenshot it. Save it to your phone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      {Array.from(grouped.entries()).map(([sectionName, sectionWords]) => (
        <section key={sectionName} className="px-8 md:px-[8%] lg:px-[12%] py-12 border-t border-neutral-100">
          <h2 className="font-display text-3xl md:text-4xl mb-8">{sectionName}</h2>
          {sectionWords.map(w => {
            const exp = expanded === w.id;
            return (
              <div key={w.id} onClick={() => setExpanded(exp ? null : w.id)}
                className={`group cursor-pointer py-5 ${exp ? '' : 'border-b border-neutral-50 hover:border-neutral-200'} transition-all`}>
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div className="flex items-baseline gap-4">
                    <span className="font-arabic text-2xl md:text-3xl text-[#c53a1a] leading-none">{w.arabic}</span>
                    <span className="font-display text-xl md:text-2xl">{w.darija}</span>
                    <span className="text-sm text-neutral-400 hidden md:inline">/{w.pronunciation}/</span>
                  </div>
                  <span className="text-neutral-600">{w.english}</span>
                </div>
                {exp && (
                  <div className="mt-6 grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-1">Pronunciation</p>
                      <p className="font-display text-lg">/{w.pronunciation}/</p>
                      <p className="text-neutral-500 text-sm mt-2">{w.french}</p>
                    </div>
                    {w.cultural_note && (
                      <div className="md:col-span-2 border-l-2 border-[#d4931a] pl-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-1">Cultural note</p>
                        <p className="text-sm text-neutral-600 leading-relaxed">{w.cultural_note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
