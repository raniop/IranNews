import { XMLParser } from 'fast-xml-parser';
import { Article, NewsSource } from '../types';
import { IRAN_KEYWORDS } from '../constants';
import { generateArticleId, stripHTML, parseRSSDate } from '../utils';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
});

interface RSSItem {
  title?: string;
  link?: string | { '#text'?: string; '@_href'?: string };
  description?: string;
  summary?: string;
  'content:encoded'?: string;
  pubDate?: string;
  published?: string;
  'dc:date'?: string;
  updated?: string;
  author?: string;
  'dc:creator'?: string;
  enclosure?: { '@_url'?: string };
  'media:content'?: { '@_url'?: string } | Array<{ '@_url'?: string }>;
  'media:thumbnail'?: { '@_url'?: string } | Array<{ '@_url'?: string }>;
  guid?: string | { '#text'?: string };
}

export async function fetchRSSArticles(
  rssURL: string,
  source: NewsSource,
  filterIranContent: boolean = false
): Promise<Article[]> {
  const res = await fetch(rssURL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; IranNewsBot/1.0)',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const parsed = xmlParser.parse(xml);

  // Handle RSS 2.0 and Atom formats
  let items: RSSItem[] = [];
  if (parsed.rss?.channel?.item) {
    items = Array.isArray(parsed.rss.channel.item)
      ? parsed.rss.channel.item
      : [parsed.rss.channel.item];
  } else if (parsed.feed?.entry) {
    items = Array.isArray(parsed.feed.entry)
      ? parsed.feed.entry
      : [parsed.feed.entry];
  }

  let articles: Article[] = items
    .map(item => parseRSSItem(item, source))
    .filter((a): a is Article => a !== null);

  if (filterIranContent) {
    articles = articles.filter(article => {
      const text = (article.title + ' ' + (article.articleDescription || '')).toLowerCase();
      return IRAN_KEYWORDS.some(kw => text.includes(kw));
    });
  }

  return articles;
}

function parseRSSItem(item: RSSItem, source: NewsSource): Article | null {
  const title = extractText(item.title);
  if (!title) return null;

  let link = '';
  if (typeof item.link === 'string') {
    link = item.link;
  } else if (item.link && typeof item.link === 'object') {
    link = item.link['@_href'] || item.link['#text'] || '';
  }
  if (!link) return null;

  const description = extractText(
    item.description || item.summary || item['content:encoded']
  );

  const dateStr = item.pubDate || item.published || item['dc:date'] || item.updated;
  const publishedDate = dateStr ? parseRSSDate(dateStr) : new Date();

  const author = extractText(item.author || item['dc:creator']);

  const imageURL = extractImageURL(item);

  return {
    id: generateArticleId(link.trim()),
    title: stripHTML(title).trim(),
    articleDescription: description ? stripHTML(description).trim() : undefined,
    url: link.trim(),
    imageURL,
    author: author || undefined,
    publishedDate: publishedDate.toISOString(),
    sourceID: source.id,
    category: source.category,
  };
}

function extractText(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && '#text' in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>)['#text']);
  }
  return null;
}

function extractImageURL(item: RSSItem): string | undefined {
  // Check media:thumbnail
  const thumbnail = item['media:thumbnail'];
  if (thumbnail) {
    const url = Array.isArray(thumbnail) ? thumbnail[0]?.['@_url'] : thumbnail['@_url'];
    if (url) return url;
  }

  // Check media:content
  const mediaContent = item['media:content'];
  if (mediaContent) {
    const url = Array.isArray(mediaContent) ? mediaContent[0]?.['@_url'] : mediaContent['@_url'];
    if (url) return url;
  }

  // Check enclosure
  if (item.enclosure?.['@_url']) {
    const url = item.enclosure['@_url'];
    const lower = url.toLowerCase();
    if (lower.includes('image') || lower.endsWith('.jpg') || lower.endsWith('.png') || lower.endsWith('.webp')) {
      return url;
    }
  }

  // Extract <img src="..."> from description/content HTML
  const htmlContent = item.description || item['content:encoded'] || item.summary || '';
  if (typeof htmlContent === 'string') {
    const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) {
      return imgMatch[1];
    }
  }

  return undefined;
}
