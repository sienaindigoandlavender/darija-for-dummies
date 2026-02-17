import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://darija.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Darija for Dummies — Learn Moroccan Arabic",
    template: "%s | Darija for Dummies",
  },
  description: "The fun, irreverent guide to Moroccan Arabic (Darija). 200+ words, 80+ phrases, cultural notes, souk survival, and the slang nobody teaches you.",
  keywords: [
    "Darija", "Moroccan Arabic", "learn Darija", "Moroccan language",
    "Morocco phrases", "Darija dictionary", "Moroccan slang",
    "Arabic Morocco", "travel Morocco language", "Darija for beginners"
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
    url: siteUrl,
    siteName: "Darija for Dummies",
    title: "Darija for Dummies — Learn Moroccan Arabic the fun way",
    description: "200+ words, 80+ phrases, cultural gold, and the slang nobody teaches you. Moroccan Arabic made human.",
  },
  robots: { index: true, follow: true },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Darija for Dummies",
  url: siteUrl,
  description: "Comprehensive Moroccan Arabic (Darija) dictionary and phrasebook with cultural notes, pronunciation guides, and situational learning.",
  inLanguage: ["en", "fr", "ar"],
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
