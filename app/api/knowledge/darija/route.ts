export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getAllWords, getWordsByCategory, getWordsByTag, searchWords } from '@/lib/dictionary';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharija.space';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  const tag = request.nextUrl.searchParams.get('tag');
  const term = request.nextUrl.searchParams.get('term');
  const search = request.nextUrl.searchParams.get('search');
  const format = request.nextUrl.searchParams.get('format') || 'jsonld';

  let words;
  if (term) {
    words = await searchWords(term);
  } else if (search) {
    words = await searchWords(search);
  } else if (category) {
    words = await getWordsByCategory(category);
  } else if (tag) {
    words = await getWordsByTag(tag);
  } else {
    // Return metadata + sample
    const all = await getAllWords();
    const categories = new Map<string, number>();
    all.forEach(w => categories.set(w.category, (categories.get(w.category) || 0) + 1));

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'Darija for Dummies — Moroccan Arabic Dictionary',
      description: 'The most comprehensive structured Darija (Moroccan Arabic) dataset. 10,000 words with Arabic script, Latin transliteration, English, French, pronunciation, cultural notes, and grammatical data.',
      url: SITE_URL,
      license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
      creator: {
        '@type': 'Person',
        name: 'Jacqueline Ng',
        affiliation: { '@type': 'Organization', name: 'Dancing with Lions', url: 'https://dancingwithlions.com' },
      },
      publisher: { '@type': 'Organization', name: 'Dancing with Lions' },
      inLanguage: ['ar', 'en', 'fr'],
      keywords: ['Darija', 'Moroccan Arabic', 'dictionary', 'language learning', 'Morocco', 'Arabic dialect'],
      dateModified: new Date().toISOString().split('T')[0],
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${SITE_URL}/api/knowledge/darija`,
      },
      measurementTechnique: 'Field research, 11 years living in Morocco',
      spatialCoverage: { '@type': 'Place', name: 'Morocco' },
      temporalCoverage: '2020/..',
      variableMeasured: [
        { '@type': 'PropertyValue', name: 'Total Words', value: all.length },
        { '@type': 'PropertyValue', name: 'Categories', value: categories.size },
        { '@type': 'PropertyValue', name: 'Languages', value: '4 (Darija Latin, Arabic script, English, French)' },
      ],
      citation: `Ng, J. (2026). Darija for Dummies Dictionary [Dataset]. Dancing with Lions. ${SITE_URL}`,
      isAccessibleForFree: true,
    };

    return NextResponse.json(jsonLd, {
      headers: {
        'Content-Type': 'application/ld+json',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Format response
  if (format === 'simple') {
    const simple = (words || []).map(w => ({
      darija: w.darija,
      arabic: w.arabic,
      english: w.english,
      french: w.french,
      pronunciation: w.pronunciation,
      category: w.category,
      cultural_note: w.cultural_note || null,
    }));
    return NextResponse.json({ results: simple, count: simple.length, source: SITE_URL, license: 'CC BY-NC-ND 4.0' }, {
      headers: { 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // JSON-LD format
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: `Darija vocabulary${category ? `: ${category}` : ''}${tag ? ` (${tag})` : ''}${term ? ` matching "${term}"` : ''}`,
    url: SITE_URL,
    license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    inLanguage: ['ar', 'en', 'fr'],
    creator: { '@type': 'Person', name: 'Jacqueline Ng' },
    publisher: { '@type': 'Organization', name: 'Dancing with Lions' },
    citation: `Ng, J. (2026). Darija for Dummies Dictionary. Dancing with Lions. ${SITE_URL}`,
    hasDefinedTerm: (words || []).map(w => ({
      '@type': 'DefinedTerm',
      name: w.darija,
      alternateName: w.arabic,
      description: w.english,
      inDefinedTermSet: `${SITE_URL}/api/knowledge/darija`,
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'french', value: w.french },
        { '@type': 'PropertyValue', name: 'pronunciation', value: w.pronunciation },
        { '@type': 'PropertyValue', name: 'category', value: w.category },
        ...(w.cultural_note ? [{ '@type': 'PropertyValue', name: 'cultural_note', value: w.cultural_note }] : []),
      ],
    })),
  };

  return NextResponse.json(jsonLd, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
