import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Say — Common Phrases in Moroccan Arabic (Darija)',
  description: 'How to say thank you, hello, goodbye, how much, please, and 50+ more phrases in Moroccan Arabic. Darija translations with pronunciation and cultural notes.',
};

const TERMS = [
  { slug: 'hello', label: 'Hello' },
  { slug: 'thank-you', label: 'Thank You' },
  { slug: 'goodbye', label: 'Goodbye' },
  { slug: 'how-are-you', label: 'How Are You' },
  { slug: 'please', label: 'Please' },
  { slug: 'sorry', label: 'Sorry' },
  { slug: 'yes', label: 'Yes' },
  { slug: 'no', label: 'No' },
  { slug: 'how-much', label: 'How Much' },
  { slug: 'water', label: 'Water' },
  { slug: 'tea', label: 'Tea' },
  { slug: 'coffee', label: 'Coffee' },
  { slug: 'bread', label: 'Bread' },
  { slug: 'delicious', label: 'Delicious' },
  { slug: 'beautiful', label: 'Beautiful' },
  { slug: 'love', label: 'I Love You' },
  { slug: 'where', label: 'Where' },
  { slug: 'bathroom', label: 'Bathroom' },
  { slug: 'taxi', label: 'Taxi' },
  { slug: 'money', label: 'Money' },
  { slug: 'food', label: 'Food' },
  { slug: 'good', label: 'Good' },
  { slug: 'bad', label: 'Bad' },
  { slug: 'big', label: 'Big' },
  { slug: 'small', label: 'Small' },
  { slug: 'hot', label: 'Hot' },
  { slug: 'cold', label: 'Cold' },
  { slug: 'i-dont-understand', label: "I Don't Understand" },
  { slug: 'i-dont-speak-arabic', label: "I Don't Speak Arabic" },
  { slug: 'my-name-is', label: 'My Name Is' },
  { slug: 'friend', label: 'Friend' },
  { slug: 'family', label: 'Family' },
  { slug: 'mother', label: 'Mother' },
  { slug: 'father', label: 'Father' },
  { slug: 'house', label: 'House' },
  { slug: 'market', label: 'Market' },
  { slug: 'expensive', label: 'Expensive' },
  { slug: 'cheap', label: 'Cheap' },
  { slug: 'doctor', label: 'Doctor' },
  { slug: 'help', label: 'Help' },
  { slug: 'eat', label: 'Eat' },
  { slug: 'drink', label: 'Drink' },
  { slug: 'go', label: 'Go' },
  { slug: 'come', label: 'Come' },
  { slug: 'want', label: 'I Want' },
  { slug: 'i-like', label: 'I Like' },
  { slug: 'god-willing', label: 'Inshallah' },
  { slug: 'welcome', label: 'Welcome' },
  { slug: 'lets-go', label: "Let's Go" },
  { slug: 'enough', label: 'Enough' },
];

export default function HowToSayIndex() {
  return (
    <div className="min-h-screen">
      <section className="px-8 md:px-[8%] lg:px-[12%] pt-20 pb-12">
        <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-8 inline-block">&larr; Back to Dictionary</Link>
        <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Phrase Guide</p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-6">How to say<br /><em>anything</em> in Darija</h1>
        <p className="text-neutral-500 text-lg max-w-2xl leading-relaxed">50 essential phrases translated into Moroccan Arabic with pronunciation, cultural notes, and the context nobody else gives you.</p>
      </section>

      <section className="px-8 md:px-[8%] lg:px-[12%] py-12 border-t border-neutral-100">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-1">
          {TERMS.map(t => (
            <Link key={t.slug} href={`/how-to-say/${t.slug}`}
              className="py-3 text-neutral-600 hover:text-[#c53a1a] transition-colors border-b border-neutral-50 hover:border-neutral-200 group">
              <span className="text-sm">How to say </span>
              <span className="font-display text-lg group-hover:text-[#c53a1a]">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-8 md:px-[8%] lg:px-[12%] py-16 text-center">
        <p className="text-neutral-400 mb-6">Can&rsquo;t find what you&rsquo;re looking for?</p>
        <Link href="/" className="px-8 py-4 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-700 transition-colors inline-block">Search the Dictionary</Link>
      </section>
    </div>
  );
}
