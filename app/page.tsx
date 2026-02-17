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
interface WordCat { id: string; name: string; icon: string; count: number }
interface PhraseCat { id: string; name: string; count: number }

const bgLetters = ['د','ر','ج','ة','م','غ','ب','ع','ش','ك','ل','ن'];

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/words?tag=essential').then(r=>r.json()).then(setEssentialWords).catch(()=>{});
    fetch('/api/phrases?category=proverbs').then(r=>r.json()).then(setProverbs).catch(()=>{});
    fetch('/api/phrases?category=survival').then(r=>r.json()).then(d=>setFeaturedPhrases(d.slice(0,6))).catch(()=>{});
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

  const renderReg = (r: string) => <span className={`register-${r} text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium`}>{r}</span>;

  const renderWord = (w: DarijaWord) => {
    const exp = expandedWord === w.id;
    return (
      <div key={w.id} className={`group border border-foreground/8 hover:border-accent/30 transition-all hover-lift cursor-pointer ${exp?'bg-surface col-span-full':''}`} onClick={()=>setExpandedWord(exp?null:w.id)}>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-arabic text-2xl text-accent leading-none">{w.arabic}</span>
              <span className="font-display text-xl">{w.darija}</span>
            </div>
            {renderReg(w.register)}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground/50 uppercase tracking-wider">{w.part_of_speech}</span>
            {w.gender && <><span className="text-xs text-muted-foreground/30">·</span><span className="text-xs text-muted-foreground/50">{w.gender}</span></>}
          </div>
          <p className="text-foreground/80">{w.english}</p>
          <p className="text-muted-foreground text-sm">{w.french}</p>
          {exp && (
            <div className="mt-5 pt-5 border-t border-foreground/8 space-y-4">
              <div><span className="text-[10px] uppercase tracking-wider text-muted-foreground">Pronunciation</span><p className="font-display text-lg mt-1">/{w.pronunciation}/</p></div>
              {w.examples?.length > 0 && <div><span className="text-[10px] uppercase tracking-wider text-muted-foreground">Example</span>{w.examples.map((ex,i)=>(<div key={i} className="mt-2 space-y-1"><p className="font-arabic text-lg">{ex.arabic}</p><p className="font-medium">{ex.darija}</p><p className="text-sm text-muted-foreground">{ex.english}</p></div>))}</div>}
              {w.cultural_note && <div className="culture-note py-3 mt-3"><span className="text-[10px] uppercase tracking-wider text-accent-warm block mb-1">Cultural Note</span><p className="text-sm leading-relaxed">{w.cultural_note}</p></div>}
              {w.conjugation?.past && <div><span className="text-[10px] uppercase tracking-wider text-muted-foreground">Conjugation (past)</span><div className="grid grid-cols-2 gap-2 mt-2 text-sm">{Object.entries(w.conjugation.past).map(([k,v])=>(<div key={k} className="flex gap-2"><span className="text-muted-foreground w-12">{k}</span><span className="font-medium">{v as string}</span></div>))}</div></div>}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPhrase = (p: DarijaPhrase) => (
    <div key={p.id} className="group p-5 border border-foreground/8 hover:border-accent/30 transition-all hover-lift">
      <div className="mb-3"><p className="font-arabic text-xl text-accent mb-1">{p.arabic}</p><p className="font-display text-lg">{p.darija}</p></div>
      <p className="text-foreground/80 text-sm">{p.english}</p>
      <p className="text-muted-foreground text-xs mt-1">{p.french}</p>
      {p.pronunciation && <p className="text-xs text-muted-foreground/50 mt-2">/{p.pronunciation}/</p>}
      {p.literal_translation && <p className="text-xs italic text-muted-foreground/50 mt-1">Lit: {p.literal_translation}</p>}
      {p.response && <div className="mt-3 pt-3 border-t border-foreground/5"><span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Response</span><p className="text-sm font-medium mt-1">{p.response.darija}</p><p className="text-xs text-muted-foreground">{p.response.english}</p></div>}
      {p.cultural_note && <div className="culture-note py-2 mt-3"><p className="text-xs leading-relaxed">{p.cultural_note}</p></div>}
    </div>
  );

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center px-6 py-20 grain">
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          {bgLetters.map((l,i)=>(<span key={i} className="arabic-deco absolute font-arabic" style={{fontSize:`${100+Math.random()*280}px`,top:`${(i*9)%95}%`,left:`${(i*11+5)%90}%`,transform:`rotate(${-10+Math.random()*20}deg)`}}>{l}</span>))}
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div className="anim-slide-left"><span className="text-accent text-sm font-medium uppercase tracking-[0.25em] mb-4 block">Moroccan Arabic</span></div>
              <h1 className="anim-slide-left delay-1">
                <span className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.85] block">Darija</span>
                <span className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.85] block italic text-accent">for</span>
                <span className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.85] block">Dummies</span>
              </h1>
              <p className="text-muted-foreground mt-6 text-lg max-w-md leading-relaxed anim-slide-left delay-3">The language 40 million Moroccans actually speak — and nobody teaches you properly.</p>
            </div>
            <div className="md:col-span-5 flex flex-col items-center md:items-end gap-8">
              <div className="anim-slide-right delay-2"><span className="font-arabic text-[8rem] md:text-[10rem] leading-none text-foreground/[0.06]">دارجة</span></div>
              <div className="flex gap-8 anim-fade-up delay-5">
                <div className="text-center"><span className="font-display text-5xl block">{meta.totalWords||'...'}</span><span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Words</span></div>
                <div className="text-center"><span className="font-display text-5xl block">{meta.totalPhrases||'...'}</span><span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Phrases</span></div>
                <div className="text-center"><span className="font-display text-5xl block">∞</span><span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Cultural notes</span></div>
              </div>
            </div>
          </div>
          <div className="mt-16 max-w-2xl anim-fade-up delay-4">
            <div className="relative">
              <input ref={inputRef} type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search any word — English, French, or Darija..." className="w-full px-6 py-5 text-lg md:text-xl border-2 border-foreground/10 focus:border-accent/50 focus:outline-none transition-all bg-background font-display placeholder:font-sans placeholder:text-base placeholder:font-light" />
              {query && <button onClick={()=>setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg></button>}
            </div>
            {!query && <div className="flex flex-wrap gap-3 mt-4 text-sm anim-fade-up delay-6"><span className="text-muted-foreground/40">Try:</span>{['salam','bread','taxi','how much','beautiful','inshallah'].map(w=>(<button key={w} onClick={()=>setQuery(w)} className="text-foreground/50 hover:text-accent transition-colors font-display italic">{w}</button>))}</div>}
          </div>
        </div>
      </section>

      {hasResults && <section className="py-16 px-6"><div className="max-w-6xl mx-auto">
        {wordResults.length>0 && <div className="mb-12"><div className="flex items-baseline gap-3 mb-6"><span className="font-display text-4xl">{wordResults.length}</span><span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">words</span></div><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{wordResults.map(renderWord)}</div></div>}
        {phraseResults.length>0 && <div><div className="flex items-baseline gap-3 mb-6"><span className="font-display text-4xl">{phraseResults.length}</span><span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">phrases</span></div><div className="grid gap-3 md:grid-cols-2">{phraseResults.map(renderPhrase)}</div></div>}
      </div></section>}

      {noResults && <section className="py-20 px-6 text-center"><span className="font-arabic text-7xl text-foreground/10 block mb-4">؟</span><p className="font-display text-2xl mb-2">Ma lgina-sh &ldquo;{query}&rdquo;</p><p className="text-sm text-muted-foreground">We didn&apos;t find that one yet.</p></section>}

      {!query && essentialWords.length>0 && <section className="py-20 md:py-28 px-6"><div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 mb-12"><div className="md:col-span-8"><span className="text-accent text-xs font-medium uppercase tracking-[0.25em] block mb-3">Start Here</span><h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">Your First<br/><em>Day</em> Words</h2></div><div className="md:col-span-4 flex items-end"><p className="text-sm text-muted-foreground leading-relaxed">The words you need before you step out the door.</p></div></div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{essentialWords.slice(0,12).map(renderWord)}</div>
      </div></section>}

      {!query && wordCategories.length>0 && <section className="py-20 md:py-28 px-6 bg-surface relative grain"><div className="max-w-6xl mx-auto">
        <div className="mb-12"><span className="text-accent text-xs font-medium uppercase tracking-[0.25em] block mb-3">Explore</span><h2 className="font-display text-4xl md:text-5xl leading-tight">{meta.totalWords} Words</h2></div>
        <div className="flex flex-wrap gap-2 mb-10">{wordCategories.map(c=>(<button key={c.id} onClick={()=>setActiveWordCat(activeWordCat===c.id?null:c.id)} className={`text-sm px-4 py-2.5 transition-all flex items-center gap-2 ${activeWordCat===c.id?'bg-foreground text-background':'border border-foreground/10 hover:border-foreground/30 hover:bg-background'}`}><span>{c.icon}</span><span>{c.name}</span><span className="text-[10px] opacity-50">{c.count}</span></button>))}</div>
        {activeWordCat && catWords.length>0 && <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{catWords.map(renderWord)}</div>}
        {!activeWordCat && <p className="text-muted-foreground/50 text-sm italic">Pick a category above ↑</p>}
      </div></section>}

      {!query && phraseCategories.length>0 && <section className="py-20 md:py-28 px-6"><div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 mb-12"><div className="md:col-span-7"><span className="text-accent text-xs font-medium uppercase tracking-[0.25em] block mb-3">Real Situations</span><h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">{meta.totalPhrases} Phrases<br/><em>That Work</em></h2></div><div className="md:col-span-5 flex items-end"><p className="text-sm text-muted-foreground leading-relaxed">Not textbook Arabic. Real Darija.</p></div></div>
        <div className="flex flex-wrap gap-2 mb-10">{phraseCategories.map(c=>(<button key={c.id} onClick={()=>setActivePhraseCat(activePhraseCat===c.id?null:c.id)} className={`text-sm px-4 py-2 transition-all ${activePhraseCat===c.id?'bg-accent text-white':'border border-foreground/10 hover:border-accent/30'}`}>{c.name}<span className="text-[10px] ml-1 opacity-50">{c.count}</span></button>))}</div>
        <div className="grid gap-3 md:grid-cols-2">{(activePhraseCat?catPhrases:featuredPhrases).map(renderPhrase)}</div>
      </div></section>}

      {!query && proverbs.length>0 && <section className="py-20 md:py-28 px-6 bg-foreground text-background relative">
        <div className="absolute right-0 top-0 font-arabic text-[20rem] leading-none text-background/[0.03] translate-x-10 -translate-y-10 pointer-events-none select-none" aria-hidden="true">حكمة</div>
        <div className="max-w-5xl mx-auto relative z-10">
          <span className="text-accent-warm text-xs font-medium uppercase tracking-[0.25em] block mb-3">Hikma</span>
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-12">Moroccan<br/><em>Wisdom</em></h2>
          <div className="grid gap-6 md:grid-cols-2">{proverbs.map(p=>(<div key={p.id} className="border border-background/10 p-6 hover:border-background/25 transition-all"><p className="font-arabic text-xl text-accent-warm mb-2">{p.arabic}</p><p className="font-display text-lg italic mb-2">{p.darija}</p><p className="text-background/70 text-sm">{p.english}</p>{p.literal_translation && <p className="text-background/40 text-xs italic mt-1">Lit: {p.literal_translation}</p>}{p.cultural_note && <p className="text-background/50 text-xs mt-3 border-l-2 border-accent-warm/40 pl-3">{p.cultural_note}</p>}</div>))}</div>
        </div>
      </section>}
    </div>
  );
}
