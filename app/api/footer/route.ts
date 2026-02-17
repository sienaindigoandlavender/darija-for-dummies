export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getContentSites, getLegalPages, getPoweredBy, getSiteConfig } from '@/lib/nexus';

export async function GET() {
  const siteId = process.env.SITE_ID || 'darija-for-dummies';
  const [contentSites, legalPages, poweredBy, siteConfig] = await Promise.all([
    getContentSites(),
    getLegalPages(),
    getPoweredBy(),
    getSiteConfig(siteId),
  ]);
  return NextResponse.json({ contentSites, legalPages, poweredBy, siteConfig });
}
