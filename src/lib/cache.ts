import { Article } from './types';

// In-memory article cache (persists across warm serverless invocations)
let articleCache: Article[] = [];
let lastFetchTime: number = 0;
let isRefreshing = false;

export function getCachedArticles(): Article[] {
  return articleCache;
}

export function hasCachedArticles(): boolean {
  return articleCache.length > 0;
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

export function isCacheStale(maxAgeMs: number = 5 * 60 * 1000): boolean {
  return articleCache.length > 0 && getCacheAge() >= maxAgeMs;
}

export function isBackgroundRefreshing(): boolean {
  return isRefreshing;
}

export function setBackgroundRefreshing(value: boolean): void {
  isRefreshing = value;
}

export function getLastFetchTime(): number {
  return lastFetchTime;
}

export function getLastFetchISO(): string | null {
  return lastFetchTime > 0 ? new Date(lastFetchTime).toISOString() : null;
}

export function clearCache(): void {
  articleCache = [];
  lastFetchTime = 0;
}
