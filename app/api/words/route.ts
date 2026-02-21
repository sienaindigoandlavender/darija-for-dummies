import { NextRequest, NextResponse } from 'next/server';
import { getWordsByCategory, getWordsByTag } from '@/lib/dictionary';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  if (category) return NextResponse.json(await getWordsByCategory(category));
  if (tag) return NextResponse.json(await getWordsByTag(tag));
  return NextResponse.json([]);
}
