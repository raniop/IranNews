'use client';

import { useState } from 'react';
import { useSentiment } from '@/hooks/useSentiment';
import { useLanguage } from '@/hooks/useLanguage';

const BAR_COLORS = {
  oppose: {
    bar: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  },
  support: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  neutral: {
    bar: 'bg-zinc-400 dark:bg-zinc-500',
    text: 'text-zinc-500 dark:text-zinc-400',
    badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
};

function SentimentBar({
  label,
  percentage,
  type,
}: {
  label: string;
  percentage: number;
  type: 'oppose' | 'support' | 'neutral';
}) {
  const colors = BAR_COLORS[type];
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-medium ${colors.text}`}>{label}</span>
          <span className={`text-sm font-bold ${colors.text}`}>{percentage}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
          <div
            className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function SentimentIndexCard() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useSentiment();
  const [showInfo, setShowInfo] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 mb-4 animate-pulse">
        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full w-3/4" />
          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full w-1/2" />
          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full w-1/4" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 mb-4">
        <p className="text-sm text-zinc-500">{t('sentiment.error')}</p>
      </div>
    );
  }

  // Collect unique source organizations for display
  const sourceOrgs = [...new Set(data.dataPoints.map((dp) => dp.organization))];
  // Short labels for badges
  const sourceLabels = sourceOrgs.map((org) => {
    if (org.includes('GAMAAN')) return 'GAMAAN';
    if (org.includes('Maryland')) return 'U of Maryland';
    if (org.includes('Pew')) return 'Pew Research';
    if (org.includes('World Values')) return 'World Values Survey';
    return org.split(' ').slice(0, 2).join(' ');
  });

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 mb-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">📊</span>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
            {t('sentiment.title')}
          </h2>
          <span className="text-xs text-zinc-400">— {t('sentiment.subtitle')}</span>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-400 transition-colors"
            aria-label="Info"
          >
            ?
          </button>
        </div>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="mb-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 space-y-2">
          <p className="font-semibold text-zinc-900 dark:text-white">
            {t('sentiment.infoTitle')}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {t('sentiment.infoDesc')}
          </p>
          <p className="text-[10px] text-zinc-400 italic">
            {data.dataPoints.length} {t('sentiment.dataPoints')}
          </p>
        </div>
      )}

      {/* Bars */}
      <div className="space-y-2.5">
        <SentimentBar
          label={t('sentiment.oppose')}
          percentage={data.oppose.average}
          type="oppose"
        />
        <SentimentBar
          label={t('sentiment.support')}
          percentage={data.support.average}
          type="support"
        />
        <SentimentBar
          label={t('sentiment.neutral')}
          percentage={data.neutral.average}
          type="neutral"
        />
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <p className="text-[10px] text-zinc-400">
            {t('sentiment.basedOn')} {data.dataPoints.length} {t('sentiment.surveys')}
          </p>
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {sourceLabels.map((label, i) => (
            <span
              key={i}
              className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
