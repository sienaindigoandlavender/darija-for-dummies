import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const nexusUrl = process.env.NEXUS_SUPABASE_URL || 'https://soqcqlzerhgacdaggtch.supabase.co';
const nexusKey = process.env.NEXUS_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const supabase = createClient(nexusUrl, nexusKey);

    // Insert into Nexus newsletter_subscribers table
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          source: source || 'everyday-darija',
          site_id: 'everyday-darija',
          subscribed_at: new Date().toISOString(),
          status: 'active',
        },
        { onConflict: 'email,site_id' }
      );

    if (error) {
      console.error('Newsletter subscribe error:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Newsletter API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
