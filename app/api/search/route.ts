export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { searchWords, searchPhrases } from '@/lib/dictionary';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (!q.trim()) return NextResponse.json({ words: [], phrases: [] });
  
  const [words, phrases] = await Promise.all([
    searchWords(q),
    searchPhrases(q),
  ]);
  return NextResponse.json({ words, phrases });
}
