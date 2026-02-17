export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextRequest, NextResponse } from 'next/server';
import { searchWords, searchPhrases } from '@/lib/dictionary';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  
  const [words, phrases] = await Promise.all([
    searchWords(q),
    searchPhrases(q),
  ]);
  
  return NextResponse.json({ words, phrases }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
    },
  });
}
