/**
 * Darija Dictionary — Local JSON Data Layer
 * Replaces Supabase with hardcoded JSON files.
 */

import wordsData from '@/data/words.json';
import phrasesData from '@/data/phrases.json';

// ---- Types ----

export interface DarijaWord {
  id: string;
  darija: string;
  arabic: string;
  english: string;
  french: string;
  pronunciation: string;
  category: string;
  part_of_speech: string;
  gender?: string;
  plural?: string;
  conjugation?: Record<string, Record<string, string>>;
  examples: { darija: string; arabic: string; english: string; french: string }[];
  cultural_note?: string;
  register: string;
  related_words?: string[];
  tags: string[];
  order: number;
}

export interface DarijaPhrase {
  id: string;
  darija: string;
  arabic: string;
  english: string;
  french: string;
  pronunciation: string;
  literal_translation?: string;
  category: string;
  situation?: string;
  cultural_note?: string;
  register: string;
  response?: { darija: string; arabic: string; english: string };
  tags: string[];
  order: number;
}

const allWords: DarijaWord[] = wordsData as DarijaWord[];
const allPhrases: DarijaPhrase[] = phrasesData as DarijaPhrase[];

// ---- Word queries ----

export async function getAllWords(): Promise<DarijaWord[]> { return allWords; }

export async function getWordById(id: string): Promise<DarijaWord | null> {
  return allWords.find(w => w.id === id) || null;
}

export async function getWordsByCategory(category: string): Promise<DarijaWord[]> {
  return allWords.filter(w => w.category === category).sort((a, b) => a.order - b.order);
}

export async function getWordsByTag(tag: string): Promise<DarijaWord[]> {
  return allWords.filter(w => w.tags?.includes(tag)).sort((a, b) => a.order - b.order);
}

// ---- Fuzzy search ----

