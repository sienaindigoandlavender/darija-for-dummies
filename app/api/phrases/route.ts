import { NextRequest, NextResponse } from 'next/server';
import { getPhrasesByCategory, getProverbs } from '@/lib/dictionary';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  if (category === 'proverbs') return NextResponse.json(await getProverbs());
  if (category) return NextResponse.json(await getPhrasesByCategory(category));
  return NextResponse.json([]);
}
