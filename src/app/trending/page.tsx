'use client';

import { useTrending } from '@/hooks/useTrending';
import { useLanguage } from '@/hooks/useLanguage';
import TrendingCard from '@/components/trending/TrendingCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';

export default function TrendingPage() {
  const { topics, articleCount, isLoading } = useTrending();
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
          {t('trending.title')}
        </h1>
        {articleCount > 0 && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            {t('trending.computed')} {articleCount} {t('trending.articlesAcross')}
          </p>
        )}
      </div>

      {isLoading && <LoadingSpinner label={t('trending.analyzing')} />}

      {!isLoading && topics.length === 0 && (
        <EmptyState
          title={t('trending.noTopics')}
          description={t('trending.willAppear')}
        />
      )}

      <div className="space-y-3">
        {topics.map((topic, i) => (
          <TrendingCard key={topic.id} topic={topic} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
