import { getAllWords, getAllPhrases } from '@/lib/dictionary';

const SITE_URL = 'https://dharija.space';

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${SITE_URL}/grammar`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${SITE_URL}/first-day`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${SITE_URL}/practice`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/how-to-say`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ];

  // How-to-say pages (50 terms)
  const howToSayTerms = [
    'hello', 'thank-you', 'goodbye', 'how-are-you', 'please', 'sorry', 'yes', 'no',
    'how-much', 'water', 'tea', 'coffee', 'bread', 'delicious', 'beautiful', 'love',
    'where', 'bathroom', 'taxi', 'money', 'food', 'good', 'bad', 'big', 'small',
    'hot', 'cold', 'i-dont-understand', 'i-dont-speak-arabic', 'my-name-is',
    'friend', 'family', 'mother', 'father', 'house', 'market', 'expensive', 'cheap',
    'doctor', 'help', 'eat', 'drink', 'go', 'come', 'want', 'i-like',
    'god-willing', 'welcome', 'lets-go', 'enough',
  ];

  const howToSayPages = howToSayTerms.map(term => ({
    url: `${SITE_URL}/how-to-say/${term}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Category pages from actual data
  const allWords = await getAllWords();
  const categories = new Set<string>();
  allWords.forEach(w => categories.add(w.category));

  const categoryPages = Array.from(categories).map(cat => ({
    url: `${SITE_URL}/category/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Individual word pages (high value for LLM indexing)
  const wordPages = allWords.map(w => ({
    url: `${SITE_URL}/word/${w.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Knowledge API (for AI crawlers)
  const apiPages = [
    { url: `${SITE_URL}/api/knowledge/darija`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
  ];

  return [...staticPages, ...howToSayPages, ...categoryPages, ...wordPages, ...apiPages];
}
