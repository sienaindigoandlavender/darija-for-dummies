export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getContentSites, getLegalPages } from '@/lib/nexus';

export async function GET() {
  const [contentSites, legalPages] = await Promise.all([
    getContentSites(),
    getLegalPages(),
  ]);
  return NextResponse.json({ contentSites, legalPages });
}
