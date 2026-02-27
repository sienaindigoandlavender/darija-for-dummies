import { getPhraseById, getAllPhrases, getPhrasesByCategory } from '@/lib/dictionary';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://dharija.space';

const CATEGORY_LABELS: Record<string, string> = {
  survival: 'Survival Kit', souk: 'In the Souk', taxi: 'Taxi Talk', cafe: 'Café Culture',
  riad: 'Riad Life', restaurant: 'Eating Out', pharmacy: 'At the Pharmacy',
  compliments: 'Compliments', arguments: 'Arguments', proverbs: 'Proverbs & Wisdom',
  blessings: 'Blessings', daily: 'Daily Life', emergency: 'Emergency',
  hammam: 'Hammam Guide', medina: 'Medina Life', desert: 'Desert Adventures',
  love: 'Love & Romance', ramadan: 'Ramadan', wedding: 'Weddings',
  football: 'Football', family: 'Family', family_life: 'Family Life',
  weather: 'Weather', cooking: 'Cooking', atlas: 'Atlas Mountains',
  beach: 'Beach & Coast', phone: 'Phone & Tech', work: 'Work & Business',
  nightlife: 'Nightlife', health: 'Health', transport: 'Transport',
  photography: 'Photography', festivals: 'Festivals', garden: 'Gardens & Nature',
};

export async function generateStaticParams() {
  const phrases = await getAllPhrases();
  return phrases.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const phrase = await getPhraseById(id);
  if (!phrase) return { title: 'Phrase Not Found' };

  const title = `"${phrase.english}" in Moroccan Arabic — ${phrase.darija}`;
  const description = `How to say "${phrase.english}" in Darija: ${phrase.darija} (${phrase.arabic}). Pronounced /${phrase.pronunciation}/. ${phrase.french ? `French: ${phrase.french}.` : ''} ${phrase.cultural_note ? phrase.cultural_note.slice(0, 100) : ''}`.trim();

  return {
    title,
    description,
    openGraph: {
      title: `${phrase.darija} — ${phrase.english} | Darija Phrase`,
      description,
      url: `${SITE_URL}/phrase/${id}`,
      siteName: 'Everyday Darija',
    },
    alternates: { canonical: `${SITE_URL}/phrase/${id}` },
  };
}

export default async function PhrasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const phrase = await getPhraseById(id);
  if (!phrase) notFound();

  // Get related phrases from same category
  const categoryPhrases = await getPhrasesByCategory(phrase.category);
  const related = categoryPhrases.filter(p => p.id !== phrase.id).slice(0, 6);

  const categoryLabel = CATEGORY_LABELS[phrase.category] || phrase.category;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: phrase.darija,
    alternateName: phrase.arabic,
    description: phrase.english,
    inLanguage: 'ar',
    url: `${SITE_URL}/phrase/${phrase.id}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Everyday Darija Phrase Book',
      url: SITE_URL,
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'pronunciation', value: phrase.pronunciation },
      { '@type': 'PropertyValue', name: 'french', value: phrase.french },
      { '@type': 'PropertyValue', name: 'category', value: phrase.category },
      { '@type': 'PropertyValue', name: 'register', value: phrase.register },
      ...(phrase.literal_translation ? [{ '@type': 'PropertyValue', name: 'literal_translation', value: phrase.literal_translation }] : []),
      ...(phrase.cultural_note ? [{ '@type': 'PropertyValue', name: 'cultural_note', value: phrase.cultural_note }] : []),
    ],
    // FAQPage for rich results
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do you say "${phrase.english}" in Moroccan Arabic?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `"${phrase.english}" in Moroccan Arabic (Darija) is "${phrase.darija}" (${phrase.arabic}), pronounced /${phrase.pronunciation}/.${phrase.french ? ` In French: "${phrase.french}".` : ''}${phrase.cultural_note ? ` ${phrase.cultural_note}` : ''}`,
        },
      },
      ...(phrase.response ? [{
        '@type': 'Question',
        name: `What is the typical response to "${phrase.darija}" in Darija?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The typical response is "${phrase.response.darija}" (${phrase.response.arabic}), which means "${phrase.response.english}".`,
        },
      }] : []),
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-10">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Dictionary</Link>
          <span>/</span>
          <Link href="/practice" className="hover:text-neutral-900 transition-colors">Phrases</Link>
          <span>/</span>
          <span className="text-neutral-700">{categoryLabel}</span>
        </div>

        {/* Main phrase */}
        <article>
          {/* Arabic script — large */}
          <p className="text-5xl md:text-6xl font-light text-neutral-900 mb-4 leading-tight" dir="rtl" lang="ar">
            {phrase.arabic}
          </p>

          {/* Darija transliteration */}
          <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-2">
            {phrase.darija}
          </h1>

          {/* Pronunciation */}
          <p className="text-lg text-neutral-500 mb-8 font-mono">
            /{phrase.pronunciation}/
          </p>

          {/* Translations */}
          <div className="space-y-3 mb-8">
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide w-12 shrink-0">EN</span>
              <span className="text-lg text-neutral-900">{phrase.english}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide w-12 shrink-0">FR</span>
              <span className="text-lg text-neutral-700">{phrase.french}</span>
            </div>
            {phrase.literal_translation && (
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide w-12 shrink-0">LIT</span>
                <span className="text-lg text-neutral-500 italic">{phrase.literal_translation}</span>
              </div>
            )}
          </div>

          {/* Metadata pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 text-xs rounded-full bg-neutral-100 text-neutral-600">
              {categoryLabel}
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-neutral-100 text-neutral-600">
              {phrase.register}
            </span>
            {phrase.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 text-xs rounded-full bg-neutral-50 text-neutral-500">
                {tag}
              </span>
            ))}
          </div>

          {/* Response */}
          {phrase.response && (
            <div className="border-l-2 border-neutral-200 pl-6 mb-8">
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">Typical Response</p>
              <p className="text-xl text-neutral-900 mb-1" dir="rtl" lang="ar">{phrase.response.arabic}</p>
              <p className="text-lg text-neutral-700 mb-1">{phrase.response.darija}</p>
              <p className="text-neutral-500">{phrase.response.english}</p>
            </div>
          )}

          {/* Cultural note */}
          {phrase.cultural_note && (
            <div className="bg-neutral-50 rounded-lg p-6 mb-8">
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">Cultural Note</p>
              <p className="text-neutral-700 leading-relaxed">{phrase.cultural_note}</p>
            </div>
          )}
        </article>

        {/* Related phrases */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-neutral-100">
            <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-6">
              More {categoryLabel} Phrases
            </h2>
            <div className="space-y-4">
              {related.map(rp => (
                <Link
                  key={rp.id}
                  href={`/phrase/${rp.id}`}
                  className="block group"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <span className="text-neutral-900 group-hover:text-neutral-600 transition-colors font-medium">
                        {rp.darija}
                      </span>
                      <span className="text-neutral-400 mx-2">—</span>
                      <span className="text-neutral-600">{rp.english}</span>
                    </div>
                    <span className="text-neutral-300 text-sm shrink-0" dir="rtl">{rp.arabic}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cross-links */}
        <footer className="mt-12 pt-8 border-t border-neutral-100 text-sm text-neutral-500">
          <p>
            From <Link href="/" className="text-neutral-900 hover:underline">Everyday Darija</Link> — 10,000+ words and 1,500+ phrases in Moroccan Arabic.
            A <a href="https://dancingwiththelions.com" className="text-neutral-900 hover:underline">Dancing with Lions</a> publication.
          </p>
        </footer>
      </div>
    </div>
  );
}
