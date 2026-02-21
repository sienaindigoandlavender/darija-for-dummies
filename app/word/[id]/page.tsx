import { getWordById, getAllWords } from '@/lib/dictionary';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  // Generate pages for all words at build time
  const words = await getAllWords();
  return words.map(w => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const word = await getWordById(params.id);
  if (!word) return { title: 'Word Not Found' };

  const title = `${word.darija} (${word.arabic}) — ${word.english} in Darija`;
  const description = `How to say "${word.english}" in Moroccan Arabic: ${word.darija} (${word.arabic}). Pronounced /${word.pronunciation}/. ${word.french ? `French: ${word.french}.` : ''} ${word.cultural_note ? word.cultural_note.slice(0, 120) : ''}`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `https://dharija.space/word/${params.id}` },
  };
}

export default async function WordPage({ params }: { params: { id: string } }) {
  const word = await getWordById(params.id);
  if (!word) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.darija,
    alternateName: word.arabic,
    description: word.english,
    inLanguage: 'ar',
    url: `https://dharija.space/word/${word.id}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Everyday Darija Dictionary',
      url: 'https://dharija.space',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'pronunciation', value: word.pronunciation },
      { '@type': 'PropertyValue', name: 'french', value: word.french },
      { '@type': 'PropertyValue', name: 'category', value: word.category },
      { '@type': 'PropertyValue', name: 'part_of_speech', value: word.part_of_speech },
      ...(word.gender ? [{ '@type': 'PropertyValue', name: 'gender', value: word.gender }] : []),
      ...(word.cultural_note ? [{ '@type': 'PropertyValue', name: 'cultural_note', value: word.cultural_note }] : []),
    ],
  };

  // Also add FAQ schema for "how do you say X in Darija"
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: `How do you say "${word.english}" in Moroccan Arabic (Darija)?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `In Darija (Moroccan Arabic), "${word.english}" is "${word.darija}" (${word.arabic}), pronounced /${word.pronunciation}/.${word.french ? ` In French: ${word.french}.` : ''}${word.cultural_note ? ` ${word.cultural_note}` : ''}`,
      },
    }],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen">
        <section className="px-8 md:px-[8%] lg:px-[12%] pt-20 pb-8">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 inline-block">&larr; Dictionary</Link>
          {word.category && (
            <Link href={`/category/${word.category}`} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 inline-block ml-4">
              {word.category}
            </Link>
          )}
        </section>

        <section className="px-8 md:px-[8%] lg:px-[12%] pb-20">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            {/* Left: The word */}
            <div className="md:col-span-6">
              <span className="font-arabic text-6xl md:text-7xl lg:text-8xl text-[#c53a1a] block leading-tight mb-4">{word.arabic}</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">{word.darija}</h1>
              <p className="text-neutral-500 text-lg mb-2">/{word.pronunciation}/</p>
              <div className="flex items-baseline gap-3 mt-6">
                <p className="text-neutral-900 text-2xl">{word.english}</p>
              </div>
              <p className="text-neutral-500 mt-2">{word.french}</p>

              <div className="flex flex-wrap gap-3 mt-8">
                {word.part_of_speech && (
                  <span className="text-xs uppercase tracking-wider text-neutral-500 border border-neutral-200 px-3 py-1">
                    {word.part_of_speech}
                  </span>
                )}
                {word.gender && (
                  <span className="text-xs uppercase tracking-wider text-neutral-500 border border-neutral-200 px-3 py-1">
                    {word.gender}
                  </span>
                )}
                {word.register !== 'universal' && word.register && (
                  <span className="text-xs uppercase tracking-wider text-neutral-500 border border-neutral-200 px-3 py-1">
                    {word.register}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Context */}
            <div className="md:col-span-5 md:col-start-8 flex flex-col gap-10">
              {word.cultural_note && (
                <div className="border-l-2 border-[#d4931a] pl-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-3">Cultural note</p>
                  <p className="text-neutral-900 leading-relaxed text-lg">{word.cultural_note}</p>
                </div>
              )}

              {word.examples?.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">In use</p>
                  {word.examples.map((ex: { arabic: string; darija: string; english: string }, i: number) => (
                    <div key={i} className="space-y-1 mb-5">
                      <p className="font-arabic text-xl text-black">{ex.arabic}</p>
                      <p className="text-neutral-900">{ex.darija}</p>
                      <p className="text-sm text-neutral-500">{ex.english}</p>
                    </div>
                  ))}
                </div>
              )}

              {word.conjugation?.past && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Conjugation</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {Object.entries(word.conjugation.past).map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <span className="text-neutral-500 w-12">{k}</span>
                        <span className="text-neutral-900">{v as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEO text block - hidden from users but visible to crawlers */}
        <section className="px-8 md:px-[8%] lg:px-[12%] py-16 border-t border-neutral-100">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl mb-4">How to say &ldquo;{word.english}&rdquo; in Moroccan Arabic</h2>
            <p className="text-neutral-900 leading-relaxed">
              In Darija (Moroccan Arabic), &ldquo;{word.english}&rdquo; is <strong>{word.darija}</strong> ({word.arabic}),
              pronounced /{word.pronunciation}/. {word.french ? `The French equivalent is "${word.french}."` : ''}
              {word.cultural_note ? ` ${word.cultural_note}` : ''}
              {' '}This term falls under the {word.category} category in Everyday Darija, the most comprehensive Moroccan Arabic dictionary online.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
