'use client';

import { TrendingTopic, CATEGORY_CONFIG, ALL_CATEGORIES } from '@/lib/types';
import Link from 'next/link';

interface TrendingCardProps {
  topic: TrendingTopic;
  rank: number;
}

export default function TrendingCard({ topic, rank }: TrendingCardProps) {
  // Heat level indicator
  const heatColors = [
    'bg-yellow-400',
    'bg-orange-400',
    'bg-orange-500',
    'bg-red-500',
    'bg-red-600',
  ];
  const heatColor = heatColors[Math.min(topic.heatLevel - 1, 4)];

  return (
    <Link
      href={`/trending/${encodeURIComponent(topic.id)}`}
      className="block"
    >
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all">
        <div className="flex items-start gap-3">
          {/* Rank */}
          <span className="text-2xl font-bold text-zinc-200 dark:text-zinc-800 leading-none">
            {rank}
          </span>

          <div className="flex-1 min-w-0">
            {/* Title + heat */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {topic.title}
              </h3>
              <div className="flex gap-0.5 shrink-0">
                {Array.from({ length: topic.heatLevel }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-3 rounded-sm ${heatColor}`}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>{topic.articles.length} articles</span>
              <span>{topic.sourceCount} sources</span>
            </div>

            {/* Category distribution */}
            <div className="flex gap-1 mt-2">
              {ALL_CATEGORIES.map((cat) => {
                const count = topic.categoryDistribution[cat] || 0;
                if (count === 0) return null;
                const config = CATEGORY_CONFIG[cat];
                return (
                  <span
                    key={cat}
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${config.bgColor}/15 ${config.color}`}
                  >
                    {config.displayName}: {count}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
