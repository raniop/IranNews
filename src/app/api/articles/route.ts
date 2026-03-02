import { NextResponse } from 'next/server';
import { fetchAllSources } from '@/lib/services/news-aggregator';
import {
  getCachedArticles,
  setCachedArticles,
  isCacheValid,
  isCacheStale,
  hasCachedArticles,
  isBackgroundRefreshing,
  setBackgroundRefreshing,
  getLastFetchISO,
} from '@/lib/cache';
import { preTranslateArticles } from '@/lib/services/title-translator';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Background refresh: fetch new articles and update cache (non-blocking)
function triggerBackgroundRefresh() {
  if (isBackgroundRefreshing()) return;
  setBackgroundRefreshing(true);
  console.log('🔄 [cache] Background refresh started');

  fetchAllSources()
    .then(async ({ articles }) => {
      setCachedArticles(articles);
      console.log(`🔄 [cache] Background refresh done: ${articles.length} articles`);

      // Pre-translate top 50 articles to Hebrew in the background
      preTranslateArticles(articles.slice(0, 50)).catch(() => {});
    })
    .catch((err) => {
      console.error('🔄 [cache] Background refresh failed:', err);
    })
    .finally(() => {
      setBackgroundRefreshing(false);
    });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';
  const category = searchParams.get('category');

  // === STALE-WHILE-REVALIDATE ===
  // If cache is valid (fresh), return it immediately
  if (!force && isCacheValid()) {
    let articles = getCachedArticles();
    if (category) {
      articles = articles.filter((a) => a.category === category);
    }
    return NextResponse.json({
      articles,
      total: articles.length,
      failedSources: [],
      fetchedAt: getLastFetchISO() || new Date().toISOString(),
      cached: true,
    });
  }

  // If cache is stale but exists, return stale data AND trigger background refresh
  if (!force && isCacheStale()) {
    triggerBackgroundRefresh();

    let articles = getCachedArticles();
    if (category) {
      articles = articles.filter((a) => a.category === category);
    }
    return NextResponse.json({
      articles,
      total: articles.length,
      failedSources: [],
      fetchedAt: getLastFetchISO() || new Date().toISOString(),
      cached: true,
      refreshing: true,
    });
  }

  // === COLD START: no cache at all, or forced refresh ===
  const { articles, failedSources } = await fetchAllSources();

  // Update cache
  setCachedArticles(articles);

  // Pre-translate top 50 articles to Hebrew (non-blocking)
  preTranslateArticles(articles.slice(0, 50)).catch(() => {});

  // Apply category filter
  let filteredArticles = articles;
  if (category) {
    filteredArticles = articles.filter((a) => a.category === category);
  }

  return NextResponse.json({
    articles: filteredArticles,
    total: filteredArticles.length,
    failedSources,
    fetchedAt: new Date().toISOString(),
    cached: false,
  });
}
