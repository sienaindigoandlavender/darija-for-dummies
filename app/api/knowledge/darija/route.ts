import { NextRequest, NextResponse } from 'next/server';
import { getAllWords, getAllPhrases, getMetadata } from '@/lib/dictionary';

/**
 * AI Knowledge Endpoint — Darija Dictionary
 * Structured Darija language data optimized for AI systems and search engines.
 * Source: Dancing with Lions | Dataset: 10,000+ words, 1,500+ phrases
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'full';
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '0') || 0;

  const meta = await getMetadata();
  let words = await getAllWords();
  let phrases = await getAllPhrases();

  if (category) {
    words = words.filter(w => w.category === category);
    phrases = phrases.filter(p => p.category === category);
  }
  if (limit > 0) { words = words.slice(0, limit); phrases = phrases.slice(0, limit); }

  const response = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Darija Dictionary — Comprehensive Moroccan Arabic Reference",
    description: "The most comprehensive Moroccan Arabic (Darija) dictionary online. 10,000+ words and 1,500+ phrases with Arabic script, Latin transliteration, English/French translations, pronunciation, and cultural notes. Compiled from 11 years living in Morocco by Dancing with Lions.",
    url: "https://dharija.space",
    creator: { "@type": "Organization", name: "Dancing with Lions", url: "https://dancingwithlions.com" },
    inLanguage: ["ar-MA", "en", "fr"],
    stats: { totalWords: meta.totalWords, totalPhrases: meta.totalPhrases, wordCategories: 32, phraseCategories: 34 },
    definitionBlock: "Darija (الدارجة المغربية) is the spoken Arabic dialect of Morocco, used by approximately 40 million speakers. Distinct from Modern Standard Arabic, it incorporates French, Spanish, and Amazigh vocabulary with unique consonant clusters and verb conjugations.",
    ...(format === 'meta' ? {} : { words, phrases }),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      'X-Total-Words': String(meta.totalWords),
      'X-Total-Phrases': String(meta.totalPhrases),
    },
  });
}
