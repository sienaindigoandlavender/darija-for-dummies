// Save as: app/api/debug-words/route.ts
// Deploy this temporarily to see what's happening with pagination

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const client = createClient(SUPABASE_URL, SUPABASE_KEY);
  const step = 200;
  const batches: { from: number; to: number; returned: number; firstId?: string; lastId?: string; error?: string }[] = [];
  const all: any[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await client
      .from('darija_words')
      .select('id, order')
      .eq('published', true)
      .order('order')
      .range(from, from + step - 1);

    const batch = {
      from,
      to: from + step - 1,
      returned: data?.length || 0,
      firstId: data?.[0]?.id,
      lastId: data?.[data?.length - 1]?.id,
      error: error?.message,
    };
    batches.push(batch);

    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < step) break;
    from += step;

    // Safety: don't loop forever
    if (batches.length > 25) break;
  }

  return NextResponse.json({
    totalFetched: all.length,
    batchCount: batches.length,
    batches,
    firstWord: all[0]?.id,
    lastWord: all[all.length - 1]?.id,
    supabaseUrl: SUPABASE_URL ? 'SET' : 'MISSING',
  });
}
