import { searchWords, searchPhrases } from '@/lib/dictionary';
import type { Metadata } from 'next';
import HowToSayClient from './HowToSayClient';

// The 50+ most searched "how do you say X in Moroccan Arabic" queries
const TERMS: Record<string, { query: string; title: string; description: string }> = {
  'thank-you': { query: 'thank', title: 'How to Say Thank You in Moroccan Arabic', description: 'Shukran, llah ykhllik, barak llahu fik — every way to say thank you in Darija with pronunciation and when to use each one.' },
  'hello': { query: 'hello', title: 'How to Say Hello in Moroccan Arabic', description: 'Salam, labas, ahlan — greetings in Darija with the full greeting sequence Moroccans actually use.' },
  'goodbye': { query: 'goodbye', title: 'How to Say Goodbye in Moroccan Arabic', description: 'Bslama, tsbhh 3la khir, llah ymssk bikhir — every way to say goodbye in Darija.' },
  'how-are-you': { query: 'how are you', title: 'How to Say How Are You in Moroccan Arabic', description: 'Labas? Kiddayr? — the Darija greeting sequence that you cannot skip.' },
  'please': { query: 'please', title: 'How to Say Please in Moroccan Arabic', description: '3afak, llah ykhllik, mn fdlk — please in Darija with cultural context.' },
  'sorry': { query: 'sorry', title: 'How to Say Sorry in Moroccan Arabic', description: 'Smhhliya, 3fu — apologizing in Darija and when each form is appropriate.' },
  'yes': { query: 'yes', title: 'How to Say Yes in Moroccan Arabic', description: 'Iyyeh, ah, wakha — the many ways to agree in Darija.' },
  'no': { query: 'no', title: 'How to Say No in Moroccan Arabic', description: 'Lla, lala, ma-bghitsh — saying no in Darija without causing offense.' },
  'how-much': { query: 'how much', title: 'How to Say How Much in Moroccan Arabic', description: 'Bshhal? Bshhal hada? — the essential souk phrase in Darija with bargaining vocabulary.' },
  'water': { query: 'water', title: 'How to Say Water in Moroccan Arabic', description: 'L-ma — water in Darija and related drink vocabulary.' },
  'tea': { query: 'tea', title: 'How to Say Tea in Moroccan Arabic', description: 'Atay — Moroccan mint tea vocabulary in Darija with cultural notes on tea ceremony.' },
  'coffee': { query: 'coffee', title: 'How to Say Coffee in Moroccan Arabic', description: 'Qhwa, noss noss — coffee vocabulary in Darija and café culture.' },
  'bread': { query: 'bread', title: 'How to Say Bread in Moroccan Arabic', description: 'L-khubz — bread in Darija. The word you will hear and need most in Morocco.' },
  'delicious': { query: 'delicious', title: 'How to Say Delicious in Moroccan Arabic', description: 'Bnin, ldid, zwin — complimenting food in Darija (the highest form of praise for a host).' },
  'beautiful': { query: 'beautiful', title: 'How to Say Beautiful in Moroccan Arabic', description: 'Zwin, zwina, jmil — beauty words in Darija for people, places, and things.' },
  'love': { query: 'love', title: 'How to Say I Love You in Moroccan Arabic', description: 'Kanbghik, kanhhbbk — love expressions in Darija with cultural weight.' },
  'where': { query: 'where', title: 'How to Say Where in Moroccan Arabic', description: 'Fin? Fin kayn...? — asking for directions in Darija.' },
  'bathroom': { query: 'bathroom', title: 'How to Say Bathroom in Moroccan Arabic', description: 'Bit l-ma, twalet — asking for the bathroom in Darija.' },
  'taxi': { query: 'taxi', title: 'How to Say Taxi in Moroccan Arabic', description: 'Taxi, petit taxi, grand taxi — transport vocabulary in Darija with fare negotiation phrases.' },
  'money': { query: 'money', title: 'How to Say Money in Moroccan Arabic', description: 'L-flus, drham, ryal — money vocabulary in Darija and the ryal counting system.' },
  'food': { query: 'food', title: 'How to Say Food in Moroccan Arabic', description: 'L-makla — food vocabulary in Darija covering meals, dishes, and kitchen language.' },
  'good': { query: 'good', title: 'How to Say Good in Moroccan Arabic', description: 'Mzyan, bikhir, hssen — saying good in Darija for things, situations, and people.' },
  'bad': { query: 'bad', title: 'How to Say Bad in Moroccan Arabic', description: 'Khayb, ma mzyansh — expressing bad in Darija.' },
  'big': { query: 'big', title: 'How to Say Big in Moroccan Arabic', description: 'Kbir, kbira — size adjectives in Darija.' },
  'small': { query: 'small', title: 'How to Say Small in Moroccan Arabic', description: 'Sghir, sghira — size words in Darija.' },
  'hot': { query: 'hot', title: 'How to Say Hot in Moroccan Arabic', description: 'Skhun, hharr — temperature and spice heat in Darija.' },
  'cold': { query: 'cold', title: 'How to Say Cold in Moroccan Arabic', description: 'Bard, barda — cold in Darija for weather, drinks, and temperature.' },
  'i-dont-understand': { query: 'understand', title: 'How to Say I Don\'t Understand in Moroccan Arabic', description: 'Ma fhmtsh — the most useful phrase in Darija for any traveler.' },
  'i-dont-speak-arabic': { query: 'speak arabic', title: 'How to Say I Don\'t Speak Arabic in Moroccan Arabic', description: 'Ma kantkllmsh l-3rbiya — telling people you don\'t speak Arabic in Darija.' },
  'my-name-is': { query: 'name', title: 'How to Say My Name Is in Moroccan Arabic', description: 'Smiyti... — introducing yourself in Darija.' },
  'friend': { query: 'friend', title: 'How to Say Friend in Moroccan Arabic', description: 'Sahbi, shhab, khuya — friendship vocabulary in Darija.' },
  'family': { query: 'family', title: 'How to Say Family in Moroccan Arabic', description: 'L-3a2ila, l-walidin — family vocabulary in Darija.' },
  'mother': { query: 'mother', title: 'How to Say Mother in Moroccan Arabic', description: 'Lwalida, mama, mmi — mother in Darija with cultural significance.' },
  'father': { query: 'father', title: 'How to Say Father in Moroccan Arabic', description: 'Lwalid, baba, bbi — father in Darija.' },
  'house': { query: 'house', title: 'How to Say House in Moroccan Arabic', description: 'D-dar — house, home, and dwelling vocabulary in Darija.' },
  'market': { query: 'market', title: 'How to Say Market in Moroccan Arabic', description: 'S-suq — the souk and market vocabulary in Darija.' },
  'expensive': { query: 'expensive', title: 'How to Say Expensive in Moroccan Arabic', description: 'Ghali, ghali bzzaf — price vocabulary for bargaining in Darija.' },
  'cheap': { query: 'cheap', title: 'How to Say Cheap in Moroccan Arabic', description: 'Rkhis — price negotiation words in Darija.' },
  'doctor': { query: 'doctor', title: 'How to Say Doctor in Moroccan Arabic', description: 'Ttbib — medical vocabulary in Darija for health emergencies.' },
  'help': { query: 'help', title: 'How to Say Help in Moroccan Arabic', description: '3awnni, 3afak 3awnni — asking for help in Darija.' },
  'eat': { query: 'eat', title: 'How to Say Eat in Moroccan Arabic', description: 'Kla, ka-nakl — eating verbs in Darija with conjugation.' },
  'drink': { query: 'drink', title: 'How to Say Drink in Moroccan Arabic', description: 'Shrb, ka-nshrb — drinking verbs in Darija.' },
  'go': { query: 'go', title: 'How to Say Go in Moroccan Arabic', description: 'Msha, ka-nmshi — the verb to go in Darija with full conjugation.' },
  'come': { query: 'come', title: 'How to Say Come in Moroccan Arabic', description: 'Ja, aji — come and arrive in Darija.' },
  'want': { query: 'want', title: 'How to Say I Want in Moroccan Arabic', description: 'Bgha, ka-nbghi — wanting and desiring in Darija (also means love).' },
  'i-like': { query: 'like', title: 'How to Say I Like in Moroccan Arabic', description: 'Ka-y3jbni, ka-nbghi — expressing preference in Darija.' },
  'god-willing': { query: 'inshallah', title: 'How to Say God Willing (Inshallah) in Moroccan Arabic', description: 'Inshallah — the most important word in Morocco. Can mean yes, maybe, or never.' },
  'welcome': { query: 'welcome', title: 'How to Say Welcome in Moroccan Arabic', description: 'Mrhba, mrhba bik — welcoming in Darija and the culture of hospitality.' },
  'lets-go': { query: 'yallah', title: 'How to Say Let\'s Go in Moroccan Arabic', description: 'Yallah — the universal Darija command to move, start, or hurry.' },
  'enough': { query: 'enough', title: 'How to Say Enough in Moroccan Arabic', description: 'Safi, baraka — enough and stop in Darija.' },
};

