'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

interface ContentSite {
  id: number;
  site_label: string;
  site_url: string;
  display_order: number;
}

interface LegalPage {
  page_slug: string;
  page_title: string;
}

export default function Footer() {
  const [contentSites, setContentSites] = useState<ContentSite[]>([]);
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);

  useEffect(() => {
    fetch('/api/footer')
      .then(r => r.json())
      .then(data => {
        setContentSites(data.contentSites || []);
        setLegalPages(data.legalPages || []);
      })
      .catch(() => {});
  }, []);

  return (
    <footer>
      {/* ═══ LEVEL 1: Brand + Navigation ═══ #1f1f1f */}
      <div style={{ backgroundColor: '#1f1f1f' }}>
        <div className="px-8 md:px-[8%] lg:px-[12%] py-16">
          <div className="grid md:grid-cols-12 gap-12">
            {/* Brand column */}
            <div className="md:col-span-5">
              <span className="font-display text-2xl text-white/90">Darija for Dummies</span>
              <p className="text-sm text-white/50 mt-3 max-w-sm leading-relaxed">
                The fun, irreverent guide to Moroccan Arabic. Built with love from inside the medina.
              </p>
              <p className="text-xs text-white/30 mt-6">A Dancing with Lions project</p>
            </div>

            {/* Navigation */}
            <div className="md:col-span-3 md:col-start-7">
              <span className="text-xs tracking-[0.15em] uppercase text-white/40 block mb-4">Learn</span>
              <div className="space-y-2.5">
                <p><a href="/" className="text-sm text-white/60 hover:text-white/90 transition-colors">Dictionary</a></p>
                <p><a href="/" className="text-sm text-white/60 hover:text-white/90 transition-colors">Phrases</a></p>
                <p><a href="/" className="text-sm text-white/60 hover:text-white/90 transition-colors">Proverbs</a></p>
                <p><a href="/" className="text-sm text-white/60 hover:text-white/90 transition-colors">About</a></p>
              </div>
            </div>

            {/* Family */}
            <div className="md:col-span-2">
              <span className="text-xs tracking-[0.15em] uppercase text-white/40 block mb-4">Family</span>
              <div className="space-y-2.5">
                <p><a href="https://slowmorocco.com" target="_blank" rel="noopener" className="text-sm text-white/60 hover:text-white/90 transition-colors">Slow Morocco</a></p>
                <p><a href="https://riad-di-siena.com" target="_blank" rel="noopener" className="text-sm text-white/60 hover:text-white/90 transition-colors">Riad di Siena</a></p>
                <p><a href="https://amawal.app" target="_blank" rel="noopener" className="text-sm text-white/60 hover:text-white/90 transition-colors">Amawal</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ LEVEL 2: Content Network + Powered by ═══ #161616 */}
      <div style={{ backgroundColor: '#161616' }}>
        <div className="px-8 md:px-[8%] lg:px-[12%] py-6">
          {/* Content Sites */}
          {contentSites.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <span className="text-xs tracking-[0.15em] uppercase text-white/30">Explore</span>
              {contentSites.map(site => (
                <a key={site.id}
                  href={`https://${site.site_url}`}
                  target="_blank"
                  rel="noopener"
                  className="text-xs text-white/40 hover:text-white/70 transition-colors">
                  {site.site_label}
                </a>
              ))}
            </div>
          )}

          {/* Powered by */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/25">Powered by</span>
            <a href="https://slowmorocco.com" target="_blank" rel="noopener"
              className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Slow Morocco
            </a>
          </div>
        </div>
      </div>

      {/* ═══ LEVEL 3: Legal + Google Translate ═══ #0e0e0e */}
      <div style={{ backgroundColor: '#0e0e0e' }}>
        <div className="px-8 md:px-[8%] lg:px-[12%] py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Legal links */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {legalPages.length > 0 ? (
                legalPages.map(page => (
                  <a key={page.page_slug}
                    href={`/legal/${page.page_slug}`}
                    className="text-xs text-white/30 hover:text-white/50 transition-colors">
                    {page.page_title}
                  </a>
                ))
              ) : (
                <>
                  <a href="/legal/privacy" className="text-xs text-white/30 hover:text-white/50 transition-colors">Privacy</a>
                  <a href="/legal/terms" className="text-xs text-white/30 hover:text-white/50 transition-colors">Terms</a>
                </>
              )}
            </div>

            {/* Google Translate + Copyright */}
            <div className="flex items-center gap-4">
              <div id="google_translate_element" className="opacity-60 hover:opacity-100 transition-opacity" />
              <span className="text-xs text-white/20">© {new Date().getFullYear()} Darija for Dummies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Google Translate Script */}
      <Script
        id="google-translate-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,fr,ar,es,de,it,pt,ja,ko,zh-CN',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `,
        }}
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
    </footer>
  );
}
