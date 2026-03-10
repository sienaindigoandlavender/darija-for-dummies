import { MetadataRoute } from 'next';

const SITE_URL = 'https://dharija.space';
const today = new Date().toISOString().split('T')[0];

/**
 * Priority sitemap — static pages + how-to-say + categories only.
 * Word and phrase pages (10,000+) are excluded to prevent Vercel timeout.
 * Google discovers word/phrase pages via internal links from category pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: today, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/grammar`, lastModified: today, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/first-day`, lastModified: today, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/practice`, lastModified: today, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/how-to-say`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
  ];

  // How-to-say pages — highest search value, fully static
  const howToSayTerms = [
    'hello', 'thank-you', 'goodbye', 'how-are-you', 'please', 'sorry', 'yes', 'no',
    'how-much', 'water', 'tea', 'coffee', 'bread', 'delicious', 'beautiful', 'love',
    'where', 'bathroom', 'taxi', 'money', 'food', 'good', 'bad', 'big', 'small',
    'hot', 'cold', 'i-dont-understand', 'i-dont-speak-arabic', 'my-name-is',
    'friend', 'family', 'mother', 'father', 'house', 'market', 'expensive', 'cheap',
    'doctor', 'help', 'eat', 'drink', 'go', 'come', 'want', 'i-like',
    'god-willing', 'welcome', 'lets-go', 'enough',
  ];

  const howToSayPages: MetadataRoute.Sitemap = howToSayTerms.map(term => ({
    url: `${SITE_URL}/how-to-say/${term}`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Category pages — each links to all words in that category
  const wordCategories = [
    'greetings', 'food', 'shopping', 'transport', 'home', 'emotions', 'time',
    'numbers', 'family', 'city', 'money', 'health', 'religion', 'slang', 'verbs',
    'directions', 'crafts', 'animals', 'nature', 'clothing', 'colors', 'music',
    'technology', 'education', 'work', 'pronouns', 'culture', 'architecture',
    'blessings', 'compliments', 'emergency', 'adjectives', 'sports', 'survival',
  ];

  const categoryPages: MetadataRoute.Sitemap = wordCategories.map(cat => ({
    url: `${SITE_URL}/category/${cat}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...howToSayPages, ...categoryPages];
}