export async function generateStaticParams() {
  return Object.keys(TERMS).map(term => ({ term }));
}

export async function generateMetadata({ params }: { params: { term: string } }): Promise<Metadata> {
  const t = TERMS[params.term];
  if (!t) return { title: `How to Say "${params.term}" in Darija` };
  return {
    title: t.title,
    description: t.description,
    openGraph: { title: t.title, description: t.description },
    alternates: { canonical: `https://dharija.space/how-to-say/${params.term}` },
  };
}

export default async function HowToSayPage({ params }: { params: { term: string } }) {
  const t = TERMS[params.term];
  if (!t) {
    // Dynamic fallback for terms not in the list
    const words = await searchWords(params.term.replace(/-/g, ' '));
    const phrases = await searchPhrases(params.term.replace(/-/g, ' '));
    return <HowToSayClient term={params.term.replace(/-/g, ' ')} words={words} phrases={phrases} title={`How to say "${params.term.replace(/-/g, ' ')}" in Darija`} description="" />;
  }

  const [words, phrases] = await Promise.all([
    searchWords(t.query),
    searchPhrases(t.query),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: words.slice(0, 5).map(w => ({
      '@type': 'Question',
      name: `How do you say "${w.english}" in Moroccan Arabic?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `In Darija (Moroccan Arabic), "${w.english}" is "${w.darija}" (${w.arabic}), pronounced /${w.pronunciation}/.${w.cultural_note ? ' ' + w.cultural_note : ''}`,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HowToSayClient term={t.query} words={words} phrases={phrases} title={t.title} description={t.description} />
    </>
  );
}
