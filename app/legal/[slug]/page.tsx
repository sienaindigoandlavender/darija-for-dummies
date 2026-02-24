import { getLegalPage, getSiteConfig, resolveVariables } from '@/lib/nexus';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getLegalPage(params.slug);
  if (!page) return { title: 'Not Found' };

  const title = `${page.page_title} — Darija Dictionary`;
  return {
    title,
    description: `${page.page_title} for Darija Dictionary (dharija.space), a Dancing with Lions publication.`,
    robots: { index: false, follow: true },
    alternates: { canonical: `https://dharija.space/legal/${params.slug}` },
  };
}

export default async function LegalPage({ params }: { params: { slug: string } }) {
  const [page, site] = await Promise.all([
    getLegalPage(params.slug),
    getSiteConfig('darija-for-dummies'),
  ]);

  if (!page) return notFound();

  const html = site ? resolveVariables(page.body_html, site) : page.body_html;

  return (
    <div className="px-8 md:px-[8%] lg:px-[12%] py-20">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl mb-8">{page.page_title}</h1>
        <div
          className="prose prose-neutral max-w-none text-sm leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
