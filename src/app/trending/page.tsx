'use client';

import { useTrending } from '@/hooks/useTrending';
import TrendingCard from '@/components/trending/TrendingCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';

export default function TrendingPage() {
  const { topics, articleCount, isLoading } = useTrending();

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
          Trending Topics
        </h1>
        {articleCount > 0 && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            Computed from {articleCount} articles across all sources
          </p>
        )}
      </div>

      {isLoading && <LoadingSpinner label="Analyzing trending topics..." />}

      {!isLoading && topics.length === 0 && (
        <EmptyState
          title="No trending topics"
          description="Trending topics will appear once enough articles are fetched"
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
