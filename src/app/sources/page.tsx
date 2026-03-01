'use client';

import { allSources } from '@/lib/sources';
import { CATEGORY_CONFIG, ALL_CATEGORIES, NewsCategory } from '@/lib/types';
import { useSourceStore } from '@/stores/source-store';
import { useState } from 'react';

export default function SourcesPage() {
  const { disabledSources, toggleSource, enableAll, disableAll } = useSourceStore();
  const [filter, setFilter] = useState<NewsCategory | 'all'>('all');

  const filtered = filter === 'all'
    ? allSources
    : allSources.filter((s) => s.category === filter);

  const enabledCount = allSources.filter(
    (s) => !disabledSources.has(s.id) && s.fetchMethod !== 'unavailable'
  ).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            News Sources
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            {enabledCount} of {allSources.filter((s) => s.fetchMethod !== 'unavailable').length} sources enabled
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={enableAll}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Enable All
          </button>
          <button
            onClick={disableAll}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Disable All
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-hide">
        <FilterChip
          label="All"
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {ALL_CATEGORIES.map((cat) => (
          <FilterChip
            key={cat}
            label={CATEGORY_CONFIG[cat].displayName}
            active={filter === cat}
            onClick={() => setFilter(cat)}
          />
        ))}
      </div>

      {/* Source list */}
      <div className="space-y-2">
        {filtered.map((source) => {
          const config = CATEGORY_CONFIG[source.category];
          const enabled = !disabledSources.has(source.id);
          const unavailable = source.fetchMethod === 'unavailable';

          return (
            <div
              key={source.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                enabled && !unavailable
                  ? 'border-zinc-200 dark:border-zinc-800'
                  : 'border-zinc-100 dark:border-zinc-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${config.bgColor}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      {source.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${config.bgColor}/15 ${config.color}`}>
                      {config.displayName}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {source.fetchMethod === 'unavailable'
                      ? 'Unavailable (geo-blocked)'
                      : source.fetchMethod.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleSource(source.id)}
                disabled={unavailable}
                className={`relative w-11 h-6 rounded-full transition-colors disabled:cursor-not-allowed ${
                  enabled && !unavailable
                    ? 'bg-blue-500'
                    : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    enabled && !unavailable ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
      }`}
    >
      {label}
    </button>
  );
}
