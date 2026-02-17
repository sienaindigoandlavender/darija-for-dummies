export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextRequest, NextResponse } from 'next/server';
import { getPhrasesByCategory, getProverbs } from '@/lib/dictionary';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  
  let phrases: any[] = [];
  if (category === 'proverbs') {
    phrases = await getProverbs();
  } else if (category) {
    phrases = await getPhrasesByCategory(category);
  }
  
  return NextResponse.json(phrases, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
    },
  });
}
