export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getPhrasesByCategory } from '@/lib/dictionary';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  if (category) {
    const phrases = await getPhrasesByCategory(category);
    return NextResponse.json(phrases);
  }
  return NextResponse.json([]);
}
