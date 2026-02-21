import { NextResponse } from 'next/server';
import { getAllWords } from '@/lib/dictionary';

function dayIndex(): number {
  return Math.floor(Date.now() / 86400000);
}

export async function GET() {
  const words = await getAllWords();
  const withNotes = words.filter(w => w.cultural_note);
  if (withNotes.length === 0) return NextResponse.json({ word: null });
  const index = dayIndex() % withNotes.length;
  return NextResponse.json({ word: withNotes[index] }, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
