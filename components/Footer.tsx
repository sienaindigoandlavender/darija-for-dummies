'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

interface ContentSite { id: number; site_label: string; site_url: string; display_order: number }
interface LegalPage { page_slug: string; page_title: string }
interface PoweredBy { label: string; url: string }
interface SiteConfig { site_id: string; site_name: string; site_url: string; legal_entity: string; contact_email: string }

export default function Footer() {
  const [contentSites, setContentSites] = useState<ContentSite[]>([]);
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [poweredBy, setPoweredBy] = useState<PoweredBy | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch('/api/footer')
      .then(r => r.json())
      .then(data => {
        setContentSites(data.contentSites || []);
        setLegalPages(data.legalPages || []);
        setPoweredBy(data.poweredBy || null);
        setSiteConfig(data.siteConfig || null);
      })
      .catch(() => {});
  }, []);

  const siteName = siteConfig?.site_name || 'Darija for Dummies';
  const copyrightHolder = siteConfig?.legal_entity || poweredBy?.label || 'Slow Morocco';

  return (
    <footer>
      {/* ═══ LEVEL 1: Brand + Navigation ═══ #1f1f1f */}
      <div style={{ backgroundColor: '#1f1f1f' }}>
        <div className="px-8 md:px-[8%] lg:px-[12%] py-16">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <span className="font-display text-2xl text-white/90">{siteName}</span>
              <p className="text-sm text-white/50 mt-3 max-w-sm leading-relaxed">
                The fun, irreverent guide to Moroccan Arabic. Built with love from inside the medina.
              </p>
              {poweredBy && (
                <p className="text-xs text-white/30 mt-6">
                  A <a href={poweredBy.url} target="_blank" rel="noopener" className="text-white/40 hover:text-white/60 transition-colors">{poweredBy.label}</a> project
                </p>
              )}
            </div>
            <div className="md:col-span-3 md:col-start-7">
              <span className="text-xs tracking-[0.15em] uppercase text-white/40 block mb-4">Learn</span>
              <div className="space-y-2.5">
                <p><a href="/" className="text-sm text-white/60 hover:text-white/90 transition-colors">Dictionary</a></p>
                <p><a href="/grammar" className="text-sm text-white/60 hover:text-white/90 transition-colors">Grammar Guide</a></p>
                <p><a href="/first-day" className="text-sm text-white/60 hover:text-white/90 transition-colors">First Day Kit</a></p>
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
                <a key={site.id} href={`https://${site.site_url}`} target="_blank" rel="noopener"
                  className="text-xs text-white/35 hover:text-white/60 transition-colors">{site.site_label}</a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ LEVEL 3: Legal + Language + Powered by + Copyright ═══ #0e0e0e */}
      <div style={{ backgroundColor: '#0e0e0e' }}>
        <div className="px-8 md:px-[8%] lg:px-[12%] py-5">
          <div className="flex flex-col gap-4">
            {/* Row 1: Legal + Language */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {legalPages.length > 0 ? (
                legalPages.map(page => (
                  <a key={page.page_slug} href={`/legal/${page.page_slug}`}
                    className="text-xs text-white/25 hover:text-white/45 transition-colors">{page.page_title}</a>
                ))
              ) : (
                <>
                  <a href="/legal/privacy" className="text-xs text-white/25 hover:text-white/45 transition-colors">Privacy</a>
                  <a href="/legal/terms" className="text-xs text-white/25 hover:text-white/45 transition-colors">Terms</a>
                </>
              )}
              <span className="text-white/10">|</span>
              <select
                id="lang-select"
                onChange={(e) => {
                  const lang = e.target.value;
                  if (!lang) return;
                  document.cookie = `googtrans=/en/${lang};path=/;`;
                  document.cookie = `googtrans=/en/${lang};path=/;domain=${window.location.hostname}`;
                  window.location.reload();
                }}
                defaultValue=""
                className="bg-white/5 border border-white/12 text-white/35 text-[11px] py-1 px-2 rounded cursor-pointer outline-none hover:border-white/25 hover:text-white/50 transition-colors"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <option value="" disabled>Language</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="zh-CN">中文</option>
              </select>
            </div>
            {/* Row 2: Powered by + Copyright */}
            <div className="flex flex-wrap items-center gap-x-3">
              {poweredBy && (
                <>
                  <span className="text-xs text-white/20">Powered by</span>
                  <a href={poweredBy.url} target="_blank" rel="noopener" className="text-xs text-white/35 hover:text-white/55 transition-colors">{poweredBy.label}</a>
                  <span className="text-white/10">|</span>
                </>
              )}
              <span className="text-xs text-white/20">&copy; {new Date().getFullYear()} {copyrightHolder}. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Google Translate engine */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }} />
      <Script id="google-translate-init" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: `function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'en,fr,ar,es,de,it,pt,ja,ko,zh-CN',autoDisplay:false},'google_translate_element')}` }} />
      <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="lazyOnload" />
      <style jsx global>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
        .skiptranslate > iframe { display: none !important; }
        #lang-select option { background: #1a1a1a; color: #aaa; }
      `}</style>
    </footer>
  );
}
