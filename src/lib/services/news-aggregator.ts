import { Article, NewsSource, SourceFetchResult } from '../types';
import { getEnabledSources } from '../sources';
import { fetchRSSArticles } from './rss-parser';
import { fetchScrapedArticles } from './web-scraper';
import { fetchJSONAPIArticles } from './json-api-feed';
import { fetchTelegramArticles } from './telegram-scraper';
import { IRAN_KEYWORDS, WAR_KEYWORDS } from '../constants';

// Sources that are inherently about Iran.
// These get filtered by WAR_KEYWORDS (must be about war/military, not general Iran news).
const IRAN_SPECIFIC_SOURCES = new Set([
  // Pro-regime Iranian media
  'irna', 'fars', 'tasnim', 'irib', 'resalat', 'nournews', 'irantranslate',
  // Opposition Iranian media
  'ncri', 'amadnews', 'iranwire', 'iranfocus', 'kayhanlife', 'chri', 'khrn', 'hengaw',
  // Iran-focused international
  'iranintl',
  // Iranian state Telegram channels
  'presstv', 'irna_en_tg', 'farsna',
  // Iran war-focused Telegram
  'tg_wfwitness',
]);

// Think tanks that are already focused on Iran security/military — no filtering needed
const NO_FILTER_SOURCES = new Set([
  'iranwatch', 'alma', 'criticalthreats', 'isw',
]);

// Sources whose RSS feeds are general and need keyword filtering at the RSS parser level too
const RSS_IRAN_FILTER_SOURCES = new Set([
  'aljazeera', 'bbc', 'timesofisrael', 'ynetnews', 'walla',
]);

function matchesIranKeywords(article: Article): boolean {
  const text = (
    article.title + ' ' +
    (article.articleDescription || '') + ' ' +
    (article.content || '')
  ).toLowerCase();
  return IRAN_KEYWORDS.some(kw => text.includes(kw));
}

function matchesWarKeywords(article: Article): boolean {
  const text = (
    article.title + ' ' +
    (article.articleDescription || '') + ' ' +
    (article.content || '')
  ).toLowerCase();
  return WAR_KEYWORDS.some(kw => text.includes(kw));
}

export async function fetchAllSources(
  sourcesToFetch?: NewsSource[]
): Promise<{ articles: Article[]; failedSources: string[] }> {
  const sources = sourcesToFetch || getEnabledSources();
  const startTime = Date.now();

  // Wrap each source fetch with its own 12s timeout (safety net)
  const results = await Promise.allSettled(
    sources.map(source =>
      Promise.race([
        fetchSource(source),
        new Promise<SourceFetchResult>((_, reject) =>
          setTimeout(() => reject(new Error('Source timeout (12s)')), 12000)
        ),
      ])
    )
  );

  console.log(`⏱️ All sources fetched in ${Date.now() - startTime}ms`);

  const allArticles: Article[] = [];
  const failedSources: string[] = [];

  results.forEach((result, i) => {
    const sourceId = sources[i].id;
    if (result.status === 'fulfilled') {
      if (result.value.error) {
        failedSources.push(sourceId);
        console.error(`❌ [${sourceId}] ${result.value.error}`);
      }
      allArticles.push(...result.value.articles);
    } else {
      failedSources.push(sourceId);
      console.error(`❌ [${sourceId}] ${result.reason}`);
    }
  });

  // Deduplicate by URL
  const seen = new Set<string>();
  const deduplicated = allArticles.filter(a => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  // Sort by date (newest first)
  deduplicated.sort((a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  return { articles: deduplicated, failedSources };
}

async function fetchSource(source: NewsSource): Promise<SourceFetchResult> {
  const filterRSS = RSS_IRAN_FILTER_SOURCES.has(source.id);

  try {
    let articles: Article[];
    const method = source.rssURL ? 'RSS' : source.jsonAPIURL ? 'JSON_API' : source.fetchMethod === 'telegram' ? 'TELEGRAM' : 'SCRAPE';
    const url = source.rssURL || source.jsonAPIURL || source.baseURL;
    console.log(`📡 [${source.id}] Fetching... method=${method} url=${url}`);

    // Try RSS first
    if (source.rssURL) {
      try {
        articles = await fetchRSSArticles(source.rssURL, source, filterRSS);
        console.log(`✅ [${source.id}] RSS success: ${articles.length} articles`);
      } catch (rssError) {
        console.warn(`⚠️ [${source.id}] RSS failed, trying scrape fallback...`);
        if (source.scrapingConfig) {
          articles = await fetchScrapedArticles(source.baseURL, source.scrapingConfig, source);
          console.log(`✅ [${source.id}] Scrape fallback: ${articles.length} articles`);
        } else {
          throw rssError;
        }
      }
    }
    // JSON API
    else if (source.jsonAPIURL) {
      articles = await fetchJSONAPIArticles(source.jsonAPIURL, source);
      console.log(`✅ [${source.id}] JSON API success: ${articles.length} articles`);
    }
    // Telegram
    else if (source.fetchMethod === 'telegram') {
      articles = await fetchTelegramArticles(source);
      console.log(`✅ [${source.id}] Telegram success: ${articles.length} articles`);
    }
    // Scrape only
    else if (source.scrapingConfig) {
      articles = await fetchScrapedArticles(source.baseURL, source.scrapingConfig, source);
      console.log(`✅ [${source.id}] Scrape success: ${articles.length} articles`);
    } else {
      return { sourceID: source.id, articles: [], error: 'No fetch method' };
    }

    // Two-tier filtering:
    // 1. Think tanks (iranwatch, alma, criticalthreats, isw) → no filter (already war-focused)
    // 2. Iran-specific sources → WAR filter (skip economy/culture/sport articles)
    // 3. Everything else → IRAN filter (must mention Iran at all)
    if (!NO_FILTER_SOURCES.has(source.id)) {
      const before = articles.length;
      if (IRAN_SPECIFIC_SOURCES.has(source.id)) {
        articles = articles.filter(matchesWarKeywords);
        if (before !== articles.length) {
          console.log(`⚔️ [${source.id}] War filter: ${before} → ${articles.length} articles`);
        }
      } else {
        articles = articles.filter(matchesIranKeywords);
        if (before !== articles.length) {
          console.log(`🔎 [${source.id}] Iran filter: ${before} → ${articles.length} articles`);
        }
      }
    }

    if (articles.length === 0) {
      console.warn(`⚠️ [${source.id}] Returned 0 articles`);
    }

    return { sourceID: source.id, articles };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { sourceID: source.id, articles: [], error: msg };
  }
}
