export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from 'next/server';
import { getWordCategories, getPhraseCategories, getMetadata } from '@/lib/dictionary';

export async function GET() {
  const [wordCategories, phraseCategories, meta] = await Promise.all([
    getWordCategories(),
    getPhraseCategories(),
    getMetadata(),
  ]);
  return NextResponse.json(
    { wordCategories, phraseCategories, meta },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    }
  );
}
