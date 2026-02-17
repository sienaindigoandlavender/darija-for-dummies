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

export async function searchWords(query: string): Promise<DarijaWord[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const { data } = await getClient()
    .from('darija_words')
    .select('*')
    .eq('published', true)
    .or(`darija.ilike.%${q}%,english.ilike.%${q}%,french.ilike.%${q}%,arabic.ilike.%${q}%`)
    .order('order')
    .limit(20);
  return (data || []) as DarijaWord[];
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

export async function searchPhrases(query: string): Promise<DarijaPhrase[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const { data } = await getClient()
    .from('darija_phrases')
    .select('*')
    .eq('published', true)
    .or(`darija.ilike.%${q}%,english.ilike.%${q}%,french.ilike.%${q}%,arabic.ilike.%${q}%`)
    .order('order')
    .limit(15);
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
  const [words, phrases] = await Promise.all([
    getAllWords(),
    getAllPhrases(),
  ]);
  return {
    totalWords: words.length,
    totalPhrases: phrases.length,
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
  pronouns: { name: 'Pronouns' },
  culture: { name: 'Culture' },
  architecture: { name: 'Architecture' },
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
  const words = await getAllWords();
  const catCounts = new Map<string, number>();
  words.forEach(w => catCounts.set(w.category, (catCounts.get(w.category) || 0) + 1));
  return Array.from(catCounts.entries())
    .map(([id, count]) => ({
      id,
      name: WORD_CATEGORIES[id]?.name || id,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getPhraseCategories() {
  const phrases = await getAllPhrases();
  const catCounts = new Map<string, number>();
  phrases.forEach(p => catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1));
  return Array.from(catCounts.entries())
    .map(([id, count]) => ({
      id,
      name: PHRASE_CATEGORIES[id] || id,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}
