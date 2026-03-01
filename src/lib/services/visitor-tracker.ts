// Visitor tracker with Supabase persistence
// Live visitors: in-memory (transient, 30s timeout)
// Page views + history: persisted in Supabase

import { supabase } from '../supabase';

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
const CACHE_TTL = 15_000;
const BUCKET_SIZE = 5 * 60 * 1000;

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
    supabase
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

export async function getStats() {
  cleanStale();

  const now = Date.now();
  const cacheExpired = now - cacheTimestamp > CACHE_TTL;

  if (cacheExpired || cachedTotal === null || cachedHistory === null) {
    try {
      const [countResult, historyResult] = await Promise.all([
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase
          .from('page_views')
          .select('created_at')
          .gte('created_at', new Date(now - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: true }),
      ]);

      if (!countResult.error) {
        cachedTotal = countResult.count ?? 0;
      }

      if (!historyResult.error && historyResult.data) {
        const buckets = new Map<number, number>();
        for (const row of historyResult.data) {
          const ts = new Date(row.created_at).getTime();
          const bucketStart = Math.floor(ts / BUCKET_SIZE) * BUCKET_SIZE;
          buckets.set(bucketStart, (buckets.get(bucketStart) || 0) + 1);
        }
        cachedHistory = Array.from(buckets.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([ts, views]) => ({ time: new Date(ts).toISOString(), views }));
      }

      cacheTimestamp = now;
    } catch (e) {
      console.error('Supabase query error:', e);
    }
  }

  const pageBreakdown: Record<string, number> = {};
  for (const [, info] of visitors) {
    pageBreakdown[info.page] = (pageBreakdown[info.page] || 0) + 1;
  }

  return {
    liveVisitors: visitors.size,
    pageBreakdown,
    totalPageViews: cachedTotal ?? 0,
    history: cachedHistory ?? [],
  };
}
