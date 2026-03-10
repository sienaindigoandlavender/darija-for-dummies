// ============================================
// Formerly Nexus — now self-contained
// All content hardcoded with Darija Dictionary values
// No external Supabase dependency
// ============================================

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

const SITE_CONFIG: NexusSite = {
  site_id: "darija-for-dummies",
  site_name: "Darija Dictionary",
  site_url: "https://dharija.space",
  legal_entity: "Darija Dictionary",
  contact_email: "hello@slowmorocco.com",
};

const LEGAL_PAGES: LegalPage[] = [
  {
    id: 1,
    page_slug: "privacy",
    page_title: "Privacy Policy",
    body_html: `<h2>Introduction</h2>
<p>Darija Dictionary ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you visit https://dharija.space.</p>
<h2>Information We Collect</h2>
<p>Information you provide: contact information (name, email) and communications you send us. Information collected automatically: device information, usage data, and cookies.</p>
<h2>How We Use Your Information</h2>
<p>To communicate with you about inquiries, improve our website and services, and send occasional updates if you have opted in.</p>
<h2>Your Rights</h2>
<p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at hello@slowmorocco.com.</p>
<h2>Data Security</h2>
<p>We implement appropriate security measures including SSL/TLS encryption.</p>
<h2>Contact</h2>
<p>Darija Dictionary, 37 Derb Fhal Zefriti, Laksour, Marrakech 40000, Morocco. Email: hello@slowmorocco.com</p>`,
  },
  {
    id: 2,
    page_slug: "terms",
    page_title: "Terms of Service",
    body_html: `<h2>Agreement</h2>
<p>By accessing or using https://dharija.space, operated by Darija Dictionary, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
<h2>Services</h2>
<p>Darija Dictionary provides services as described on our website. All content, features, and functionality are owned by Darija Dictionary and are protected by international copyright, trademark, and other intellectual property laws.</p>
<h2>User Responsibilities</h2>
<p>You agree to provide accurate and complete information, maintain the confidentiality of your account, comply with all applicable laws, and not misuse or attempt to disrupt our services.</p>
<h2>Intellectual Property</h2>
<p>All content on this site, including text, graphics, logos, images, audio, and design, is the property of Darija Dictionary and is protected by copyright laws.</p>
<h2>Limitation of Liability</h2>
<p>To the maximum extent permitted by law, Darija Dictionary shall not be liable for indirect, incidental, or consequential damages arising from use of our services.</p>
<h2>Governing Law</h2>
<p>These terms are governed by the laws of Morocco. Any disputes shall be resolved in the courts of Marrakech.</p>
<h2>Contact</h2>
<p>Darija Dictionary, 37 Derb Fhal Zefriti, Laksour, Marrakech 40000, Morocco. Email: hello@slowmorocco.com</p>`,
  },
  {
    id: 3,
    page_slug: "disclaimer",
    page_title: "Disclaimer",
    body_html: `<h2>General</h2>
<p>The information provided on https://dharija.space by Darija Dictionary is for general informational and educational purposes only. This content does not constitute professional linguistic, academic, or legal advice.</p>
<h2>Accuracy</h2>
<p>While we make every effort to ensure information is accurate and up-to-date, we cannot guarantee completeness. Moroccan Darija varies by region and context.</p>
<h2>Limitation of Liability</h2>
<p>Darija Dictionary shall not be liable for any damages arising from use or inability to use this site, reliance on information provided, or errors or omissions in content.</p>
<h2>Contact</h2>
<p>Darija Dictionary, 37 Derb Fhal Zefriti, Laksour, Marrakech 40000, Morocco. Email: hello@slowmorocco.com</p>`,
  },
  {
    id: 4,
    page_slug: "intellectual-property",
    page_title: "Intellectual Property",
    body_html: `<h2>Ownership</h2>
<p>All intellectual property on https://dharija.space is owned by or licensed to Darija Dictionary.</p>
<h2>Copyrighted Material</h2>
<p>Website design and layout, written content and copy, audio recordings, photography and images, and descriptions are all protected.</p>
<h2>Permitted Use</h2>
<p>You may view content for personal, non-commercial use, share links to our pages, print pages for personal reference, and quote brief excerpts with proper attribution.</p>
<h2>Prohibited Use</h2>
<p>Without written permission, you may not copy, reproduce, or duplicate content, modify or create derivative works, distribute or use content commercially, remove copyright notices, or scrape content using automated tools.</p>
<h2>Permission Requests</h2>
<p>To request permission to use our content, contact hello@slowmorocco.com with subject line 'IP License Request'.</p>
<h2>Contact</h2>
<p>Darija Dictionary, 37 Derb Fhal Zefriti, Laksour, Marrakech 40000, Morocco. Email: hello@slowmorocco.com</p>`,
  },
];

export async function getLegalPages(): Promise<LegalPage[]> {
  return LEGAL_PAGES;
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  return LEGAL_PAGES.find((p) => p.page_slug === slug) || null;
}

export async function getContentSites(): Promise<ContentSite[]> {
  return [];
}

export async function getSiteConfig(_siteId: string): Promise<NexusSite> {
  return SITE_CONFIG;
}

export async function getPoweredBy(): Promise<PoweredBy> {
  return { label: "Slow Morocco", url: "https://slowmorocco.com" };
}

// No-op — variables already resolved in hardcoded content
export function resolveVariables(html: string, _site: NexusSite): string {
  return html;
}
