import { createHash } from 'crypto';

/** Generate a deterministic article ID from its URL */
export function generateArticleId(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 12);
}

/** Strip HTML tags from a string */
export function stripHTML(html: string): string {
  if (!html.includes('<')) return html;
  return html.replace(/<[^>]+>/g, '').trim();
}

/** Format a date as relative time (e.g., "5 min ago", "2 hours ago") */
export function relativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec} sec ago`;
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Parse various date formats from RSS feeds */
export function parseRSSDate(dateStr: string): Date {
  // Try standard Date parse first
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  // Try common RSS date formats
  const formats = [
    // RFC 2822: "Mon, 01 Jan 2024 12:00:00 +0000"
    /^\w{3},\s+\d{2}\s+\w{3}\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+[+-]\d{4}$/,
    // ISO 8601
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
  ];

  for (const fmt of formats) {
    if (fmt.test(dateStr)) {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  }

  return new Date(); // fallback to now
}

/** Resolve a relative URL against a base URL */
export function resolveURL(href: string, baseURL?: string): string {
  if (href.startsWith('http')) return href;
  if (!baseURL) return href;

  if (href.startsWith('/')) {
    try {
      const base = new URL(baseURL);
      return `${base.protocol}//${base.host}${href}`;
    } catch {
      return baseURL + href;
    }
  }

  return baseURL.endsWith('/') ? baseURL + href : baseURL + '/' + href;
}

/** Check if a title passes the article filter */
export function isValidArticleTitle(title: string): boolean {
  const lower = title.toLowerCase().trim();
  if (title.length < 20 || title.length > 500) return false;
  if (lower.includes('cookie')) return false;
  if (lower.includes('subscribe')) return false;
  if (lower.includes('sign in')) return false;
  if (lower.includes('menu')) return false;
  if (lower.includes('follow us')) return false;
  if (lower.includes('all rights reserved')) return false;

  const genericTitles = new Set([
    'reports and statistics', 'about us', 'contact us', 'home',
    'news', 'articles', 'latest news', 'read more', 'more',
    'search', 'login', 'register', 'privacy policy', 'terms',
  ]);
  if (genericTitles.has(lower)) return false;

  return true;
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
