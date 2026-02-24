'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20">
      {/* Level 1 — Navigation */}
      <div style={{ backgroundColor: '#1f1f1f' }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <Link href="/" className="block mb-3">
                <span className="uppercase tracking-widest text-sm text-white/90">Dharija</span>
              </Link>
              <p className="text-xs text-white/70 leading-relaxed max-w-xs">
                Moroccan Arabic for everyone. A living dictionary of Darija words, phrases, and the culture behind them.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-xs text-white/90 hover:text-white transition-colors">Dictionary</Link></li>
                <li><Link href="/category/greetings" className="text-xs text-white/90 hover:text-white transition-colors">Browse Categories</Link></li>
                <li><Link href="/grammar" className="text-xs text-white/90 hover:text-white transition-colors">Grammar</Link></li>
                <li><Link href="/practice" className="text-xs text-white/90 hover:text-white transition-colors">Practice</Link></li>
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">Learn</h3>
              <ul className="space-y-2">
                <li><Link href="/first-day" className="text-xs text-white/90 hover:text-white transition-colors">First Day Kit</Link></li>
                <li><Link href="/about" className="text-xs text-white/90 hover:text-white transition-colors">About Darija</Link></li>
              </ul>
            </div>

            {/* Network */}
            <div>
              <h3 className="uppercase tracking-widest text-[10px] text-white/80 mb-3">Network</h3>
              <ul className="space-y-2">
                <li><a href="https://www.slowmorocco.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/90 hover:text-white transition-colors">Slow Morocco</a></li>
                <li><a href="https://architectureofmorocco.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/90 hover:text-white transition-colors">Architecture of Morocco</a></li>
                <li><a href="https://cuisinesofmorocco.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/90 hover:text-white transition-colors">Cuisines of Morocco</a></li>
                <li><a href="https://derb.so" target="_blank" rel="noopener noreferrer" className="text-xs text-white/90 hover:text-white transition-colors">derb</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Level 2 — Legal */}
      <div style={{ backgroundColor: '#161616' }}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/legal/privacy" className="text-white/85 hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="text-white/85 hover:text-white transition-colors">Terms</Link>
            <Link href="/legal/disclaimer" className="text-white/85 hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>

      {/* Level 3 — Attribution */}
      <div style={{ backgroundColor: '#0e0e0e' }}>
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-[9px] tracking-[0.15em] uppercase text-white/70 text-center">
            A <a href="https://www.slowmorocco.com" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">Slow Morocco</a> project
          </p>
        </div>
      </div>

      {/* Level 4 — Powered by */}
      <div style={{ backgroundColor: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          <p className="text-[9px] tracking-[0.15em] uppercase text-white/50 text-center">
            Powered by <a href="https://www.dancingwiththelions.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">Dancing with Lions</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
