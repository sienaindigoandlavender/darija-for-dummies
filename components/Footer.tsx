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
              {/* Social icons */}
              <div className="flex items-center gap-4 mt-6">
                <a href="https://www.instagram.com/slowmorocco" target="_blank" rel="noopener" className="text-white/30 hover:text-white/60 transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </a>
                <a href="https://www.pinterest.com/slowmorocco" target="_blank" rel="noopener" className="text-white/30 hover:text-white/60 transition-colors" aria-label="Pinterest">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.462-6.233 7.462-1.214 0-2.354-.63-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                </a>
              </div>
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

      {/* ═══ LEVEL 2: Content Network ═══ #161616 */}
      <div style={{ backgroundColor: '#161616' }}>
        <div className="px-8 md:px-[8%] lg:px-[12%] py-5">
          {contentSites.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-xs tracking-[0.15em] uppercase text-white/25">Explore</span>
              {contentSites.map(site => (
                <a key={site.id}
                  href={`https://${site.site_url}`}
                  target="_blank"
                  rel="noopener"
                  className="text-xs text-white/35 hover:text-white/60 transition-colors">
                  {site.site_label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ LEVEL 3: Legal + Language + Powered by + Copyright ═══ #0e0e0e */}
      <div style={{ backgroundColor: '#0e0e0e' }}>
        <div className="px-8 md:px-[8%] lg:px-[12%] py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Legal links */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {legalPages.length > 0 ? (
                legalPages.map(page => (
                  <a key={page.page_slug}
                    href={`/legal/${page.page_slug}`}
                    className="text-xs text-white/25 hover:text-white/45 transition-colors">
                    {page.page_title}
                  </a>
                ))
              ) : (
                <>
                  <a href="/legal/privacy" className="text-xs text-white/25 hover:text-white/45 transition-colors">Privacy</a>
                  <a href="/legal/terms" className="text-xs text-white/25 hover:text-white/45 transition-colors">Terms</a>
                </>
              )}
              <span className="text-white/10">|</span>
              {/* Google Translate inline */}
              <div id="google_translate_element" className="[&_.goog-te-gadget]:!font-sans [&_.goog-te-gadget]:!text-xs [&_.goog-te-combo]:!bg-transparent [&_.goog-te-combo]:!border-white/15 [&_.goog-te-combo]:!border [&_.goog-te-combo]:!text-white/40 [&_.goog-te-combo]:!text-xs [&_.goog-te-combo]:!py-1 [&_.goog-te-combo]:!px-2 [&_.goog-te-combo]:!rounded [&_.goog-te-combo]:!appearance-none [&_.goog-te-gadget_span]:!hidden [&_select]:!cursor-pointer" />
            </div>

            {/* Powered by + Copyright */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/20">Powered by</span>
              <a href="https://slowmorocco.com" target="_blank" rel="noopener" className="text-xs text-white/30 hover:text-white/50 transition-colors">Slow Morocco</a>
              <span className="text-white/10">|</span>
              <span className="text-xs text-white/20">&copy; {new Date().getFullYear()} Slow Morocco</span>
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

      {/* Hide Google Translate banner */}
      <style jsx global>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }
        #google_translate_element .goog-te-gadget > span { display: none; }
        #google_translate_element .goog-logo-link { display: none !important; }
        #google_translate_element .goog-te-gadget { color: transparent !important; font-size: 0 !important; }
      `}</style>
    </footer>
  );
}
