import { NextResponse } from 'next/server';
import { fetchAllSources } from '@/lib/services/news-aggregator';
import { getCachedArticles, setCachedArticles, isCacheValid } from '@/lib/cache';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';
  const category = searchParams.get('category');

  // Return cache if valid and not forced refresh
  if (!force && isCacheValid()) {
    let articles = getCachedArticles();
    if (category) {
      articles = articles.filter(a => a.category === category);
    }
    return NextResponse.json({
      articles,
      failedSources: [],
      fetchedAt: new Date().toISOString(),
      cached: true,
    });
  }

  // Fetch fresh data from all sources
  const { articles, failedSources } = await fetchAllSources();

  // Update cache
  setCachedArticles(articles);

  // Apply category filter
  let filteredArticles = articles;
  if (category) {
    filteredArticles = articles.filter(a => a.category === category);
  }

  return NextResponse.json({
    articles: filteredArticles,
    failedSources,
    fetchedAt: new Date().toISOString(),
    cached: false,
  });
}
