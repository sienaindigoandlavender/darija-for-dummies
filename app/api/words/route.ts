export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextRequest, NextResponse } from 'next/server';
import { getWordsByCategory, getWordsByTag } from '@/lib/dictionary';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  const tag = request.nextUrl.searchParams.get('tag');
  
  let words: any[] = [];
  if (category) {
    words = await getWordsByCategory(category);
  } else if (tag) {
    words = await getWordsByTag(tag);
  }
  
  return NextResponse.json(words, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
    },
  });
}
