import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Darija Grammar Guide — Moroccan Arabic Made Simple',
  description: 'The complete guide to Darija grammar: pronouns, verb conjugation (ka-/past/ghadi), negation (ma...sh), adjective agreement, and the sound system.',
  openGraph: {
    title: 'Darija Grammar — Moroccan Arabic Made Simple',
    description: 'Pronouns, verb tenses, negation, questions, and the sounds that don\'t exist in English. A Dancing with Lions reference.',
  },
};

export default function GrammarPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Darija Grammar Guide',
    description: 'Complete Moroccan Arabic grammar reference covering pronunciation, pronouns, verb conjugation, negation, and cultural context.',
    provider: { '@type': 'Organization', name: 'Dancing with Lions', url: 'https://dancingwithlions.com' },
    inLanguage: ['ar', 'en', 'fr'],
    teaches: 'Moroccan Arabic (Darija) grammar',
    isAccessibleForFree: true,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="px-8 md:px-[8%] lg:px-[12%] pt-20 pb-16">
          <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-8 inline-block">&larr; Back to Dictionary</Link>
          <p className="text-[#c53a1a] text-xs font-medium uppercase tracking-[0.3em] mb-4">Reference</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.9] mb-8">The Grammar<br />of <em>Darija</em></h1>
          <p className="text-neutral-500 text-lg max-w-2xl leading-relaxed">Darija is not written down in any official way. There is no Académie Française for Moroccan Arabic. This guide teaches the system that 40 million people use every day.</p>
        </section>

        {/* Navigation */}
        <nav className="px-8 md:px-[8%] lg:px-[12%] py-6 border-y border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {[
              ['#sounds', 'The Sound System'],
              ['#pronouns', 'Pronouns'],
              ['#verbs', 'Verb System'],
              ['#negation', 'Negation'],
              ['#questions', 'Questions'],
              ['#adjectives', 'Adjectives'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-neutral-400 hover:text-[#c53a1a] transition-colors">{label}</a>
            ))}
          </div>
        </nav>

        {/* ═══ THE SOUND SYSTEM ═══ */}
        <section id="sounds" className="px-8 md:px-[8%] lg:px-[12%] py-20">
          <h2 className="font-display text-4xl md:text-5xl mb-8">The Sound System</h2>
          <p className="text-neutral-600 text-lg max-w-3xl leading-relaxed mb-12">When Moroccans text, they swap numbers for sounds that don&rsquo;t exist in European languages. The 3 IS the ain. Once you see it, you can&rsquo;t unsee it.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl">
              <thead>
                <tr className="border-b-2 border-neutral-900">
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">Symbol</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">Arabic</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">Sound</th>
                  <th className="text-left py-4 text-xs uppercase tracking-[0.2em] text-neutral-400">How to Produce It</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['3', 'ع (ain)', 'Pharyngeal squeeze', 'Tighten the back of your throat as if gagging gently. The signature sound of Arabic.'],
                  ['7 / hh', 'ح (ha)', 'Breathy H', 'A forceful H from deep in the throat. Not the soft English H — push harder.'],
                  ['9 / ss', 'ص (sad)', 'Heavy S', 'Press your tongue flat and say S. It sounds thicker, darker.'],
                  ['gh', 'غ (ghain)', 'French R', 'The Parisian R in "Rien." A soft gargle at the back of the throat.'],
                  ['kh', 'خ (kha)', 'Scottish loch', 'Like clearing your throat softly. The CH in Bach.'],
                  ['q', 'ق (qaf)', 'Deep K', 'A K from the very back of the throat, almost a click.'],
                  ['dd', 'ض (dad)', 'Heavy D', 'Tongue pressed flat, emphatic D. Arabic is called "the language of Dad."'],
                  ['tt', 'ط (ta)', 'Heavy T', 'Emphatic T with tongue pressed flat against the palate.'],
                ].map(([sym, arabic, sound, desc], i) => (
                  <tr key={sym} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-neutral-50/50' : ''}`}>
                    <td className="py-4 pr-6 font-display text-2xl text-[#c53a1a]">{sym}</td>
                    <td className="py-4 pr-6 font-arabic text-xl">{arabic}</td>
                    <td className="py-4 pr-6 font-medium">{sound}</td>
                    <td className="py-4 text-neutral-500 text-sm leading-relaxed">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-12 border-l-2 border-[#d4931a] pl-6 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-2">Cultural note</p>
            <p className="text-neutral-600 leading-relaxed">Darija drops most short vowels from Classical Arabic. Where Arabic says &ldquo;kitaab&rdquo; (book), Darija says &ldquo;ktab.&rdquo; The rhythm is fast, percussive, and drops everything unnecessary.</p>
          </div>
        </section>

        {/* ═══ PRONOUNS ═══ */}
        <section id="pronouns" className="px-8 md:px-[8%] lg:px-[12%] py-20 bg-neutral-50/60">
          <h2 className="font-display text-4xl md:text-5xl mb-4">Pronouns &amp; Possession</h2>
          <p className="text-neutral-600 text-lg max-w-3xl leading-relaxed mb-12">Seven pronouns. No formal &ldquo;vous&rdquo; — everyone is &ldquo;tu.&rdquo; Possession uses &ldquo;dyal&rdquo; + pronoun suffix.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full max-w-3xl">
              <thead>
                <tr className="border-b-2 border-neutral-900">
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">English</th>
                  <th className="text-left py-4 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">Darija</th>
                  <th className="text-left py-4 pr-6 font-arabic text-xs uppercase tracking-[0.2em] text-neutral-400">Arabic</th>
                  <th className="text-left py-4 text-xs uppercase tracking-[0.2em] text-neutral-400">Possessive</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['I', 'ana', 'أنا', 'dyali (mine)'],
                  ['You (m)', 'nta', 'نتا', 'dyalk (yours)'],
                  ['You (f)', 'nti', 'نتي', 'dyalk (yours)'],
                  ['He', 'huwwa', 'هو', 'dyalu (his)'],
                  ['She', 'hiya', 'هي', 'dyalha (hers)'],
                  ['We', 'hhna', 'حنا', 'dyalna (ours)'],
                  ['You (pl)', 'ntuma', 'نتوما', 'dyalkum (y&rsquo;all)'],
                  ['They', 'huma', 'هوما', 'dyalhum (theirs)'],
                ].map(([en, dj, ar, poss], i) => (
                  <tr key={en} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white/50' : ''}`}>
                    <td className="py-3 pr-6 text-neutral-500">{en}</td>
                    <td className="py-3 pr-6 font-display text-xl">{dj}</td>
                    <td className="py-3 pr-6 font-arabic text-xl text-neutral-600">{ar}</td>
                    <td className="py-3 text-neutral-600">{poss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 border-l-2 border-[#d4931a] pl-6 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d4931a] mb-2">Cultural note</p>
            <p className="text-neutral-600 leading-relaxed">&ldquo;L-ktab dyali&rdquo; = my book. &ldquo;D-dar dyalna&rdquo; = our house. This one pattern covers everything.</p>
          </div>
        </section>

        {/* ═══ VERB SYSTEM ═══ */}
        <section id="verbs" className="px-8 md:px-[8%] lg:px-[12%] py-20">
          <h2 className="font-display text-4xl md:text-5xl mb-4">The Verb System</h2>
          <p className="text-neutral-600 text-lg max-w-3xl leading-relaxed mb-16">Three tenses. Built with prefixes and suffixes on a root. This is the engine.</p>

          {/* Present */}
          <div className="mb-16">
            <h3 className="font-display text-2xl text-[#c53a1a] mb-4">Present: <span className="font-display">ka-</span> + verb</h3>
            <p className="text-neutral-600 max-w-2xl mb-8">Add <strong>ka-</strong> before the conjugated verb. The prefix tells you the tense; the suffix tells you the person.</p>
            <div className="overflow-x-auto">
              <table className="w-full max-w-3xl">
                <thead><tr className="border-b-2 border-neutral-900">
                  <th className="text-left py-3 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">Person</th>
                  <th className="text-left py-3 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">kla (eat)</th>
                  <th className="text-left py-3 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">msha (go)</th>
                  <th className="text-left py-3 text-xs uppercase tracking-[0.2em] text-neutral-400">dar (do)</th>
                </tr></thead>
                <tbody>
                  {[
                    ['ana (I)', 'ka-nakl', 'ka-nmshi', 'ka-ndir'],
                    ['nta (you m)', 'ka-takl', 'ka-tmshi', 'ka-tdir'],
                    ['nti (you f)', 'ka-takli', 'ka-tmshi', 'ka-tdiri'],
                    ['huwwa (he)', 'ka-yakl', 'ka-ymshi', 'ka-ydir'],
                    ['hiya (she)', 'ka-takl', 'ka-tmshi', 'ka-tdir'],
                    ['hhna (we)', 'ka-naklu', 'ka-nmshiw', 'ka-ndiru'],
                    ['huma (they)', 'ka-yaklu', 'ka-ymshiw', 'ka-ydiru'],
                  ].map(([person, eat, go, doo], i) => (
                    <tr key={person} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-neutral-50/50' : ''}`}>
                      <td className="py-3 pr-6 text-neutral-500 text-sm">{person}</td>
                      <td className="py-3 pr-6 font-display text-lg">{eat}</td>
                      <td className="py-3 pr-6 font-display text-lg">{go}</td>
                      <td className="py-3 font-display text-lg">{doo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-neutral-400 text-sm mt-6 max-w-2xl">Pattern: <strong>n-</strong> for I, <strong>t-</strong> for you/she, <strong>y-</strong> for he, <strong>n-...-u</strong> for we, <strong>y-...-u</strong> for they. Learn this once, conjugate anything.</p>
          </div>

          {/* Past */}
          <div className="mb-16">
            <h3 className="font-display text-2xl text-[#c53a1a] mb-4">Past: root changes + suffix</h3>
            <p className="text-neutral-600 max-w-2xl mb-8">No prefix. The root shifts and takes a person suffix.</p>
            <div className="overflow-x-auto">
              <table className="w-full max-w-3xl">
                <thead><tr className="border-b-2 border-neutral-900">
                  <th className="text-left py-3 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">Person</th>
                  <th className="text-left py-3 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">kla (ate)</th>
                  <th className="text-left py-3 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">msha (went)</th>
                  <th className="text-left py-3 text-xs uppercase tracking-[0.2em] text-neutral-400">dar (did)</th>
                </tr></thead>
                <tbody>
                  {[
                    ['ana', 'klit', 'mshit', 'drt'],
                    ['nta', 'kliti', 'mshiti', 'drti'],
                    ['huwwa', 'kla', 'msha', 'dar'],
                    ['hiya', 'klat', 'mshat', 'darat'],
                    ['hhna', 'klina', 'mshina', 'drna'],
                    ['huma', 'klaw', 'mshaw', 'daru'],
                  ].map(([person, eat, go, doo], i) => (
                    <tr key={person} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-neutral-50/50' : ''}`}>
                      <td className="py-3 pr-6 text-neutral-500 text-sm">{person}</td>
                      <td className="py-3 pr-6 font-display text-lg">{eat}</td>
                      <td className="py-3 pr-6 font-display text-lg">{go}</td>
                      <td className="py-3 font-display text-lg">{doo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Future */}
          <div className="mb-12">
            <h3 className="font-display text-2xl text-[#c53a1a] mb-4">Future: <span className="font-display">ghadi</span> + present (without ka-)</h3>
            <p className="text-neutral-600 max-w-2xl mb-4">&ldquo;ghadi nakl&rdquo; = I will eat. &ldquo;ghadi nmshi&rdquo; = I will go. &ldquo;ghadi ndir&rdquo; = I will do.</p>
            <p className="text-neutral-400 text-sm">That&rsquo;s it. Three tenses. Three patterns. The rest is vocabulary.</p>
          </div>
        </section>

        {/* ═══ NEGATION ═══ */}
        <section id="negation" className="px-8 md:px-[8%] lg:px-[12%] py-20 bg-neutral-900 text-white">
          <h2 className="font-display text-4xl md:text-5xl mb-4">Negation: the <em>ma...sh</em> sandwich</h2>
          <p className="text-white/60 text-lg max-w-3xl leading-relaxed mb-12">Wrap any verb in <strong className="text-white">ma-</strong> and <strong className="text-white">-sh</strong>. Universal. Beautiful. Moroccan.</p>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl">
            <div>
              <p className="text-[#d4931a] text-xs uppercase tracking-[0.2em] mb-3">Present</p>
              <p className="font-display text-2xl text-white/90 mb-2">ma-ka-nakl<span className="text-[#d4931a]">sh</span></p>
              <p className="text-white/40">I don&rsquo;t eat</p>
            </div>
            <div>
              <p className="text-[#d4931a] text-xs uppercase tracking-[0.2em] mb-3">Past</p>
              <p className="font-display text-2xl text-white/90 mb-2">ma-klit<span className="text-[#d4931a]">sh</span></p>
              <p className="text-white/40">I didn&rsquo;t eat</p>
            </div>
            <div>
              <p className="text-[#d4931a] text-xs uppercase tracking-[0.2em] mb-3">Future</p>
              <p className="font-display text-2xl text-white/90 mb-2">ma-ghadi-nakl<span className="text-[#d4931a]">sh</span></p>
              <p className="text-white/40">I won&rsquo;t eat</p>
            </div>
          </div>

          <div className="mt-16 border-l-2 border-[#d4931a]/40 pl-6 max-w-2xl">
            <p className="text-[#d4931a] text-xs uppercase tracking-[0.2em] mb-2">Cultural note</p>
            <p className="text-white/50 leading-relaxed">The ma...sh sandwich comes from Amazigh substrate influence. It&rsquo;s what makes Darija sound nothing like Standard Arabic. When you hear it, you know you&rsquo;re in Morocco.</p>
          </div>
        </section>

        {/* ═══ QUESTIONS ═══ */}
        <section id="questions" className="px-8 md:px-[8%] lg:px-[12%] py-20">
          <h2 className="font-display text-4xl md:text-5xl mb-8">Questions</h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl">
            {[
              ['wash...?', 'واش', 'yes/no question marker', 'wash nta mghribi? = are you Moroccan?'],
              ['shnu / ashnu?', 'شنو / أشنو', 'what?', 'shnu smitk? = what\'s your name?'],
              ['fin?', 'فين', 'where?', 'fin kayn l-hammam? = where\'s the hammam?'],
              ['fuqash / imta?', 'فوقاش / إمتى', 'when?', 'fuqash ghadi tmshi? = when are you going?'],
              ['3lash / liyash?', 'علاش / لياش', 'why?', '3lash ma jitish? = why didn\'t you come?'],
              ['kifash?', 'كيفاش', 'how?', 'kifash kaygulu...? = how do you say...?'],
              ['shkun?', 'شكون', 'who?', 'shkun hada? = who is this?'],
              ['bshhal?', 'بشحال', 'how much?', 'bshhal hada? = how much is this?'],
            ].map(([dj, ar, en, ex]) => (
              <div key={dj} className="py-4 border-b border-neutral-100">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-xl">{dj}</span>
                  <span className="font-arabic text-lg text-neutral-400">{ar}</span>
                </div>
                <p className="text-neutral-600 text-sm mt-1">{en}</p>
                <p className="text-neutral-400 text-xs italic mt-1">{ex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ ADJECTIVES ═══ */}
        <section id="adjectives" className="px-8 md:px-[8%] lg:px-[12%] py-20 bg-neutral-50/60">
          <h2 className="font-display text-4xl md:text-5xl mb-4">Adjectives &amp; Agreement</h2>
          <p className="text-neutral-600 text-lg max-w-3xl leading-relaxed mb-12">Darija adjectives come after the noun and agree in gender. Masculine is the base form; feminine adds <strong>-a</strong>.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full max-w-3xl">
              <thead><tr className="border-b-2 border-neutral-900">
                <th className="text-left py-3 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">English</th>
                <th className="text-left py-3 pr-6 text-xs uppercase tracking-[0.2em] text-neutral-400">Masculine</th>
                <th className="text-left py-3 text-xs uppercase tracking-[0.2em] text-neutral-400">Feminine</th>
              </tr></thead>
              <tbody>
                {[
                  ['big', 'kbir', 'kbira'],
                  ['small', 'sghir', 'sghira'],
                  ['beautiful', 'zwin', 'zwina'],
                  ['hot', 'skhun', 'skhuna'],
                  ['cold', 'bard', 'barda'],
                  ['new', 'jdid', 'jdida'],
                  ['old', 'qdim', 'qdima'],
                  ['delicious', 'bnin', 'bnina'],
                  ['expensive', 'ghali', 'ghalya'],
                  ['happy', 'frhhan', 'frhhana'],
                  ['tired', 't3ban', 't3bana'],
                  ['hungry', 'ji3an', 'ji3ana'],
                ].map(([en, m, f], i) => (
                  <tr key={en} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white/50' : ''}`}>
                    <td className="py-3 pr-6 text-neutral-500">{en}</td>
                    <td className="py-3 pr-6 font-display text-lg">{m}</td>
                    <td className="py-3 font-display text-lg">{f}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-neutral-400 text-sm mt-8 max-w-2xl">Example: &ldquo;rajl kbir&rdquo; (big man) → &ldquo;mra kbira&rdquo; (big woman). &ldquo;atay skhun&rdquo; (hot tea) → &ldquo;l-ma barda&rdquo; (cold water).</p>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="px-8 md:px-[8%] lg:px-[12%] py-20 text-center">
          <p className="font-display text-3xl md:text-4xl mb-6">Ready to use it?</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <Link href="/first-day" className="px-8 py-4 bg-neutral-900 text-white text-sm tracking-wide hover:bg-neutral-700 transition-colors">First Day Survival Kit</Link>
            <Link href="/" className="px-8 py-4 border border-neutral-200 text-neutral-600 text-sm tracking-wide hover:border-neutral-400 transition-colors">Search 10,000 Words</Link>
          </div>
        </section>
      </div>
    </>
  );
}
