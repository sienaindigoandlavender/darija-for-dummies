import { getWordsByCategory, getWordCategories } from '@/lib/dictionary';
import type { Metadata } from 'next';
import CategoryClient from './CategoryClient';

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  food: { title: 'Moroccan Food Words in Darija', description: 'Every Darija word you need at the table — tagine, couscous, mint tea, street food, spices, and the phrases that make Moroccan hosts smile.' },
  greetings: { title: 'Darija Greetings & Social Phrases', description: 'The greeting sequences, blessings, and social scripts that run Moroccan daily life. Skip these and you skip connection.' },
  verbs: { title: 'Darija Verb Conjugations', description: 'Essential Moroccan Arabic verbs with conjugation patterns. The ka- present, past tense, ghadi future, and ma...sh negation.' },
  shopping: { title: 'Souk Shopping Darija', description: 'Bargaining phrases, price negotiation, and the words you need to shop in any Moroccan medina souk.' },
  transport: { title: 'Transport & Travel Darija', description: 'Taxi, train, bus, airport — every transport word in Moroccan Arabic with pronunciation and cultural tips.' },
  home: { title: 'Home & House Words in Darija', description: 'Riad vocabulary, room names, household items, and the domestic language of Moroccan life.' },
  emotions: { title: 'Feelings & Emotions in Darija', description: 'How to express happiness, sadness, anger, surprise, and every feeling in between in Moroccan Arabic.' },
  family: { title: 'Family & People in Darija', description: 'Mother, father, siblings, friends, neighbors — the relationship vocabulary of Moroccan social life.' },
  city: { title: 'City & Medina Words in Darija', description: 'Souk, medina, mellah, derb, bab — the vocabulary of Moroccan urban life and ancient cities.' },
  religion: { title: 'Faith & Blessings in Darija', description: 'Islamic phrases woven into daily Moroccan speech — inshallah, bismillah, l-hamdulillah, and the blessings that mean everything.' },
  numbers: { title: 'Numbers & Counting in Darija', description: 'Count from 1 to 1000 in Moroccan Arabic, plus the ryal system and market math.' },
  time: { title: 'Time, Days & Calendar in Darija', description: 'Days of the week, months, seasons, telling time, and temporal expressions in Moroccan Arabic.' },
  nature: { title: 'Nature & Weather in Darija', description: 'Mountains, desert, sea, forests, weather — the natural vocabulary of Morocco\'s diverse landscapes.' },
  culture: { title: 'Moroccan Culture Words in Darija', description: 'Hshuma, niya, mktub, baraka — the untranslatable cultural concepts that define Moroccan society.' },
  slang: { title: 'Moroccan Street Slang', description: 'The Darija nobody teaches you in class — street expressions, youth slang, and the words that make Moroccans laugh.' },
  health: { title: 'Health & Body in Darija', description: 'Medical vocabulary, body parts, pharmacy phrases, and how to describe symptoms in Moroccan Arabic.' },
  money: { title: 'Money & Banking in Darija', description: 'Dirhams, ryals, change, tips, ATMs — the financial vocabulary of daily Moroccan transactions.' },
  directions: { title: 'Directions in Darija', description: 'Left, right, straight, near, far — navigate Moroccan cities and medinas in Darija.' },
  crafts: { title: 'Crafts & Materials in Darija', description: 'Zellige, tadelakt, leather, pottery — the vocabulary of Morocco\'s living artisan traditions.' },
  clothing: { title: 'Clothing in Darija', description: 'Djellaba, caftan, babouche, hijab — Moroccan wardrobe vocabulary with cultural context.' },
  colors: { title: 'Colors in Darija', description: 'Every color in Moroccan Arabic — red city, blue city, white city, and the palette of Morocco.' },
  music: { title: 'Music & Performance in Darija', description: 'Gnawa, chaabi, andalusi, rai — Morocco\'s musical traditions in Darija.' },
  animals: { title: 'Animals in Darija', description: 'From camels to cats, the animal vocabulary of Morocco in Darija.' },
  education: { title: 'Education & Learning in Darija', description: 'School, university, learning phrases — the vocabulary of education in Moroccan Arabic.' },
  work: { title: 'Work & Professions in Darija', description: 'Jobs, trades, workplace vocabulary in Moroccan Arabic.' },
  technology: { title: 'Technology in Darija', description: 'WiFi, WhatsApp, phones — modern tech vocabulary in Moroccan Arabic.' },
  pronouns: { title: 'Pronouns & Grammar in Darija', description: 'Personal pronouns, possessives, demonstratives, and grammatical particles in Moroccan Arabic.' },
  architecture: { title: 'Architecture in Darija', description: 'Riad, kasbah, minaret, medina — the architectural vocabulary of Morocco.' },
  blessings: { title: 'Blessings & Prayers in Darija', description: 'The blessings Moroccans use daily — for health, travel, family, and every occasion.' },
  compliments: { title: 'Compliments in Darija', description: 'How to praise food, beauty, intelligence, and character in Moroccan Arabic.' },
  emergency: { title: 'Emergency Phrases in Darija', description: 'Police, hospital, fire, theft — the emergency vocabulary you hope you never need.' },
  adjectives: { title: 'Adjectives in Darija', description: 'Big, small, hot, cold, beautiful, delicious — essential descriptive words in Moroccan Arabic.' },
  sports: { title: 'Sports in Darija', description: 'Football, surfing, athletics, and the sporting vocabulary of Morocco.' },
};

export async function generateStaticParams() {
  const categories = await getWordCategories();
  return categories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = CATEGORY_META[params.slug];
  const name = meta?.title || `${params.slug} — Darija Words`;
  return {
    title: name,
    description: meta?.description || `Browse Darija words in the ${params.slug} category.`,
    openGraph: { title: name, description: meta?.description },
    alternates: { canonical: `https://dharija.space/category/${params.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const words = await getWordsByCategory(params.slug);
  const categories = await getWordCategories();
  const current = categories.find(c => c.id === params.slug);
  const meta = CATEGORY_META[params.slug];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: meta?.title || `Darija ${params.slug} vocabulary`,
    description: meta?.description,
    inLanguage: ['ar', 'en', 'fr'],
    hasDefinedTerm: words.slice(0, 50).map(w => ({
      '@type': 'DefinedTerm',
      name: w.darija,
      description: w.english,
      inDefinedTermSet: meta?.title,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryClient
        words={words}
        categories={categories}
        currentSlug={params.slug}
        currentName={current?.name || params.slug}
        description={meta?.description || ''}
      />
    </>
  );
}
