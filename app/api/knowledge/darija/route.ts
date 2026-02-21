import { NextResponse } from 'next/server';
import { getAllWords } from '@/lib/dictionary';

export async function GET() {
  return NextResponse.json(await getAllWords());
}
