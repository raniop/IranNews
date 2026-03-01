import { Article, NewsSource, SourceFetchResult } from '../types';
import { getEnabledSources } from '../sources';
import { fetchRSSArticles } from './rss-parser';
import { fetchScrapedArticles } from './web-scraper';
import { fetchJSONAPIArticles } from './json-api-feed';
import { fetchTelegramArticles } from './telegram-scraper';

// Sources with general feeds that need Iran keyword filtering
const IRAN_FILTER_SOURCES = new Set(['aljazeera', 'bbc', 'timesofisrael', 'ynetnews', 'walla']);

export async function fetchAllSources(
  sourcesToFetch?: NewsSource[]
): Promise<{ articles: Article[]; failedSources: string[] }> {
  const sources = sourcesToFetch || getEnabledSources();

  const results = await Promise.allSettled(
    sources.map(source => fetchSource(source))
  );

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
  const filterIran = IRAN_FILTER_SOURCES.has(source.id);

  try {
    let articles: Article[];
    const method = source.rssURL ? 'RSS' : source.jsonAPIURL ? 'JSON_API' : source.fetchMethod === 'telegram' ? 'TELEGRAM' : 'SCRAPE';
    const url = source.rssURL || source.jsonAPIURL || source.baseURL;
    console.log(`📡 [${source.id}] Fetching... method=${method} url=${url}`);

    // Try RSS first
    if (source.rssURL) {
      try {
        articles = await fetchRSSArticles(source.rssURL, source, filterIran);
        console.log(`✅ [${source.id}] RSS success: ${articles.length} articles`);
      } catch (rssError) {
        console.warn(`⚠️ [${source.id}] RSS failed, trying scrape fallback...`);
        // Fallback to scraping
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

    if (articles.length === 0) {
      console.warn(`⚠️ [${source.id}] Returned 0 articles`);
    }

    return { sourceID: source.id, articles };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { sourceID: source.id, articles: [], error: msg };
  }
}
