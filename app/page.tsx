'use client';

import { useState, useEffect, useRef } from 'react';

interface DarijaWord {
  id: string; darija: string; arabic: string; english: string; french: string;
  pronunciation: string; category: string; part_of_speech: string; gender?: string;
  conjugation?: Record<string, Record<string, string>>; examples: { darija: string; arabic: string; english: string; french: string }[];
  cultural_note?: string; register: string; tags: string[];
}
interface DarijaPhrase {
  id: string; darija: string; arabic: string; english: string; french: string;
  pronunciation: string; literal_translation?: string; category: string;
  cultural_note?: string; register: string; response?: { darija: string; arabic: string; english: string }; tags: string[];
}
interface WordCat { id: string; name: string; count: number }
interface PhraseCat { id: string; name: string; count: number }

export default function Home() {
  const [query, setQuery] = useState('');
  const [wordResults, setWordResults] = useState<DarijaWord[]>([]);
  const [phraseResults, setPhraseResults] = useState<DarijaPhrase[]>([]);
  const [essentialWords, setEssentialWords] = useState<DarijaWord[]>([]);
  const [proverbs, setProverbs] = useState<DarijaPhrase[]>([]);
  const [wordCategories, setWordCategories] = useState<WordCat[]>([]);
  const [phraseCategories, setPhraseCategories] = useState<PhraseCat[]>([]);
  const [activeWordCat, setActiveWordCat] = useState<string | null>(null);
  const [activePhraseCat, setActivePhraseCat] = useState<string | null>(null);
  const [catWords, setCatWords] = useState<DarijaWord[]>([]);
  const [catPhrases, setCatPhrases] = useState<DarijaPhrase[]>([]);
  const [featuredPhrases, setFeaturedPhrases] = useState<DarijaPhrase[]>([]);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [meta, setMeta] = useState({ totalWords: 0, totalPhrases: 0 });
  const [wordOfDay, setWordOfDay] = useState<DarijaWord | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/words?tag=essential').then(r=>r.json()).then(setEssentialWords).catch(()=>{});
    fetch('/api/phrases?category=proverbs').then(r=>r.json()).then(setProverbs).catch(()=>{});
    fetch('/api/phrases?category=survival').then(r=>r.json()).then(d=>setFeaturedPhrases(d.slice(0,6))).catch(()=>{});
    fetch('/api/word-of-the-day').then(r=>r.json()).then(d=>setWordOfDay(d.word||null)).catch(()=>{});
    fetch('/api/categories').then(r=>r.json()).then(d=>{
      setWordCategories(d.wordCategories||[]);
      setPhraseCategories(d.phraseCategories||[]);
      setMeta(d.meta||{totalWords:0,totalPhrases:0});
    }).catch(()=>{});
  }, []);

  useEffect(() => {
    if (!query.trim()) { setWordResults([]); setPhraseResults([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r=>r.json())
        .then(d=>{ setWordResults(d.words||[]); setPhraseResults(d.phrases||[]); }).catch(()=>{});
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!activeWordCat) { setCatWords([]); return; }
    fetch(`/api/words?category=${activeWordCat}`).then(r=>r.json()).then(setCatWords).catch(()=>{});
  }, [activeWordCat]);

  useEffect(() => {
    if (!activePhraseCat) { setCatPhrases([]); return; }
    fetch(`/api/phrases?category=${activePhraseCat}`).then(r=>r.json()).then(setCatPhrases).catch(()=>{});
  }, [activePhraseCat]);

  const hasResults = query && (wordResults.length > 0 || phraseResults.length > 0);
  const noResults = query && !hasResults && query.length > 1;

  // Category display name lookup
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

  // ─── WORD ROW (typographic, no boxes) ───
  const renderWord = (w: DarijaWord) => {
    const exp = expandedWord === w.id;
    // Filter out generic tags, show only useful subcategory-style tags
    const displayTags = (w.tags || []).filter(t => !['essential','first-day','common','basic','advanced','intermediate'].includes(t));
    return (
      <div key={w.id} onClick={()=>setExpandedWord(exp?null:w.id)}
        className={`group cursor-pointer py-6 ${exp ? '' : 'border-b border-neutral-100 hover:border-neutral-300'} transition-all`}>
        <div className="flex items-baseline justify-between gap-6 flex-wrap">
          <div className="flex items-baseline gap-5">
            <span className="font-arabic text-3xl md:text-4xl text-[#c53a1a] leading-none">{w.arabic}</span>
            <span className="font-display text-2xl md:text-3xl">{w.darija}</span>
            <span className="hidden md:inline-flex items-baseline gap-2">
              <a href={`/category/${w.category}`} onClick={e => e.stopPropagation()} className="text-xs text-neutral-400 uppercase tracking-wider hover:text-[#c53a1a] transition-colors">{CAT_NAMES[w.category] || w.category}</a>
              {displayTags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs text-neutral-300 uppercase tracking-wider">· {tag}</span>
              ))}
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-neutral-600">{w.english}</span>
            <svg className={`w-4 h-4 text-neutral-300 transition-transform ${exp ? 'rotate-45' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          </div>
        </div>

        {exp && (
          <div className="mt-8 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Pronunciation</p>
              <p className="font-display text-xl mb-6">/{w.pronunciation}/</p>
              <p className="text-neutral-500 text-sm">{w.french}</p>
              {/* Category + tags on mobile (shown here since hidden in header on mobile) */}
              <div className="flex flex-wrap gap-2 mt-4 md:hidden">
                <a href={`/category/${w.category}`} onClick={e => e.stopPropagation()} className="text-xs text-[#c53a1a] uppercase tracking-wider">{CAT_NAMES[w.category] || w.category}</a>
                {displayTags.map(tag => (
                  <span key={tag} className="text-xs text-neutral-400 uppercase tracking-wider">· {tag}</span>
                ))}
              </div>
              {w.register !== 'universal' && <p className="text-xs uppercase tracking-wider text-neutral-400 mt-3">{w.register}</p>}
            </div>
            <div className="md:col-span-4">
              {w.examples?.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-3">In use</p>
                  {w.examples.map((ex,i)=>(
                    <div key={i} className="space-y-1 mb-4">
                      <p className="font-arabic text-xl text-neutral-800">{ex.arabic}</p>
                      <p className="text-neutral-700">{ex.darija}</p>
                      <p className="text-sm text-neutral-500">{ex.english}</p>
                    </div>
                  ))}
                </div>
              )}
              {w.conjugation?.past && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-3">Conjugation</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    {Object.entries(w.conjugation.past).map(([k,v])=>(
                      <div key={k} className="flex gap-3"><span className="text-neutral-400 w-10">{k}</span><span className="text-neutral-700">{v as string}</span></div>
                    ))}
                  </div>
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
  };

  // ─── PHRASE (stacked, typographic) ───
  const renderPhrase = (p: DarijaPhrase) => (
    <div key={p.id} className="py-6 border-b border-neutral-100 last:border-0">
      <p className="font-arabic text-2xl text-[#c53a1a] mb-1">{p.arabic}</p>
      <p className="font-display text-xl mb-2">{p.darija}</p>
      <p className="text-neutral-700">{p.english}</p>
      <p className="text-sm text-neutral-500 mt-1">{p.french}</p>
      {p.literal_translation && <p className="text-xs italic text-neutral-400 mt-2">Literally: {p.literal_translation}</p>}
      {p.response && (
        <div className="mt-4 ml-6 border-l border-neutral-200 pl-5">
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-400 mb-1">They&apos;ll reply</p>
          <p className="text-neutral-700">{p.response.darija}</p>
          <p className="text-sm text-neutral-500">{p.response.english}</p>
        </div>
      )}
      {p.cultural_note && (
        <p className="text-sm text-neutral-500 mt-4 border-l-2 border-[#d4931a]/40 pl-4">{p.cultural_note}</p>
      )}
    </div>
  );

  return (
    <div>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[100vh] flex items-end px-8 md:px-[8%] lg:px-[12%] pb-20 md:pb-32 pt-40 overflow-hidden">
        {/* Giant background Arabic */}
        <div className="absolute top-0 right-0 translate-x-[10%] -translate-y-[5%] pointer-events-none select-none" aria-hidden="true">
          <span className="font-arabic text-[40vw] leading-none text-neutral-900/[0.03]">دارجة</span>
        </div>
        {/* Scattered letters */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          {['د','ر','ج','م','ب','ش'].map((l,i)=>(
            <span key={i} className="absolute font-arabic text-neutral-900/[0.02]" style={{
              fontSize: `${80 + i * 50}px`,
              top: `${10 + i * 14}%`,
              left: `${60 + (i % 3) * 12}%`,
              transform: `rotate(${-15 + i * 8}deg)`
            }}>{l}</span>
          ))}
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-4xl">
            <p className="text-[#c53a1a] text-xs md:text-sm font-medium uppercase tracking-[0.3em] mb-6 md:mb-8 anim-fade-up">Moroccan Arabic</p>
            <h1 className="anim-fade-up delay-1">
              <span className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.85] block tracking-tight italic text-[#c53a1a]">Everyday</span>
              <span className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.85] block tracking-tight">Darija</span>
            </h1>
          </div>

          <div className="mt-12 md:mt-20 grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-5">
              <p className="text-neutral-500 text-lg leading-relaxed anim-fade-up delay-2">The language 40 million Moroccans actually speak — and nobody teaches you properly.</p>
            </div>
            <div className="md:col-span-7 md:col-start-8 anim-fade-up delay-3">
              {/* Search — just an underline, no box */}
              <div className="relative">
                <input ref={inputRef} type="text" value={query} onChange={e=>setQuery(e.target.value)}
                  placeholder="Search — English, French, or Darija"
                  className="w-full pb-4 text-xl md:text-2xl border-b-2 border-neutral-200 focus:border-[#c53a1a] outline-none transition-colors bg-transparent font-display placeholder:text-neutral-300 placeholder:font-display" />
                {query && <button onClick={()=>setQuery('')} className="absolute right-0 bottom-4 text-neutral-400 hover:text-neutral-800"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>}
              </div>
              {!query && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                  {['salam','bread','taxi','how much','beautiful','inshallah'].map(w=>(
                    <button key={w} onClick={()=>setQuery(w)} className="text-sm text-neutral-400 hover:text-[#c53a1a] transition-colors font-display italic">{w}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-x-16 gap-y-8 mt-16 md:mt-24 anim-fade-up delay-4">
            <div><span className="font-display text-4xl md:text-5xl block" style={{letterSpacing:'0.04em'}}>{meta.totalWords ? meta.totalWords.toLocaleString() : '—'}</span><span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-2 block">words</span></div>
            <div><span className="font-display text-4xl md:text-5xl block" style={{letterSpacing:'0.04em'}}>{meta.totalPhrases ? meta.totalPhrases.toLocaleString() : '—'}</span><span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-2 block">phrases</span></div>
            <div><span className="font-display text-4xl md:text-5xl block" style={{letterSpacing:'0.04em'}}>∞</span><span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-2 block">cultural notes</span></div>
          </div>

          {/* 10K Goal Progress */}
          {meta.totalWords > 0 && (() => {
            const goal = 25000;
            const pct = Math.min((meta.totalWords / goal) * 100, 100);
            return (
              <div className="mt-10 max-w-md anim-fade-up delay-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Road to 25,000</span>
                  <span className="text-xs text-neutral-400 font-display">{meta.totalWords.toLocaleString()} / {goal.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c53a1a] rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-neutral-300 mt-2 tracking-wide">Building the most comprehensive Darija dictionary online. One word at a time.</p>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ═══════════ SEARCH RESULTS ═══════════ */}
      {hasResults && (
        <section className="px-8 md:px-[8%] lg:px-[12%] py-20">
          {wordResults.length > 0 && <div className="mb-16"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8">{wordResults.length} words</p>{wordResults.map(renderWord)}</div>}
          {phraseResults.length > 0 && <div><p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8">{phraseResults.length} phrases</p><div className="max-w-3xl">{phraseResults.map(renderPhrase)}</div></div>}
        </section>
      )}
      {noResults && <section className="px-8 md:px-[8%] lg:px-[12%] py-32 text-center"><span className="font-arabic text-8xl text-neutral-100 block mb-6">؟</span><p className="font-display text-3xl text-neutral-800">Nothing for &ldquo;{query}&rdquo; yet</p><p className="text-neutral-400 mt-2">Try another word or browse below.</p></section>}

      {/* ═══════════ WORD OF THE DAY ═══════════ */}
      {!query && wordOfDay && (
        <section className="px-8 md:px-[8%] lg:px-[12%] py-20 md:py-32 border-t border-neutral-100">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-5">
              <p className="text-[#d4931a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Word of the day</p>
              <div className="mb-6">
                <span className="font-arabic text-5xl md:text-6xl text-[#c53a1a] block leading-tight mb-3">{wordOfDay.arabic}</span>
                <span className="font-display text-3xl md:text-4xl block">{wordOfDay.darija}</span>
              </div>
              <p className="text-neutral-400 text-sm mb-1">/{wordOfDay.pronunciation}/</p>
              <p className="text-neutral-600 text-xl mt-4">{wordOfDay.english}</p>
              <p className="text-neutral-400 mt-1">{wordOfDay.french}</p>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex items-center">
              {wordOfDay.cultural_note && (
                <div className="border-l-2 border-[#d4931a] pl-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-3">Cultural note</p>
                  <p className="text-neutral-600 leading-relaxed text-lg">{wordOfDay.cultural_note}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ FIRST DAY ═══════════ */}
      {!query && essentialWords.length > 0 && (
        <section className="px-8 md:px-[8%] lg:px-[12%] py-24 md:py-40">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-7">
              <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Start here</p>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9]">Your first<br/><em>day</em> words</h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 flex items-end">
              <p className="text-neutral-500 leading-relaxed">The words you need before you step out the door. Say them badly — Moroccans will love you for trying.</p>
            </div>
          </div>
          {essentialWords.slice(0,12).map(renderWord)}
        </section>
      )}

      {/* ═══════════ BROWSE WORDS — TAG CLOUD ═══════════ */}
      {!query && wordCategories.length > 0 && (() => {
        const maxCount = Math.max(...wordCategories.map(c => c.count));
        const minCount = Math.min(...wordCategories.map(c => c.count));
        const getSize = (count: number) => {
          const ratio = (count - minCount) / (maxCount - minCount || 1);
          // Scale from 0.85rem to 4.5rem
          return 0.85 + ratio * 3.65;
        };
        const getOpacity = (count: number) => {
          const ratio = (count - minCount) / (maxCount - minCount || 1);
          return 0.35 + ratio * 0.65;
        };
        return (
          <section className="px-8 md:px-[8%] lg:px-[12%] py-24 md:py-40 bg-neutral-50/60">
            <div className="mb-16">
              <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Dictionary</p>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9]">{meta.totalWords.toLocaleString()}<br/>Words</h2>
            </div>
            {/* Tag cloud */}
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3 mb-16 leading-none">
              {wordCategories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveWordCat(activeWordCat === c.id ? null : c.id)}
                  className={`font-display transition-all duration-300 hover:text-[#c53a1a] cursor-pointer ${
                    activeWordCat === c.id ? 'text-[#c53a1a]' : 'text-neutral-800'
                  }`}
                  style={{
                    fontSize: `${getSize(c.count)}rem`,
                    opacity: activeWordCat && activeWordCat !== c.id ? 0.2 : getOpacity(c.count),
                    lineHeight: 1.1,
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
            {activeWordCat && catWords.length > 0 && <div>{catWords.map(renderWord)}</div>}
            {!activeWordCat && <p className="text-neutral-300 font-display text-2xl italic">Tap any word to explore</p>}
          </section>
        );
      })()}

      {/* ═══════════ PHRASES — TAG CLOUD ═══════════ */}
      {!query && phraseCategories.length > 0 && (() => {
        const maxP = Math.max(...phraseCategories.map(c => c.count));
        const minP = Math.min(...phraseCategories.map(c => c.count));
        const getPSize = (count: number) => {
          const ratio = (count - minP) / (maxP - minP || 1);
          return 0.95 + ratio * 2.8;
        };
        const getPOpacity = (count: number) => {
          const ratio = (count - minP) / (maxP - minP || 1);
          return 0.4 + ratio * 0.6;
        };
        return (
        <section className="px-8 md:px-[8%] lg:px-[12%] py-24 md:py-40">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-7">
              <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Phrasebook</p>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9]">{meta.totalPhrases} Phrases<br/><em>that work</em></h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 flex items-end">
              <p className="text-neutral-500 leading-relaxed">Not textbook Arabic. Real Darija — what people actually say in the taxi, at the souk, in the café.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3 mb-16 leading-none">
            {phraseCategories.map(c => (
              <button
                key={c.id}
                onClick={() => setActivePhraseCat(activePhraseCat === c.id ? null : c.id)}
                className={`font-display transition-all duration-300 hover:text-[#c53a1a] cursor-pointer ${
                  activePhraseCat === c.id ? 'text-[#c53a1a]' : 'text-neutral-800'
                }`}
                style={{
                  fontSize: `${getPSize(c.count)}rem`,
                  opacity: activePhraseCat && activePhraseCat !== c.id ? 0.2 : getPOpacity(c.count),
                  lineHeight: 1.1,
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="max-w-3xl">{(activePhraseCat ? catPhrases : featuredPhrases).map(renderPhrase)}</div>
        </section>
        );
      })()}

      {/* ═══════════ PROVERBS ═══════════ */}
      {!query && proverbs.length > 0 && (
        <section className="px-8 md:px-[8%] lg:px-[12%] py-24 md:py-40 bg-neutral-900 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-[15%] -translate-y-[10%] pointer-events-none select-none" aria-hidden="true">
            <span className="font-arabic text-[30vw] leading-none text-white/[0.02]">حكمة</span>
          </div>
          <div className="relative z-10">
            <p className="text-[#d4931a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Hikma</p>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-20">Moroccan<br/><em>Wisdom</em></h2>
            <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
              {proverbs.map(p=>(
                <div key={p.id}>
                  <p className="font-arabic text-2xl text-[#d4931a] mb-2">{p.arabic}</p>
                  <p className="font-display text-xl italic text-white/80 mb-3">{p.darija}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{p.english}</p>
                  {p.literal_translation && <p className="text-white/30 text-xs italic mt-2">Literally: {p.literal_translation}</p>}
                  {p.cultural_note && <p className="text-white/40 text-xs mt-4 border-l border-[#d4931a]/30 pl-4">{p.cultural_note}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
