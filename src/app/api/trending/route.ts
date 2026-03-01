import { NextResponse } from 'next/server';
import { computeTrending } from '@/lib/services/trending-engine';
import { getCachedArticles, isCacheValid } from '@/lib/cache';
import { fetchAllSources } from '@/lib/services/news-aggregator';
import { setCachedArticles } from '@/lib/cache';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
  // Get articles from cache or fetch fresh
  let articles = getCachedArticles();

  if (!isCacheValid() || articles.length === 0) {
    const result = await fetchAllSources();
    articles = result.articles;
    setCachedArticles(articles);
  }

  const topics = computeTrending(articles);

  return NextResponse.json({
    topics,
    computedAt: new Date().toISOString(),
    articleCount: articles.length,
  });
}
