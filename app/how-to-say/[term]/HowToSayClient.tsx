'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DarijaWord {
  id: string; darija: string; arabic: string; english: string; french: string;
  pronunciation: string; category: string; part_of_speech: string; gender?: string;
  cultural_note?: string; register: string; tags: string[];
  examples: { darija: string; arabic: string; english: string; french: string }[];
}
interface DarijaPhrase {
  id: string; darija: string; arabic: string; english: string; french: string;
  pronunciation: string; literal_translation?: string; category: string;
  cultural_note?: string; register: string; response?: { darija: string; arabic: string; english: string }; tags: string[];
}

interface Props {
  term: string;
  words: DarijaWord[];
  phrases: DarijaPhrase[];
  title: string;
  description: string;
}

export default function HowToSayClient({ term, words, phrases, title, description }: Props) {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-8 md:px-[8%] lg:px-[12%] pt-20 pb-12">
        <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-8 inline-block">&larr; Back to Dictionary</Link>
        <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">How to say</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.9] mb-6">{title}</h1>
        {description && <p className="text-neutral-500 text-lg max-w-2xl leading-relaxed">{description}</p>}
      </section>

      {/* Words */}
      {words.length > 0 && (
        <section className="px-8 md:px-[8%] lg:px-[12%] py-12 border-t border-neutral-100">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8">{words.length} words</p>
          {words.map(w => {
            const exp = expandedWord === w.id;
            return (
              <div key={w.id} onClick={() => setExpandedWord(exp ? null : w.id)}
                className={`group cursor-pointer py-6 ${exp ? '' : 'border-b border-neutral-100 hover:border-neutral-300'} transition-all`}>
                <div className="flex items-baseline justify-between gap-6 flex-wrap">
                  <div className="flex items-baseline gap-5">
                    <span className="font-arabic text-3xl md:text-4xl text-[#c53a1a] leading-none">{w.arabic}</span>
                    <span className="font-display text-2xl md:text-3xl">{w.darija}</span>
                    <span className="text-sm text-neutral-400 hidden md:inline">/{w.pronunciation}/</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-neutral-600">{w.english}</span>
                    <svg className={`w-4 h-4 text-neutral-300 transition-transform ${exp ? 'rotate-45' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </div>
                </div>
                {exp && (
                  <div className="mt-8 grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Pronunciation</p>
                      <p className="font-display text-xl mb-6">/{w.pronunciation}/</p>
                      <p className="text-neutral-500 text-sm">{w.french}</p>
                    </div>
                    <div className="md:col-span-4">
                      {w.examples?.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-3">In use</p>
                          {w.examples.map((ex, i) => (
                            <div key={i} className="space-y-1 mb-4">
                              <p className="font-arabic text-xl text-neutral-800">{ex.arabic}</p>
                              <p className="text-neutral-700">{ex.darija}</p>
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
                          <p className="text-sm text-neutral-600 leading-relaxed">{w.cultural_note}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Phrases */}
      {phrases.length > 0 && (
        <section className="px-8 md:px-[8%] lg:px-[12%] py-12 bg-neutral-50/60">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8">{phrases.length} phrases</p>
          <div className="max-w-3xl">
            {phrases.map(p => (
              <div key={p.id} className="py-6 border-b border-neutral-100">
                <p className="font-arabic text-2xl text-[#c53a1a] mb-1">{p.arabic}</p>
                <p className="font-display text-xl mb-1">{p.darija}</p>
                <p className="text-neutral-400 text-xs mb-3">/{p.pronunciation}/</p>
                <p className="text-neutral-700">{p.english}</p>
                <p className="text-neutral-500 text-sm mt-1">{p.french}</p>
                {p.literal_translation && <p className="text-neutral-400 text-xs italic mt-2">Literally: {p.literal_translation}</p>}
                {p.cultural_note && (
                  <div className="border-l-2 border-[#d4931a] pl-4 mt-4">
                    <p className="text-sm text-neutral-600 leading-relaxed">{p.cultural_note}</p>
                  </div>
                )}
                {p.response && (
                  <div className="mt-4 bg-neutral-100/50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.15em] text-neutral-400 mb-1">Common response</p>
                    <p className="font-display">{p.response.darija}</p>
                    <p className="text-sm text-neutral-500">{p.response.english}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No results */}
      {words.length === 0 && phrases.length === 0 && (
        <section className="px-8 md:px-[8%] lg:px-[12%] py-20 text-center">
          <span className="font-arabic text-6xl text-neutral-100 block mb-4">؟</span>
          <p className="font-display text-2xl text-neutral-800 mb-2">We don&rsquo;t have &ldquo;{term}&rdquo; yet</p>
          <p className="text-neutral-400">Try searching the <Link href="/" className="text-[#c53a1a] hover:underline">full dictionary</Link>.</p>
        </section>
      )}

      {/* Related "How to say" links */}
      <section className="px-8 md:px-[8%] lg:px-[12%] py-16 border-t border-neutral-100">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-6">People also ask</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
          {[
            ['thank-you', 'Thank you'], ['hello', 'Hello'], ['goodbye', 'Goodbye'],
            ['how-much', 'How much'], ['please', 'Please'], ['sorry', 'Sorry'],
            ['beautiful', 'Beautiful'], ['delicious', 'Delicious'], ['water', 'Water'],
            ['tea', 'Tea'], ['yes', 'Yes'], ['no', 'No'],
            ['where', 'Where'], ['taxi', 'Taxi'], ['help', 'Help'],
            ['god-willing', 'Inshallah'], ['love', 'I love you'], ['lets-go', 'Let\'s go'],
          ].filter(([slug]) => slug !== term.replace(/\s+/g, '-')).slice(0, 12).map(([slug, label]) => (
            <Link key={slug} href={`/how-to-say/${slug}`}
              className="text-sm text-neutral-500 hover:text-[#c53a1a] transition-colors py-1">
              How to say <em>{label}</em>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-[8%] lg:px-[12%] py-12 text-center">
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/practice" className="px-8 py-4 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-700 transition-colors">Practice with Flashcards</Link>
          <Link href="/" className="px-8 py-4 border border-neutral-200 text-neutral-600 text-sm tracking-wide hover:border-neutral-400 transition-colors">Search the Dictionary</Link>
        </div>
      </section>
    </div>
  );
}
