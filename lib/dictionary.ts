import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase not configured');
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, { ...options, cache: 'no-store' });
      },
    },
  });
}

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
}

// ---- Word queries ----

export async function getAllWords(): Promise<DarijaWord[]> {
  const all: DarijaWord[] = [];
  let from = 0;
  const step = 200;
  while (true) {
    const { data } = await getClient()
      .from('darija_words')
      .select('*')
      .eq('published', true)
      .order('order')
      .range(from, from + step - 1);
    if (!data || data.length === 0) break;
    all.push(...(data as DarijaWord[]));
    if (data.length < step) break;
    from += step;
  }
  return all;
}

export async function getWordsByCategory(category: string): Promise<DarijaWord[]> {
  const { data } = await getClient()
    .from('darija_words')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('order');
  return (data || []) as DarijaWord[];
}

export async function getWordsByTag(tag: string): Promise<DarijaWord[]> {
  const { data } = await getClient()
    .from('darija_words')
    .select('*')
    .eq('published', true)
    .contains('tags', [tag])
    .order('order');
  return (data || []) as DarijaWord[];
}

// ---- Darija fuzzy search ----

// Normalize Darija transliteration variants so "shokran" matches "shukran"
function normalizeDarija(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Common vowel swaps in Darija Latin
    .replace(/ou/g, 'u')
    .replace(/oo/g, 'u')
    .replace(/ee/g, 'i')
    .replace(/ei/g, 'i')
    .replace(/ai/g, 'a')
    .replace(/ay/g, 'a')
    // Common consonant variants
    .replace(/ch/g, 'sh')
    .replace(/tch/g, 'sh')
    .replace(/ph/g, 'f')
    .replace(/dh/g, 'd')
    .replace(/th/g, 't')
    // Number-to-letter (people sometimes type the letter instead)
    .replace(/aa/g, '3')
    // Double consonant reduction for matching
    .replace(/([^aeiou3789])\1+/g, '$1$1')
    // Remove dashes and spaces for looser matching
    .replace(/[-\s]/g, '')
    // Normalize common ending variants
    .replace(/ah$/, 'a')
    .replace(/eh$/, 'a')
    .replace(/iya$/, 'ia');
}

// Calculate similarity score (0-1) between two normalized strings
function similarity(a: string, b: string): number {
  const na = normalizeDarija(a);
  const nb = normalizeDarija(b);
  
  // Exact match after normalization
  if (na === nb) return 1;
  
  // Contains match
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  
  // Levenshtein distance for fuzzy matching
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return 1;
  const dist = levenshtein(na, nb);
  const score = 1 - dist / maxLen;
  return score;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

export async function searchWords(query: string): Promise<DarijaWord[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  
  // First: exact ilike search (fast, server-side)
  const { data: exact } = await getClient()
    .from('darija_words')
    .select('*')
    .eq('published', true)
    .or(`darija.ilike.%${q}%,english.ilike.%${q}%,french.ilike.%${q}%,arabic.ilike.%${q}%`)
    .order('order')
    .limit(20);
  
  if (exact && exact.length >= 5) return exact as DarijaWord[];
  
  // Second: normalized Darija search (try common variants)
  const nq = normalizeDarija(q);
  const variants = generateVariants(q);
  
  let fuzzyResults: DarijaWord[] = exact ? [...exact as DarijaWord[]] : [];
  const seenIds = new Set(fuzzyResults.map(w => w.id));
  
  for (const variant of variants) {
    if (fuzzyResults.length >= 20) break;
    const { data } = await getClient()
      .from('darija_words')
      .select('*')
      .eq('published', true)
      .or(`darija.ilike.%${variant}%,english.ilike.%${variant}%`)
      .order('order')
      .limit(10);
    if (data) {
      for (const w of data as DarijaWord[]) {
        if (!seenIds.has(w.id)) {
          seenIds.add(w.id);
          fuzzyResults.push(w);
        }
      }
    }
  }
  
  return fuzzyResults.slice(0, 20);
}

// Generate common Darija spelling variants
function generateVariants(query: string): string[] {
  const q = query.toLowerCase().trim();
  const variants = new Set<string>();
  
  // Vowel swaps
  variants.add(q.replace(/o/g, 'u'));
  variants.add(q.replace(/u/g, 'o'));
  variants.add(q.replace(/e/g, 'i'));
  variants.add(q.replace(/i/g, 'e'));
  variants.add(q.replace(/ou/g, 'u'));
  variants.add(q.replace(/ch/g, 'sh'));
  variants.add(q.replace(/sh/g, 'ch'));
  variants.add(q.replace(/k/g, 'q'));
  variants.add(q.replace(/q/g, 'k'));
  // Double/single consonant
  variants.add(q.replace(/([a-z])\1/g, '$1'));
  variants.add(q.replace(/([^aeiou])/g, '$1$1').replace(/([a-z])\1\1+/g, '$1$1'));
  // With/without h
  variants.add(q.replace(/h/g, ''));
  variants.add(q + 'a');
  variants.add(q.replace(/a$/, ''));
  
  // Remove the original query
  variants.delete(q);
  
  return Array.from(variants).slice(0, 6);
}

export async function searchPhrases(query: string): Promise<DarijaPhrase[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  
  const { data: exact } = await getClient()
    .from('darija_phrases')
    .select('*')
    .eq('published', true)
    .or(`darija.ilike.%${q}%,english.ilike.%${q}%,french.ilike.%${q}%,arabic.ilike.%${q}%`)
    .order('order')
    .limit(15);
  
  if (exact && exact.length >= 3) return exact as DarijaPhrase[];
  
  // Try variants for phrases too
  const variants = generateVariants(q);
  let results: DarijaPhrase[] = exact ? [...exact as DarijaPhrase[]] : [];
  const seenIds = new Set(results.map(p => p.id));
  
  for (const variant of variants.slice(0, 3)) {
    if (results.length >= 15) break;
    const { data } = await getClient()
      .from('darija_phrases')
      .select('*')
      .eq('published', true)
      .or(`darija.ilike.%${variant}%,english.ilike.%${variant}%`)
      .order('order')
      .limit(8);
    if (data) {
      for (const p of data as DarijaPhrase[]) {
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id);
          results.push(p);
        }
      }
    }
  }
  
  return results.slice(0, 15);
}

