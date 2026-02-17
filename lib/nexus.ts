import { createClient } from '@supabase/supabase-js';

const NEXUS_URL = process.env.NEXUS_SUPABASE_URL || '';
const NEXUS_KEY = process.env.NEXUS_SUPABASE_ANON_KEY || '';

function getNexus() {
  if (!NEXUS_URL || !NEXUS_KEY) return null;
  return createClient(NEXUS_URL, NEXUS_KEY);
}

export interface LegalPage {
  id: number;
  page_slug: string;
  page_title: string;
  body_html: string;
}

export interface ContentSite {
  id: number;
  site_label: string;
  site_url: string;
  display_order: number;
  is_active: boolean;
}

export interface NexusSite {
  site_id: string;
  site_name: string;
  site_url: string;
  legal_entity: string;
  contact_email: string;
}

export interface PoweredBy {
  label: string;
  url: string;
}

export async function getLegalPages(): Promise<LegalPage[]> {
  const nexus = getNexus();
  if (!nexus) return [];
  const { data } = await nexus
    .from('nexus_legal_pages')
    .select('*')
    .order('page_slug');
  return (data || []) as LegalPage[];
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  const nexus = getNexus();
  if (!nexus) return null;
  const { data } = await nexus
    .from('nexus_legal_pages')
    .select('*')
    .eq('page_slug', slug)
    .single();
  return data as LegalPage | null;
}

export async function getContentSites(): Promise<ContentSite[]> {
  const nexus = getNexus();
  if (!nexus) return [];
  const { data } = await nexus
    .from('nexus_content_sites')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  return (data || []) as ContentSite[];
}

export async function getSiteConfig(siteId: string): Promise<NexusSite | null> {
  const nexus = getNexus();
  if (!nexus) return null;
  const { data } = await nexus
    .from('nexus_sites')
    .select('*')
    .eq('site_id', siteId)
    .single();
  return data as NexusSite | null;
}

export async function getPoweredBy(): Promise<PoweredBy | null> {
  const nexus = getNexus();
  if (!nexus) return { label: 'Slow Morocco', url: 'https://slowmorocco.com' };
  const { data } = await nexus
    .from('nexus_powered_by')
    .select('*')
    .single();
  if (!data) return { label: 'Slow Morocco', url: 'https://slowmorocco.com' };
  return data as PoweredBy;
}

// Resolve {{variables}} in legal page HTML
export function resolveVariables(html: string, site: NexusSite): string {
  return html
    .replace(/\{\{site_name\}\}/g, site.site_name)
    .replace(/\{\{site_url\}\}/g, site.site_url)
    .replace(/\{\{legal_entity\}\}/g, site.legal_entity)
    .replace(/\{\{contact_email\}\}/g, site.contact_email);
}
