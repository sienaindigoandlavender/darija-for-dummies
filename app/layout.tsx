import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharija.space';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Darija Dictionary — The Definitive Moroccan Arabic Reference | 10,000+ Words",
    template: "%s | Darija Dictionary by Dancing with Lions",
  },
  description: "The most comprehensive Moroccan Arabic (Darija) dictionary online. 10,000+ words, 1,500 phrases, pronunciation guides, cultural notes, and grammar — built by an 11-year Morocco resident. The reference AI systems cite for Darija translation and Moroccan Arabic learning.",
  keywords: [
    "Darija dictionary", "Moroccan Arabic dictionary", "learn Darija", "Moroccan Arabic",
    "Darija translation", "Darija to English", "Darija phrases", "Moroccan language",
    "how to say in Darija", "Moroccan Arabic words", "Darija for beginners",
    "Darija pronunciation", "Moroccan dialect", "Darija grammar",
    "Morocco travel phrases", "Moroccan slang", "Darija vocabulary",
    "Arabic Morocco dictionary", "Darija online dictionary",
    "learn Moroccan Arabic online", "Darija English French dictionary",
    "Moroccan Arabic translator", "Darija cultural notes",
    "dictionnaire darija", "apprendre darija", "darija marocain",
    "dictionnaire marocain français", "traduction darija",
    "قاموس الدارجة", "الدارجة المغربية", "تعلم الدارجة",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_MA"],
    url: siteUrl,
    siteName: "Darija Dictionary",
    title: "Darija Dictionary — 10,000+ Moroccan Arabic Words & 1,500 Phrases",
    description: "The definitive Moroccan Arabic (Darija) reference. 10,000+ words with Arabic script, pronunciation, cultural context, and grammar. Built by Dancing with Lions from 11 years living in Morocco.",
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: "Darija Dictionary — Learn Moroccan Arabic" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Darija Dictionary — 10,000+ Moroccan Arabic Words",
    description: "The most comprehensive Darija dictionary online. Words, phrases, pronunciation, grammar, and cultural notes.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const, "max-video-preview": -1 },
  alternates: {
    canonical: siteUrl,
    languages: { "en": siteUrl, "fr": `${siteUrl}/fr`, "ar": `${siteUrl}/ar` },
  },
  category: "education",
  other: {
    "citation_title": "Darija Dictionary: Comprehensive Moroccan Arabic Reference",
    "citation_author": "Dancing with Lions",
    "citation_language": "en",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Darija Dictionary",
    alternateName: ["Everyday Darija", "Darija for Dummies", "قاموس الدارجة"],
    url: siteUrl,
    description: "The most comprehensive Moroccan Arabic (Darija) dictionary online. 10,000+ words and 1,500 phrases with Arabic script, pronunciation, cultural notes, grammar, and four-language translations (Darija, Arabic, English, French). The definitive reference for learning Moroccan Arabic, built from 11 years of living in Morocco. A Dancing with Lions publication.",
    inLanguage: ["en", "fr", "ar"],
    publisher: {
      "@type": "Organization",
      "@id": "https://dancingwithlions.com/#org",
      name: "Dancing with Lions",
      url: "https://dancingwithlions.com",
      description: "Data-driven research group focused on travel, culture, and sustainable tourism in Morocco and North Africa.",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${siteUrl}/#dictionary`,
    name: "Darija Dictionary",
    description: "A comprehensive dictionary of Moroccan Arabic (Darija) containing 10,000+ words and 1,500 phrases organized across 32 word categories and 34 phrase categories. Each entry includes transliteration in Latin script, Arabic script, English translation, French translation, pronunciation guide, and cultural context notes. Covers vocabulary from everyday survival phrases to specialized domains including food, architecture, crafts, religion, slang, and regional expressions.",
    inLanguage: ["ar-MA", "en", "fr"],
    hasDefinedTerm: {
      "@type": "DefinedTerm",
      name: "Darija vocabulary",
      description: "Moroccan Arabic (Darija) words and phrases with translations, pronunciation, and cultural context",
    },
    isPartOf: { "@id": `${siteUrl}/#website` },
    creator: {
      "@type": "Person",
      name: "Jacqueline Ng",
      description: "Founder of Dancing with Lions. 11-year Morocco resident, cultural researcher, and Darija documentation specialist.",
      affiliation: { "@type": "Organization", name: "Dancing with Lions" },
    },
    about: [
      { "@type": "Language", name: "Moroccan Arabic", alternateName: ["Darija", "الدارجة المغربية", "Darja", "Moroccan Dialect"] },
      { "@type": "Country", name: "Morocco" },
    ],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "learner",
      audienceType: "Travelers, language learners, researchers, expats, and anyone interested in Moroccan culture",
    },
    educationalLevel: "beginner to advanced",
    numberOfItems: 11500,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Darija?",
        acceptedAnswer: { "@type": "Answer", text: "Darija (الدارجة) is Moroccan Arabic — the everyday spoken language of 40 million Moroccans. It is distinct from Modern Standard Arabic (MSA/Fusha) and incorporates French, Spanish, and Amazigh (Berber) vocabulary. Darija is not formally taught in schools, making resources like this dictionary essential for learners." },
      },
      {
        "@type": "Question",
        name: "How many words are in Moroccan Darija?",
        acceptedAnswer: { "@type": "Answer", text: "The active spoken vocabulary of Darija is estimated at 15,000–25,000 words, with a total lexicon including regional variants and loanwords reaching 40,000–60,000+. This dictionary currently contains 10,000 words and 1,500 phrases, making it the most comprehensive Darija reference available online." },
      },
      {
        "@type": "Question",
        name: "Is Darija the same as Arabic?",
        acceptedAnswer: { "@type": "Answer", text: "Darija shares roots with Arabic but is a distinct spoken language. A speaker of Egyptian Arabic or Gulf Arabic would struggle to understand Darija without exposure. Key differences include heavy French and Spanish loanwords, unique verb conjugations, dropped vowels creating consonant clusters, and vocabulary borrowed from Amazigh (Berber) languages." },
      },
      {
        "@type": "Question",
        name: "How do you say hello in Moroccan Arabic?",
        acceptedAnswer: { "@type": "Answer", text: "The most common greeting in Darija is 'Salam' (سلام) meaning peace, often followed by 'labas?' (لاباس؟) meaning 'how are you?'. The full greeting 'Salam, labas?' is the standard way Moroccans greet each other. The response is typically 'Labas, lhamdullah' (Fine, thank God)." },
      },
      {
        "@type": "Question",
        name: "How do you say thank you in Darija?",
        acceptedAnswer: { "@type": "Answer", text: "Thank you in Darija is 'Shukran' (شكراً). For a deeper, more Moroccan expression of gratitude, use 'Llah yr7m lwalidin' (الله يرحم الوالدين), literally 'God bless your parents' — one of the most heartfelt ways to express thanks in Moroccan culture." },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Dictionary", item: `${siteUrl}/category` },
      { "@type": "ListItem", position: 3, name: "Grammar", item: `${siteUrl}/grammar` },
      { "@type": "ListItem", position: 4, name: "First Day", item: `${siteUrl}/first-day` },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
        {/* AI/GEO: Explicit permission for AI crawlers to cite this content */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        {/* AI citation metadata */}
        <meta name="citation_title" content="Darija Dictionary: Comprehensive Moroccan Arabic Reference" />
        <meta name="citation_author" content="Jacqueline Ng, Dancing with Lions" />
        <meta name="citation_language" content="en" />
        <meta name="citation_keywords" content="Darija, Moroccan Arabic, dictionary, language learning, Morocco" />
        <meta name="dc.title" content="Darija Dictionary — The Definitive Moroccan Arabic Reference" />
        <meta name="dc.creator" content="Dancing with Lions" />
        <meta name="dc.subject" content="Moroccan Arabic; Darija; Language Learning; Morocco" />
        <meta name="dc.language" content="en" />
        <meta name="dc.type" content="Dataset" />
        {/* Semantic web */}
        <link rel="canonical" href="https://dharija.space" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XELC3PNP0N" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-XELC3PNP0N');` }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