// ---- Phrase queries ----

export async function getAllPhrases(): Promise<DarijaPhrase[]> {
  const all: DarijaPhrase[] = [];
  let from = 0;
  const step = 200;
  while (true) {
    const { data } = await getClient()
      .from('darija_phrases')
      .select('*')
      .eq('published', true)
      .order('order')
      .range(from, from + step - 1);
    if (!data || data.length === 0) break;
    all.push(...(data as DarijaPhrase[]));
    if (data.length < step) break;
    from += step;
  }
  return all;
}

export async function getPhrasesByCategory(category: string): Promise<DarijaPhrase[]> {
  const { data } = await getClient()
    .from('darija_phrases')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('order');
  return (data || []) as DarijaPhrase[];
}

export async function getProverbs(): Promise<DarijaPhrase[]> {
  const { data } = await getClient()
    .from('darija_phrases')
    .select('*')
    .eq('published', true)
    .eq('category', 'proverbs')
    .order('order');
  return (data || []) as DarijaPhrase[];
}

// ---- Metadata ----

export async function getMetadata() {
  const client = getClient();
  const [wordsCount, phrasesCount] = await Promise.all([
    client.from('darija_words').select('id', { count: 'exact', head: true }).eq('published', true),
    client.from('darija_phrases').select('id', { count: 'exact', head: true }).eq('published', true),
  ]);
  return {
    totalWords: wordsCount.count || 0,
    totalPhrases: phrasesCount.count || 0,
  };
}

// ---- Category helpers ----

const WORD_CATEGORIES: Record<string, { name: string }> = {
  greetings: { name: 'Greetings' },
  food: { name: 'Food & Drink' },
  shopping: { name: 'Shopping' },
  transport: { name: 'Transport' },
  home: { name: 'Home & House' },
  emotions: { name: 'Feelings' },
  time: { name: 'Time' },
  numbers: { name: 'Numbers' },
  family: { name: 'Family & People' },
  city: { name: 'City & Medina' },
  money: { name: 'Money' },
  health: { name: 'Health' },
  religion: { name: 'Faith & Blessings' },
  slang: { name: 'Street Slang' },
  verbs: { name: 'Verbs' },
  directions: { name: 'Directions' },
  crafts: { name: 'Crafts & Materials' },
  animals: { name: 'Animals' },
  nature: { name: 'Nature & Weather' },
  clothing: { name: 'Clothing' },
  colors: { name: 'Colors' },
  music: { name: 'Music & Culture' },
  technology: { name: 'Technology' },
  education: { name: 'Education' },
  work: { name: 'Work & Professions' },
  pronouns: { name: 'Pronouns & Grammar' },
  culture: { name: 'Culture' },
  architecture: { name: 'Architecture' },
  blessings: { name: 'Blessings & Prayers' },
  compliments: { name: 'Compliments' },
  emergency: { name: 'Emergency' },
  adjectives: { name: 'Adjectives' },
  sports: { name: 'Sports' },
  survival: { name: 'Survival Kit' },
};

const PHRASE_CATEGORIES: Record<string, string> = {
  survival: 'Survival Kit',
  souk: 'In the Souk',
  taxi: 'Taxi Talk',
  cafe: 'Café Culture',
  riad: 'Riad Life',
  restaurant: 'Eating Out',
  pharmacy: 'At the Pharmacy',
  compliments: 'Compliments',
  arguments: 'Arguments',
  proverbs: 'Proverbs & Wisdom',
  blessings: 'Blessings',
  daily: 'Daily Life',
  emergency: 'Emergency',
};

export async function getWordCategories() {
  // Fetch only id and category columns instead of all 10,000 full rows
  const all: { category: string }[] = [];
  let from = 0;
  const step = 1000;
  while (true) {
    const { data } = await getClient()
      .from('darija_words')
      .select('category')
      .eq('published', true)
      .range(from, from + step - 1);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < step) break;
    from += step;
  }
  const catCounts = new Map<string, number>();
  all.forEach(w => catCounts.set(w.category, (catCounts.get(w.category) || 0) + 1));
  return Array.from(catCounts.entries())
    .map(([id, count]) => ({
      id,
      name: WORD_CATEGORIES[id]?.name || id,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getPhraseCategories() {
  const { data } = await getClient()
    .from('darija_phrases')
    .select('category')
    .eq('published', true);
  const catCounts = new Map<string, number>();
  (data || []).forEach((p: { category: string }) => catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1));
  return Array.from(catCounts.entries())
    .map(([id, count]) => ({
      id,
      name: PHRASE_CATEGORIES[id] || id,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}
