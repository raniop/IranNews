import { Article } from './types';

// In-memory article cache (persists across warm serverless invocations)
let articleCache: Article[] = [];
let lastFetchTime: number = 0;

export function getCachedArticles(): Article[] {
  return articleCache;
}

export function setCachedArticles(articles: Article[]): void {
  articleCache = articles;
  lastFetchTime = Date.now();
}

export function getCacheAge(): number {
  return Date.now() - lastFetchTime;
}

export function isCacheValid(maxAgeMs: number = 5 * 60 * 1000): boolean {
  return articleCache.length > 0 && getCacheAge() < maxAgeMs;
}

export function clearCache(): void {
  articleCache = [];
  lastFetchTime = 0;
}
