'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { NewsCategory } from '@/lib/types';
import ArticleRow from './ArticleRow';
import SearchBar from './SearchBar';
import CategoryFilterBar from '@/components/shared/CategoryFilterBar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorBanner from '@/components/shared/ErrorBanner';
import WarPredictionCard from '@/components/shared/WarPredictionCard';
import SentimentIndexCard from '@/components/shared/SentimentIndexCard';
import { useLanguage } from '@/hooks/useLanguage';
import { useHebrewTitles } from '@/hooks/useHebrewTitles';

const PAGE_SIZE = 20;

export default function NewsFeed() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<NewsCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const { articles, total, isLoading, error, refresh, fetchedAt } = useArticles(
    category !== 'all' ? category : undefined
  );
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Only translate visible articles (not the full list)
  const visibleArticles = useMemo(() => articles.slice(0, visibleCount), [articles, visibleCount]);
  const { getTitle, getDescription } = useHebrewTitles(visibleArticles);

  // Filter articles
  const filtered = useMemo(() => {
    if (!search.trim()) return articles;
    const q = search.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.articleDescription?.toLowerCase().includes(q) ||
        a.sourceID.toLowerCase().includes(q) ||
        getTitle(a).toLowerCase().includes(q) ||
        getDescription(a)?.toLowerCase().includes(q)
    );
  }, [articles, search, getTitle, getDescription]);

  // Paginated view
  const displayedArticles = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const hasMore = visibleCount < filtered.length;

  // Reset visible count when category or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, search]);

  // Infinite scroll: IntersectionObserver on sentinel div
  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  }, [hasMore]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '400px' } // Start loading 400px before reaching bottom
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setVisibleCount(PAGE_SIZE);
    await refresh();
    setRefreshing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            {t('feed.title')}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            {total > 0 && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {filtered.length} {t('feed.articlesCount')}
              </p>
            )}
            {fetchedAt && (
              <LastUpdated fetchedAt={fetchedAt} />
            )}
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || isLoading}
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          aria-label="Refresh"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={refreshing ? 'animate-spin' : ''}
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <SearchBar value={search} onChange={setSearch} placeholder={t('feed.search')} />
      </div>

      {/* Category filter */}
      <div className="mb-4">
        <CategoryFilterBar selected={category} onChange={setCategory} />
      </div>

      {/* Error */}
      {error && (
        <ErrorBanner message={t('feed.failedLoad')} onRetry={handleRefresh} />
      )}

      {/* Loading */}
      {isLoading && !articles.length && (
        <LoadingSpinner label={t('feed.loading')} />
      )}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <EmptyState
          title={search ? t('feed.noMatch') : t('feed.noArticles')}
          description={search ? t('feed.tryDifferent') : t('feed.pullRefresh')}
          action={
            search
              ? { label: t('feed.clearSearch'), onClick: () => setSearch('') }
              : { label: t('feed.refresh'), onClick: handleRefresh }
          }
        />
      )}

      {/* Sentiment Index + War Prediction */}
      {articles.length > 0 && (
        <>
          <SentimentIndexCard />
          <WarPredictionCard articles={articles} />
        </>
      )}

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedArticles.map((article) => (
          <ArticleRow
            key={article.id}
            article={article}
            hebrewTitle={getTitle(article)}
            hebrewDescription={getDescription(article)}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-6">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {t('feed.loading')}
          </div>
        </div>
      )}
    </div>
  );
}

function LastUpdated({ fetchedAt }: { fetchedAt: string }) {
  const { t } = useLanguage();
  const [label, setLabel] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = Date.now() - new Date(fetchedAt).getTime();
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);

      if (mins < 1) {
        setLabel(`${t('time.lastUpdated')} ${t('time.justNow')}`);
      } else if (mins < 60) {
        setLabel(`${t('time.lastUpdated')} ${t('time.minutesAgo').replace('{n}', String(mins))}`);
      } else {
        setLabel(`${t('time.lastUpdated')} ${t('time.hoursAgo').replace('{n}', String(hours))}`);
      }
    };

    update();
    const timer = setInterval(update, 30000); // Update every 30s
    return () => clearInterval(timer);
  }, [fetchedAt, t]);

  if (!label) return null;

  return (
    <span className="text-[10px] text-zinc-300 dark:text-zinc-600">
      • {label}
    </span>
  );
}
