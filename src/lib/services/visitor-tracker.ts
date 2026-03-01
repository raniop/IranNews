// In-memory visitor tracker using heartbeat mechanism
// Each visitor sends a heartbeat every 15 seconds
// Visitors are considered "gone" after 30 seconds of no heartbeat

interface VisitorInfo {
  lastSeen: number;
  page: string;
  referrer?: string;
}

const visitors = new Map<string, VisitorInfo>();
const TIMEOUT_MS = 30_000; // 30 seconds

// Page view history for the dashboard (last 24h in 5-min buckets)
interface PageViewBucket {
  ts: number; // start of 5-min bucket
  views: number;
}

const BUCKET_SIZE = 5 * 60 * 1000; // 5 minutes
const MAX_BUCKETS = 288; // 24 hours
const pageViewBuckets: PageViewBucket[] = [];
let totalPageViews = 0;

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

  if (pageViewBuckets.length === 0 || pageViewBuckets[pageViewBuckets.length - 1].ts !== bucketStart) {
    const bucket = { ts: bucketStart, views: 0 };
    pageViewBuckets.push(bucket);
    // Trim old buckets
    while (pageViewBuckets.length > MAX_BUCKETS) {
      pageViewBuckets.shift();
    }
    return bucket;
  }

  return pageViewBuckets[pageViewBuckets.length - 1];
}

export function heartbeat(visitorId: string, page: string, referrer?: string): void {
  const isNew = !visitors.has(visitorId);
  visitors.set(visitorId, {
    lastSeen: Date.now(),
    page,
    referrer,
  });

  if (isNew) {
    totalPageViews++;
    getCurrentBucket().views++;
  }
}

export function getStats() {
  cleanStale();

  // Count visitors per page
  const pageBreakdown: Record<string, number> = {};
  for (const [, info] of visitors) {
    pageBreakdown[info.page] = (pageBreakdown[info.page] || 0) + 1;
  }

  // Get last 24h of page views (recent buckets)
  const now = Date.now();
  const cutoff = now - 24 * 60 * 60 * 1000;
  const recentBuckets = pageViewBuckets
    .filter(b => b.ts >= cutoff)
    .map(b => ({ time: new Date(b.ts).toISOString(), views: b.views }));

  return {
    liveVisitors: visitors.size,
    pageBreakdown,
    totalPageViews,
    history: recentBuckets,
  };
}
