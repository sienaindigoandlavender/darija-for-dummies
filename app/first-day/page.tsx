import { getWordsByTag } from '@/lib/dictionary';
import type { Metadata } from 'next';
import FirstDayClient from './FirstDayClient';

export const metadata: Metadata = {
  title: 'Your First Day in Morocco — Essential Darija Survival Kit',
  description: 'The 80+ Darija words and phrases you need before landing in Morocco. Greetings, directions, food, numbers, bargaining, and emergency phrases — all with pronunciation.',
  alternates: { canonical: 'https://dharija.space/first-day' },
  openGraph: {
    title: 'First Day Darija — Morocco Survival Kit',
    description: '80+ essential Moroccan Arabic words with pronunciation, Arabic script, and cultural notes. Learn before you land.',
  },
};

export default async function FirstDayPage() {
  const words = await getWordsByTag('first-day');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'First Day Darija — Morocco Survival Kit',
    description: 'Essential Moroccan Arabic words and phrases for your first day in Morocco.',
    provider: { '@type': 'Organization', name: 'Dancing with Lions', url: 'https://dancingwiththelions.com' },
    inLanguage: ['ar', 'en', 'fr'],
    teaches: 'Moroccan Arabic (Darija) survival vocabulary',
    numberOfCredits: 0,
    isAccessibleForFree: true,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FirstDayClient words={words} />
    </>
  );
}
