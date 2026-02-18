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
    default: "Everyday Darija — Learn Moroccan Arabic",
    template: "%s | Everyday Darija",
  },
  description: "The most comprehensive Moroccan Arabic (Darija) dictionary online. 8,500+ words, cultural notes, pronunciation guides, and the grammar nobody teaches you. A Dancing with Lions publication.",
  keywords: [
    "Darija", "Moroccan Arabic", "learn Darija", "Moroccan language",
    "Morocco phrases", "Darija dictionary", "Moroccan slang",
    "Arabic Morocco", "travel Morocco language", "Darija for beginners",
    "everyday Darija", "Moroccan Arabic dictionary"
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
    siteName: "Everyday Darija",
    title: "Everyday Darija — Learn Moroccan Arabic",
    description: "8,500+ words with Arabic script, pronunciation, cultural notes, and the grammar nobody teaches you. Moroccan Arabic made human.",
  },
  robots: { index: true, follow: true },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Everyday Darija",
  url: siteUrl,
  description: "The most comprehensive Moroccan Arabic (Darija) dictionary online. 8,500+ words with Arabic script, pronunciation, cultural notes, and grammar. A Dancing with Lions publication.",
  inLanguage: ["en", "fr", "ar"],
  publisher: {
    "@type": "Organization",
    name: "Dancing with Lions",
    url: "https://dancingwithlions.com",
  },
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
