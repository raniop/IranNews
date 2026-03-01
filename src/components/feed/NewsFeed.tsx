'use client';

import { useState, useMemo } from 'react';
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

export default function NewsFeed() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<NewsCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const { articles, total, isLoading, error, refresh } = useArticles(
    category !== 'all' ? category : undefined
  );
  const [refreshing, setRefreshing] = useState(false);
  const { getTitle, getDescription } = useHebrewTitles(articles);

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

  const handleRefresh = async () => {
    setRefreshing(true);
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
          {total > 0 && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {total} {t('feed.articlesCount')}
            </p>
          )}
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
        {filtered.map((article) => (
          <ArticleRow
            key={article.id}
            article={article}
            hebrewTitle={getTitle(article)}
            hebrewDescription={getDescription(article)}
          />
        ))}
      </div>
    </div>
  );
}
