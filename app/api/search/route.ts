import { NextRequest, NextResponse } from 'next/server';
import { searchWords, searchPhrases } from '@/lib/dictionary';

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q') || '';
  const [words, phrases] = await Promise.all([searchWords(q), searchPhrases(q)]);
  return NextResponse.json({ words, phrases });
}
