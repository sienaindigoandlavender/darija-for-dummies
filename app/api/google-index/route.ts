import { NextRequest, NextResponse } from "next/server";
import { getAllWords, getWordCategories } from "@/lib/dictionary";

/**
 * Google Indexing API for Darija Dictionary (dharija.space)
 * Quota: 200 URL notifications per day
 *
 * Env vars: GOOGLE_INDEXING_CLIENT_EMAIL, GOOGLE_INDEXING_PRIVATE_KEY, GOOGLE_INDEX_SECRET
 *
 * Usage:
 *   GET  /api/google-index             → preview
 *   POST /api/google-index?mode=live   → submit live pages (default)
 *   POST /api/google-index?mode=all    → all pages including words
 */

const BASE_URL = "https://dharija.space";
const GOOGLE_INDEXING_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

const STATIC_PAGES = [
  "", "/about", "/grammar", "/first-day", "/practice", "/how-to-say",
];

const HOW_TO_SAY_TERMS = [
  "hello", "thank-you", "goodbye", "how-are-you", "please", "sorry", "yes", "no",
  "how-much", "water", "tea", "coffee", "bread", "delicious", "beautiful", "love",
  "where", "bathroom", "taxi", "money", "food", "good", "bad", "big", "small",
  "hot", "cold", "i-dont-understand", "i-dont-speak-arabic", "my-name-is",
  "friend", "family", "mother", "father", "house", "market", "expensive", "cheap",
  "doctor", "help", "eat", "drink", "go", "come", "want", "i-like",
  "god-willing", "welcome", "lets-go", "enough",
];

async function getAccessToken(): Promise<string> {
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) throw new Error("Missing GOOGLE_INDEXING credentials");

  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: GOOGLE_TOKEN_ENDPOINT,
    iat: now,
    exp: now + 3600,
  };
  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const unsignedToken = `${encode(header)}.${encode(payload)}`;
  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsignedToken);
  const signature = sign.sign(privateKey, "base64url");
  const jwt = `${unsignedToken}.${signature}`;

  const tokenRes = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!tokenRes.ok) throw new Error(`Token failed: ${await tokenRes.text()}`);
  return (await tokenRes.json()).access_token;
}

async function submitUrl(
  accessToken: string,
  url: string,
): Promise<{ url: string; success: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch(GOOGLE_INDEXING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ url, type: "URL_UPDATED" }),
    });
    if (res.ok) return { url, success: true, status: res.status };
    return { url, success: false, status: res.status, error: await res.text() };
  } catch (e) {
    return { url, success: false, error: e instanceof Error ? e.message : "Unknown" };
  }
}

export async function GET() {
  const categories = await getWordCategories();
  const allWords = await getAllWords();

  const staticUrls = STATIC_PAGES.map((p) => `${BASE_URL}${p}`);
  const howToSayUrls = HOW_TO_SAY_TERMS.map((t) => `${BASE_URL}/how-to-say/${t}`);
  const categoryUrls = categories.map((c) => `${BASE_URL}/category/${encodeURIComponent(c.id)}`);
  const wordUrls = allWords.map((w) => `${BASE_URL}/word/${w.id}`);

  const priorityUrls = [...staticUrls, ...howToSayUrls, ...categoryUrls];

  return NextResponse.json({
    status: "ready",
    note: "POST to submit. ?mode=live (priority pages), ?mode=all (includes word pages)",
    counts: {
      priority: priorityUrls.length,
      words: wordUrls.length,
      total: priorityUrls.length + wordUrls.length,
    },
    priorityUrls,
  });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.GOOGLE_INDEX_SECRET;
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "live";
  const limit = parseInt(searchParams.get("limit") || "200", 10);

  const categories = await getWordCategories();
  const staticUrls = STATIC_PAGES.map((p) => `${BASE_URL}${p}`);
  const howToSayUrls = HOW_TO_SAY_TERMS.map((t) => `${BASE_URL}/how-to-say/${t}`);
  const categoryUrls = categories.map((c) => `${BASE_URL}/category/${encodeURIComponent(c.id)}`);

  let urlsToSubmit: string[];
  if (mode === "all") {
    const allWords = await getAllWords();
    const wordUrls = allWords.map((w) => `${BASE_URL}/word/${w.id}`);
    urlsToSubmit = [...staticUrls, ...howToSayUrls, ...categoryUrls, ...wordUrls];
  } else {
    urlsToSubmit = [...staticUrls, ...howToSayUrls, ...categoryUrls];
  }

  const cappedUrls = urlsToSubmit.slice(0, Math.min(limit, 200));

  let accessToken: string;
  try {
    accessToken = await getAccessToken();
  } catch (e) {
    return NextResponse.json({ error: "Auth failed", detail: String(e) }, { status: 500 });
  }

  let successCount = 0;
  let failCount = 0;
  let quotaExceeded = false;
  const results: Awaited<ReturnType<typeof submitUrl>>[] = [];

  for (const url of cappedUrls) {
    if (quotaExceeded) break;
    const result = await submitUrl(accessToken, url);
    results.push(result);
    if (result.success) successCount++;
    else { failCount++; if (result.status === 429) quotaExceeded = true; }
    await new Promise((r) => setTimeout(r, 50));
  }

  return NextResponse.json({
    success: !quotaExceeded,
    mode,
    submitted: successCount,
    failed: failCount,
    quotaExceeded,
    totalAvailable: urlsToSubmit.length,
    capped: cappedUrls.length,
    remaining: urlsToSubmit.length - cappedUrls.length,
    results: results.slice(0, 20),
  });
}
