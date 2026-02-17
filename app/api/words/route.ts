export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getWordsByCategory, getWordsByTag } from '@/lib/dictionary';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  const tag = request.nextUrl.searchParams.get('tag');
  
  if (category) {
    const words = await getWordsByCategory(category);
    return NextResponse.json(words);
  }
  if (tag) {
    const words = await getWordsByTag(tag);
    return NextResponse.json(words);
  }
  return NextResponse.json([]);
}
