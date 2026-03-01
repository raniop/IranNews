// Visitor tracker with Supabase persistence
// Live visitors: in-memory (transient, 30s timeout)
// Page views + history: persisted in Supabase

import { getSupabase } from '../supabase';

interface VisitorInfo {
  lastSeen: number;
  page: string;
  referrer?: string;
}

// In-memory for live visitor tracking (transient by nature)
const visitors = new Map<string, VisitorInfo>();
const TIMEOUT_MS = 30_000;

// Cache for Supabase queries (avoid hitting DB every 3s)
let cachedTotal: number | null = null;
let cachedHistory: { time: string; views: number }[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 15_000; // 15 seconds

function cleanStale() {
  const now = Date.now();
  for (const [id, info] of visitors) {
    if (now - info.lastSeen > TIMEOUT_MS) {
      visitors.delete(id);
    }
  }
}

export function heartbeat(visitorId: string, page: string, referrer?: string): void {
  const isNew = !visitors.has(visitorId);
  visitors.set(visitorId, {
    lastSeen: Date.now(),
    page,
    referrer,
  });

  if (isNew) {
    // Persist to Supabase (fire-and-forget)
    getSupabase()
      .from('page_views')
      .insert({ visitor_id: visitorId, page, referrer })
      .then(({ error }) => {
        if (error) console.error('Supabase insert error:', error.message);
      });

    // Invalidate cache so next getStats() fetches fresh data
    cachedTotal = null;
    cachedHistory = null;
  }
}

async function fetchTotalPageViews(): Promise<number> {
  const { count, error } = await getSupabase()
    .from('page_views')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Supabase count error:', error.message);
    return 0;
  }
  return count ?? 0;
}

async function fetchHistory(): Promise<{ time: string; views: number }[]> {
  // Get page views from last 24 hours, grouped by 5-min buckets
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await getSupabase()
    .from('page_views')
    .select('created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase history error:', error.message);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Group into 5-minute buckets
  const BUCKET_MS = 5 * 60 * 1000;
  const buckets = new Map<number, number>();

  for (const row of data) {
    const ts = new Date(row.created_at).getTime();
    const bucketStart = Math.floor(ts / BUCKET_MS) * BUCKET_MS;
    buckets.set(bucketStart, (buckets.get(bucketStart) || 0) + 1);
  }

  return Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([ts, views]) => ({
      time: new Date(ts).toISOString(),
      views,
    }));
}

export async function getStats() {
  cleanStale();

  const now = Date.now();
  const cacheExpired = now - cacheTimestamp > CACHE_TTL;

  // Fetch from Supabase if cache expired
  if (cacheExpired || cachedTotal === null || cachedHistory === null) {
    const [total, history] = await Promise.all([
      fetchTotalPageViews(),
      fetchHistory(),
    ]);
    cachedTotal = total;
    cachedHistory = history;
    cacheTimestamp = now;
  }

  // Count visitors per page (from in-memory live data)
  const pageBreakdown: Record<string, number> = {};
  for (const [, info] of visitors) {
    pageBreakdown[info.page] = (pageBreakdown[info.page] || 0) + 1;
  }

  return {
    liveVisitors: visitors.size,
    pageBreakdown,
    totalPageViews: cachedTotal,
    history: cachedHistory,
  };
}
