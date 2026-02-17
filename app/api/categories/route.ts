export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getWordCategories, getPhraseCategories, getMetadata } from '@/lib/dictionary';

export async function GET() {
  const [wordCategories, phraseCategories, meta] = await Promise.all([
    getWordCategories(),
    getPhraseCategories(),
    getMetadata(),
  ]);
  return NextResponse.json({ wordCategories, phraseCategories, meta });
}
