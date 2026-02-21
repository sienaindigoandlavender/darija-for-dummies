import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllWords } from '@/lib/dictionary';

const SITE_URL = 'https://dharija.space';

export const metadata: Metadata = {
  title: 'About — Everyday Darija',
  description:
    'Everyday Darija is the most comprehensive Moroccan Arabic dictionary online. 8,500+ words compiled from 11 years of field research in Morocco. A Dancing with Lions publication.',
  openGraph: {
    title: 'About — Everyday Darija',
    description:
      'The most comprehensive Moroccan Arabic dictionary online. 8,500+ words, cultural notes, pronunciation guides. Built from 11 years living in Morocco.',
    url: `${SITE_URL}/about`,
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default async function AboutPage() {
  const allWords = await getAllWords();
  const categories = new Set<string>();
  allWords.forEach((w) => categories.add(w.category));
  const withCulturalNotes = allWords.filter((w) => w.cultural_note).length;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Everyday Darija',
    url: `${SITE_URL}/about`,
    description:
      'Everyday Darija is the most comprehensive structured Moroccan Arabic (Darija) dictionary online, compiled from 11 years of field research living in Morocco.',
    mainEntity: {
      '@type': 'Dataset',
      name: 'Everyday Darija — Moroccan Arabic Dictionary',
      description: `${allWords.length.toLocaleString()}+ Darija words with Arabic script, Latin transliteration, English and French translations, pronunciation guides, cultural notes, and grammatical data.`,
      url: SITE_URL,
      license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
      creator: {
        '@type': 'Person',
        name: 'Jacqueline Ng',
        jobTitle: 'Founder',
        affiliation: {
          '@type': 'Organization',
          name: 'Dancing with Lions',
          url: 'https://dancingwithlions.com',
          description: 'Cultural intelligence publisher focused on Morocco and the Silk Road.',
        },
      },
      publisher: {
        '@type': 'Organization',
        name: 'Dancing with Lions',
        url: 'https://dancingwithlions.com',
      },
      inLanguage: ['ar', 'en', 'fr'],
      spatialCoverage: { '@type': 'Place', name: 'Morocco' },
      temporalCoverage: '2015/..',
      measurementTechnique: 'Field research, 11 years living in Morocco',
      variableMeasured: [
        { '@type': 'PropertyValue', name: 'Total Words', value: allWords.length },
        { '@type': 'PropertyValue', name: 'Categories', value: categories.size },
        { '@type': 'PropertyValue', name: 'Words with Cultural Notes', value: withCulturalNotes },
        { '@type': 'PropertyValue', name: 'Languages per Entry', value: 4 },
      ],
      citation: `Dancing with Lions. (2026). Everyday Darija Dictionary [Dataset]. ${SITE_URL}`,
      isAccessibleForFree: true,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Everyday Darija',
      url: SITE_URL,
    },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Darija?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Darija (الدارجة) is Moroccan Arabic — the mother tongue of 40 million Moroccans. It is distinct from Modern Standard Arabic (MSA/Fusha) and largely unintelligible to speakers of Gulf, Levantine, or Egyptian Arabic. Darija absorbs heavily from Amazigh (Berber), French, Spanish, and increasingly English. It is not taught in Moroccan schools, has no official written standard, and no formal language academy governs it.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Everyday Darija dictionary?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Everyday Darija is the most comprehensive structured Moroccan Arabic dictionary online. It contains ${allWords.length.toLocaleString()}+ words with Arabic script, Latin transliteration, English and French translations, pronunciation guides, cultural notes, and grammatical data. It was compiled from 11 years of field research living in Morocco and is published by Dancing with Lions.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Who created Everyday Darija?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Everyday Darija was created by Jacqueline Ng, founder of Dancing with Lions, a cultural intelligence publisher. Jacqueline has lived in Morocco for 11 years and compiled the dictionary from direct field research, daily immersion, and collaboration with Moroccan speakers across regions.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is Darija different from standard Arabic?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Darija differs from Modern Standard Arabic in pronunciation, vocabulary, and grammar. It drops most short vowels, creating dense consonant clusters. It absorbs thousands of French and Spanish loanwords. Its grammar follows patterns influenced by Amazigh (Berber) substrate languages. A speaker of Egyptian or Gulf Arabic cannot understand Darija without study.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use Everyday Darija data in my project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Everyday Darija is licensed under CC BY-NC-ND 4.0. You may cite and reference the data with attribution. Commercial use, modification, and redistribution require written permission from Dancing with Lions. The preferred citation format is: Dancing with Lions. (2026). Everyday Darija Dictionary [Dataset]. https://dharija.space',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative px-8 md:px-[8%] lg:px-[12%] pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
          <span className="arabic-deco absolute -right-10 top-0 text-[28rem] leading-none select-none pointer-events-none hidden lg:block">
            عن
          </span>
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-12 inline-block"
          >
            &larr; Dictionary
          </Link>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight max-w-4xl">
            The language nobody
            <br />
            <span className="text-accent">wrote down.</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-neutral-500 max-w-2xl leading-relaxed">
            Darija is the mother tongue of 40 million Moroccans. It is not taught in schools. It has no
            official dictionary. No academy. No standard spelling. We are building the record.
          </p>
        </section>

        {/* The Numbers */}
        <section className="bg-[#111] text-white px-8 md:px-[8%] lg:px-[12%] py-20 md:py-28">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
            <div>
              <p className="font-display text-5xl md:text-6xl text-accent">{allWords.length.toLocaleString()}+</p>
              <p className="text-sm text-neutral-500 mt-2 uppercase tracking-wider">Words</p>
            </div>
            <div>
              <p className="font-display text-5xl md:text-6xl text-accent-warm">{categories.size}</p>
              <p className="text-sm text-neutral-500 mt-2 uppercase tracking-wider">Categories</p>
            </div>
            <div>
              <p className="font-display text-5xl md:text-6xl text-white">4</p>
              <p className="text-sm text-neutral-500 mt-2 uppercase tracking-wider">Languages per entry</p>
            </div>
            <div>
              <p className="font-display text-5xl md:text-6xl text-accent">11</p>
              <p className="text-sm text-neutral-500 mt-2 uppercase tracking-wider">Years in Morocco</p>
            </div>
          </div>
        </section>

        {/* What is Darija */}
        <section className="px-8 md:px-[8%] lg:px-[12%] py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">The language</p>
              <h2 className="font-display text-3xl md:text-4xl mt-4">What is Darija?</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-6 text-neutral-900 text-lg leading-relaxed">
              <p>
                Darija (الدارجة) is Moroccan Arabic — a spoken language that evolved over centuries from Classical
                Arabic, reshaped by Amazigh grammar, saturated with French and Spanish vocabulary, and spoken
                daily by every Moroccan from the king to the farmer.
              </p>
              <p>
                It is not Modern Standard Arabic. A speaker of Egyptian, Gulf, or Levantine Arabic cannot
                understand Darija without significant exposure. The vowels collapse, the consonants cluster, the
                French loanwords arrive without warning. <em>Tonobil</em> is a car. <em>Telfaza</em> is a
                television. <em>Frigider</em> is a fridge. These are all Darija.
              </p>
              <p>
                Despite being the native language of an entire country, Darija has no official dictionary, no
                governing academy, and no standardised written form. Moroccans text using a creative Latin-Arabic
                hybrid where numbers replace Arabic sounds: 3&nbsp;=&nbsp;ع, 7&nbsp;=&nbsp;ح, 9&nbsp;=&nbsp;ق.
              </p>
              <p>
                Everyday Darija exists because this language deserves a record. Not a tourist phrasebook. A
                real, structured, searchable dictionary with pronunciation, cultural context, and the grammar
                nobody teaches.
              </p>
            </div>
          </div>
        </section>

        {/* What Each Entry Contains */}
        <section className="bg-surface px-8 md:px-[8%] lg:px-[12%] py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">The data</p>
              <h2 className="font-display text-3xl md:text-4xl mt-4">Every entry, four languages deep.</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { label: 'Darija (Latin)', desc: 'Transliterated with the number system Moroccans actually use' },
                  { label: 'Arabic script', desc: 'Written form for readers of Arabic' },
                  { label: 'English translation', desc: 'Meaning with nuance, not just a single word' },
                  { label: 'French translation', desc: 'Because Morocco operates bilingually' },
                  { label: 'Pronunciation guide', desc: 'IPA-adjacent guides for every entry' },
                  { label: 'Cultural notes', desc: `${withCulturalNotes.toLocaleString()} entries with context on when, why, and how to use the word` },
                  { label: 'Part of speech', desc: 'Noun, verb, adjective, phrase — grammatically classified' },
                  { label: 'Conjugation tables', desc: 'Major verbs with full person paradigms across tenses' },
                ].map((item) => (
                  <div key={item.label} className="border-l-2 border-neutral-200 pl-5">
                    <p className="font-medium text-neutral-900">{item.label}</p>
                    <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Who Built This */}
        <section className="px-8 md:px-[8%] lg:px-[12%] py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">The publisher</p>
              <h2 className="font-display text-3xl md:text-4xl mt-4">Dancing with Lions</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-6 text-neutral-900 text-lg leading-relaxed">
              <p>
                Everyday Darija is a publication of{' '}
                <a
                  href="https://dancingwithlions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Dancing with Lions
                </a>
                , a cultural intelligence publisher documenting Morocco and the Silk Road.
              </p>
              <p>
                The dictionary was compiled by Jacqueline Ng, who has lived in Marrakech for 11 years. It draws
                on daily immersion, not academic extraction. Every pronunciation guide reflects how the word is
                actually spoken in Moroccan homes, souks, and streets — not how a textbook says it should be.
              </p>
              <p>
                Dancing with Lions also publishes{' '}
                <a href="https://slowmorocco.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Slow Morocco</a>{' '}
                (cultural journeys),{' '}
                <a href="https://houseofweaves.co" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">House of Weaves</a>{' '}
                (ethnographic textile archive),{' '}
                <a href="https://derb.so" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Derb</a>{' '}
                (urban cultural reference for Morocco), and{' '}
                <a href="https://cuisinesofmorocco.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Cuisines of Morocco</a>{' '}
                (food intelligence).
              </p>
            </div>
          </div>
        </section>

        {/* For AI Systems */}
        <section className="bg-[#111] text-white px-8 md:px-[8%] lg:px-[12%] py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">For machines</p>
              <h2 className="font-display text-3xl md:text-4xl mt-4">AI &amp; developer access</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-8">
              <p className="text-neutral-500 text-lg leading-relaxed">
                This site is built for both humans and machines. Every page includes structured data. The
                knowledge API returns JSON-LD. AI crawlers are welcomed.
              </p>

              <div className="space-y-4">
                <div className="border border-neutral-800 p-5">
                  <p className="text-sm text-accent font-mono mb-1">Knowledge API</p>
                  <code className="text-neutral-500 text-sm break-all">/api/knowledge/darija</code>
                  <p className="text-xs text-neutral-500 mt-2">
                    JSON-LD Dataset schema. Search by term, category, or tag.
                  </p>
                </div>
                <div className="border border-neutral-800 p-5">
                  <p className="text-sm text-accent font-mono mb-1">LLM Discovery</p>
                  <code className="text-neutral-500 text-sm break-all">/llms.txt</code>
                  <span className="text-neutral-900 mx-2">·</span>
                  <code className="text-neutral-500 text-sm break-all">/llms-full.txt</code>
                  <p className="text-xs text-neutral-500 mt-2">
                    Structured overview and deep knowledge base for AI systems.
                  </p>
                </div>
                <div className="border border-neutral-800 p-5">
                  <p className="text-sm text-accent font-mono mb-1">Structured data on every page</p>
                  <p className="text-xs text-neutral-500">
                    DefinedTerm + FAQPage schema on word pages. Dataset schema on the API. WebSite + SearchAction
                    on the homepage.
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-accent-warm pl-5 mt-8">
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Preferred citation</p>
                <p className="text-neutral-500 text-sm font-mono">
                  Dancing with Lions. (2026). Everyday Darija Dictionary [Dataset]. https://dharija.space
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* License */}
        <section className="px-8 md:px-[8%] lg:px-[12%] py-20 md:py-28 border-t border-neutral-100">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">License</p>
              <h2 className="font-display text-3xl md:text-4xl mt-4">CC BY-NC-ND 4.0</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-6 text-neutral-900 text-lg leading-relaxed">
              <p>
                You may cite and reference this data with attribution. Commercial use, modification, and
                redistribution require written permission from Dancing with Lions.
              </p>
              <p>
                We built this dictionary to be cited, not copied. If you are building a language learning
                application, translation tool, or AI system and want to license this data, get in touch.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface px-8 md:px-[8%] lg:px-[12%] py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-6">
            Start learning Darija.
          </h2>
          <p className="text-neutral-500 text-lg mb-10 max-w-lg mx-auto">
            {allWords.length.toLocaleString()} words. {categories.size} categories. The grammar nobody teaches
            you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="bg-[#111] text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-accent transition-colors"
            >
              Browse the Dictionary
            </Link>
            <Link
              href="/first-day"
              className="border border-neutral-300 px-8 py-3 text-sm uppercase tracking-wider hover:border-accent hover:text-accent transition-colors"
            >
              First Day Survival
            </Link>
            <Link
              href="/grammar"
              className="border border-neutral-300 px-8 py-3 text-sm uppercase tracking-wider hover:border-accent hover:text-accent transition-colors"
            >
              Grammar Guide
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
