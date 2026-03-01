// Visitor tracker with Supabase persistence
// Live visitors: in-memory (transient, 30s timeout)
// Page views + history: persisted in Supabase (falls back to in-memory)

import { getSupabase } from '../supabase';

interface VisitorInfo {
  lastSeen: number;
  page: string;
  referrer?: string;
}

// In-memory for live visitor tracking (transient by nature)
const visitors = new Map<string, VisitorInfo>();
const TIMEOUT_MS = 30_000;

// In-memory fallback counters (used when Supabase unavailable)
let memoryPageViews = 0;
interface PageViewBucket { ts: number; views: number; }
const BUCKET_SIZE = 5 * 60 * 1000;
const MAX_BUCKETS = 288;
const memoryBuckets: PageViewBucket[] = [];

// Cache for Supabase queries (avoid hitting DB every 3s)
let cachedTotal: number | null = null;
let cachedHistory: { time: string; views: number }[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 15_000;

function cleanStale() {
  const now = Date.now();
  for (const [id, info] of visitors) {
    if (now - info.lastSeen > TIMEOUT_MS) {
      visitors.delete(id);
    }
  }
}

function getCurrentBucket(): PageViewBucket {
  const now = Date.now();
  const bucketStart = Math.floor(now / BUCKET_SIZE) * BUCKET_SIZE;
  if (memoryBuckets.length === 0 || memoryBuckets[memoryBuckets.length - 1].ts !== bucketStart) {
    const bucket = { ts: bucketStart, views: 0 };
    memoryBuckets.push(bucket);
    while (memoryBuckets.length > MAX_BUCKETS) memoryBuckets.shift();
    return bucket;
  }
  return memoryBuckets[memoryBuckets.length - 1];
}

export function heartbeat(visitorId: string, page: string, referrer?: string): void {
  const isNew = !visitors.has(visitorId);
  visitors.set(visitorId, {
    lastSeen: Date.now(),
    page,
    referrer,
  });

  if (isNew) {
    // Always update in-memory counters
    memoryPageViews++;
    getCurrentBucket().views++;

    // Also persist to Supabase if available (fire-and-forget)
    const sb = getSupabase();
    if (sb) {
      sb.from('page_views')
        .insert({ visitor_id: visitorId, page, referrer })
        .then(({ error }) => {
          if (error) console.error('Supabase insert error:', error.message);
        });
      cachedTotal = null;
      cachedHistory = null;
    }
  }
}

async function fetchFromSupabase(): Promise<{ total: number; history: { time: string; views: number }[] } | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const [countResult, historyResult] = await Promise.all([
      sb.from('page_views').select('*', { count: 'exact', head: true }),
      sb.from('page_views')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true }),
    ]);

    if (countResult.error || historyResult.error) return null;

    const total = countResult.count ?? 0;

    // Group into 5-minute buckets
    const buckets = new Map<number, number>();
    for (const row of historyResult.data || []) {
      const ts = new Date(row.created_at).getTime();
      const bucketStart = Math.floor(ts / BUCKET_SIZE) * BUCKET_SIZE;
      buckets.set(bucketStart, (buckets.get(bucketStart) || 0) + 1);
    }

    const history = Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([ts, views]) => ({ time: new Date(ts).toISOString(), views }));

    return { total, history };
  } catch {
    return null;
  }
}

export async function getStats() {
  cleanStale();

  let totalPageViews = memoryPageViews;
  let history: { time: string; views: number }[] = [];

  // Try Supabase
  const now = Date.now();
  const cacheExpired = now - cacheTimestamp > CACHE_TTL;

  if (cacheExpired || cachedTotal === null || cachedHistory === null) {
    const sbData = await fetchFromSupabase();
    if (sbData) {
      cachedTotal = sbData.total;
      cachedHistory = sbData.history;
      cacheTimestamp = now;
    }
  }

  if (cachedTotal !== null && cachedHistory !== null) {
    totalPageViews = cachedTotal;
    history = cachedHistory;
  } else {
    // Fallback to in-memory history
    const cutoff = now - 24 * 60 * 60 * 1000;
    history = memoryBuckets
      .filter(b => b.ts >= cutoff)
      .map(b => ({ time: new Date(b.ts).toISOString(), views: b.views }));
  }

  const pageBreakdown: Record<string, number> = {};
  for (const [, info] of visitors) {
    pageBreakdown[info.page] = (pageBreakdown[info.page] || 0) + 1;
  }

  return {
    liveVisitors: visitors.size,
    pageBreakdown,
    totalPageViews,
    history,
  };
}