function normalizeDarija(text: string): string {
  return text.toLowerCase().trim()
    .replace(/ou/g, 'u').replace(/oo/g, 'u').replace(/ee/g, 'i')
    .replace(/ei/g, 'i').replace(/ai/g, 'a').replace(/ay/g, 'a')
    .replace(/ch/g, 'sh').replace(/tch/g, 'sh').replace(/ph/g, 'f')
    .replace(/dh/g, 'd').replace(/th/g, 't').replace(/aa/g, '3')
    .replace(/o/g, 'u')
    .replace(/([^aeiou3789])\1+/g, '$1$1')
    .replace(/[-\s]/g, '').replace(/ah$/, 'a').replace(/eh$/, 'a').replace(/iya$/, 'ia');
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

export async function searchWords(query: string): Promise<DarijaWord[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const nq = normalizeDarija(q);
  return allWords
    .map(w => {
      let score = 0;
      for (const f of [w.darija, w.english, w.french, w.arabic]) {
        const fl = f.toLowerCase();
        if (fl === q) { score = 100; break; }
        if (fl.startsWith(q)) score = Math.max(score, 90);
        if (fl.includes(q)) score = Math.max(score, 80);
      }
      if (score === 0) {
        const nd = normalizeDarija(w.darija);
        if (nd === nq) score = 75;
        else if (nd.includes(nq)) {
          // Penalize when query matches inside a much longer word
          const lenRatio = nq.length / nd.length;
          score = Math.round(65 * Math.max(lenRatio, 0.5));
        } else if (nq.includes(nd)) {
          // Penalize when word is much shorter than query (e.g. 'ra' inside 'shokran')
          const lenRatio = nd.length / nq.length;
          if (lenRatio > 0.4) score = Math.round(60 * lenRatio);
        } else {
          const dist = levenshtein(nq, nd);
          const maxLen = Math.max(nq.length, nd.length);
          if (maxLen > 0 && (1 - dist / maxLen) > 0.6) score = Math.round((1 - dist / maxLen) * 50);
        }
      }
      return { word: w, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(x => x.word);
}

export async function searchPhrases(query: string): Promise<DarijaPhrase[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allPhrases.filter(p => [p.darija, p.english, p.french, p.arabic].some(f => f.toLowerCase().includes(q))).slice(0, 15);
}

// ---- Phrase queries ----

export async function getAllPhrases(): Promise<DarijaPhrase[]> { return allPhrases; }

export async function getPhraseById(id: string): Promise<DarijaPhrase | null> {
  return allPhrases.find(p => p.id === id) || null;
}

export async function getPhrasesByCategory(category: string): Promise<DarijaPhrase[]> {
  return allPhrases.filter(p => p.category === category).sort((a, b) => a.order - b.order);
}

export async function getProverbs(): Promise<DarijaPhrase[]> {
  return allPhrases.filter(p => p.category === 'proverbs').sort((a, b) => a.order - b.order);
}

// ---- Metadata ----

export async function getMetadata() {
  return { totalWords: allWords.length, totalPhrases: allPhrases.length };
}

// ---- Category helpers ----

const WORD_CATEGORIES: Record<string, { name: string }> = {
  greetings:{name:'Greetings'},food:{name:'Food & Drink'},shopping:{name:'Shopping'},transport:{name:'Transport'},
  home:{name:'Home & House'},emotions:{name:'Feelings'},time:{name:'Time'},numbers:{name:'Numbers'},
  family:{name:'Family & People'},city:{name:'City & Medina'},money:{name:'Money'},health:{name:'Health'},
  religion:{name:'Faith & Blessings'},slang:{name:'Street Slang'},verbs:{name:'Verbs'},directions:{name:'Directions'},
  crafts:{name:'Crafts & Materials'},animals:{name:'Animals'},nature:{name:'Nature & Weather'},clothing:{name:'Clothing'},
  colors:{name:'Colors'},music:{name:'Music & Culture'},technology:{name:'Technology'},education:{name:'Education'},
  work:{name:'Work & Professions'},pronouns:{name:'Pronouns & Grammar'},culture:{name:'Culture'},
  architecture:{name:'Architecture'},blessings:{name:'Blessings & Prayers'},compliments:{name:'Compliments'},
  emergency:{name:'Emergency'},adjectives:{name:'Adjectives'},sports:{name:'Sports'},survival:{name:'Survival Kit'},
};

const PHRASE_CATEGORIES: Record<string, string> = {
  survival:'Survival Kit',souk:'In the Souk',taxi:'Taxi Talk',cafe:'Café Culture',riad:'Riad Life',
  restaurant:'Eating Out',pharmacy:'At the Pharmacy',compliments:'Compliments',arguments:'Arguments',
  proverbs:'Proverbs & Wisdom',blessings:'Blessings',daily:'Daily Life',emergency:'Emergency',
  hammam:'Hammam Guide',medina:'Medina Life',desert:'Desert Adventures',love:'Love & Romance',
  ramadan:'Ramadan',wedding:'Weddings',football:'Football',family:'Family',family_life:'Family Life',
  weather:'Weather',cooking:'Cooking',atlas:'Atlas Mountains',beach:'Beach & Coast',
  phone:'Phone & Tech',work:'Work & Business',nightlife:'Nightlife',health:'Health',
  transport:'Transport',photography:'Photography',festivals:'Festivals',garden:'Gardens & Nature',
};

export async function getWordCategories() {
  const catCounts = new Map<string, number>();
  allWords.forEach(w => catCounts.set(w.category, (catCounts.get(w.category) || 0) + 1));
  return Array.from(catCounts.entries()).map(([id, count]) => ({ id, name: WORD_CATEGORIES[id]?.name || id, count })).sort((a, b) => b.count - a.count);
}

export async function getPhraseCategories() {
  const catCounts = new Map<string, number>();
  allPhrases.forEach(p => catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1));
  return Array.from(catCounts.entries()).map(([id, count]) => ({ id, name: PHRASE_CATEGORIES[id] || id, count })).sort((a, b) => b.count - a.count);
}
