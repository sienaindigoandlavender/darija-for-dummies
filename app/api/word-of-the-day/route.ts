export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase not configured');
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }) },
  });
}

// Deterministic "random" based on date — same word all day, changes at midnight UTC
function dayIndex(): number {
  return Math.floor(Date.now() / 86400000);
}

export async function GET() {
  try {
    const client = getClient();

    // Step 1: Get count of words with cultural notes (lightweight — no data transferred)
    const { count } = await client
      .from('darija_words')
      .select('id', { count: 'exact', head: true })
      .eq('published', true)
      .not('cultural_note', 'is', null)
      .neq('cultural_note', '');

    if (!count || count === 0) {
      return NextResponse.json({ word: null }, {
        headers: { 'Cache-Control': 'public, max-age=3600' },
      });
    }

    // Step 2: Pick today's index and fetch only that one row
    const index = dayIndex() % count;
    const { data } = await client
      .from('darija_words')
      .select('*')
      .eq('published', true)
      .not('cultural_note', 'is', null)
      .neq('cultural_note', '')
      .order('id')
      .range(index, index);

    const word = data?.[0] || null;

    return NextResponse.json({ word }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'CDN-Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e) {
    return NextResponse.json({ word: null }, { status: 500 });
  }
}
