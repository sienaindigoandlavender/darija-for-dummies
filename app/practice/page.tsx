import type { Metadata } from 'next';
import PracticeClient from './PracticeClient';

export const metadata: Metadata = {
  title: 'Practice Darija — Flashcards with Spaced Repetition',
  description: 'Learn Moroccan Arabic with flashcards powered by 8,500+ words. Spaced repetition, cultural notes, and category-based decks. Free.',
  openGraph: {
    title: 'Practice Darija — Flashcards',
    description: 'Flashcards with spaced repetition built on the largest Darija dictionary online. Pick a deck, flip cards, learn.',
  },
};

export default function PracticePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Darija Flashcard Practice',
    description: 'Spaced repetition flashcards for learning Moroccan Arabic (Darija).',
    provider: { '@type': 'Organization', name: 'Dancing with Lions' },
    inLanguage: ['ar', 'en', 'fr'],
    isAccessibleForFree: true,
    learningResourceType: 'Flashcard',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PracticeClient />
    </>
  );
}
