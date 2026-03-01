'use client';

import { useEffect, useState, useCallback } from 'react';

interface Stats {
  liveVisitors: number;
  pageBreakdown: Record<string, number>;
  totalPageViews: number;
  history: { time: string; views: number }[];
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home / Feed',
  '/trending': 'Trending',
  '/sources': 'Sources',
  '/settings': 'Settings',
  '/analytics': 'Analytics',
};

function formatPage(path: string): string {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  if (path.startsWith('/article/')) return 'Article Detail';
  if (path.startsWith('/trending/')) return 'Story Comparison';
  return path;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setError(false);
      }
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3_000); // refresh every 3s
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Calculate max for chart scaling
  const maxViews = stats?.history?.length
    ? Math.max(...stats.history.map(h => h.views), 1)
    : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
        Live Analytics
      </h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-3 mb-4 text-sm">
          Failed to load stats
        </div>
      )}

      {/* Main stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Live visitors - big prominent card */}
        <div className="sm:col-span-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="text-sm font-medium text-white/80 uppercase tracking-wide">
              Live Now
            </span>
          </div>
          <div className="text-5xl font-black tabular-nums">
            {stats?.liveVisitors ?? '—'}
          </div>
          <p className="text-sm text-white/70 mt-1">active visitors</p>
        </div>

        {/* Total page views */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            Total Page Views
          </p>
          <div className="text-4xl font-bold text-zinc-900 dark:text-white tabular-nums">
            {stats?.totalPageViews?.toLocaleString() ?? '—'}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">since server start</p>
        </div>

        {/* Pages count */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            Active Pages
          </p>
          <div className="text-4xl font-bold text-zinc-900 dark:text-white tabular-nums">
            {stats ? Object.keys(stats.pageBreakdown).length : '—'}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">pages being viewed</p>
        </div>
      </div>

      {/* Page breakdown */}
      {stats && Object.keys(stats.pageBreakdown).length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Visitors by Page
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.pageBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([page, count]) => (
                <div key={page} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                        {formatPage(page)}
                      </span>
                      <span className="text-sm font-bold text-zinc-900 dark:text-white ml-2 tabular-nums">
                        {count}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(count / stats.liveVisitors) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Traffic chart (last 24h) */}
      {stats && stats.history.length > 1 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Traffic (Last 24h)
          </h2>
          <div className="flex items-end gap-px h-40">
            {stats.history.slice(-48).map((bucket, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-sm transition-all duration-300 min-w-[3px]"
                style={{
                  height: `${Math.max((bucket.views / maxViews) * 100, 2)}%`,
                }}
                title={`${new Date(bucket.time).toLocaleTimeString()}: ${bucket.views} views`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-zinc-400 dark:text-zinc-500">
            {stats.history.length > 1 && (
              <>
                <span>
                  {new Date(stats.history[Math.max(0, stats.history.length - 48)].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>
                  {new Date(stats.history[stats.history.length - 1].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Auto-refresh indicator */}
      <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-6">
        Auto-refreshing every 3 seconds
      </p>
    </div>
  );
}
