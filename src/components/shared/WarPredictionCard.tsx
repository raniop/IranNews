'use client';

import { useState, useEffect, useCallback } from 'react';
import { Article, WarPrediction } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';

function scoreColor(score: number): string {
  if (score <= 25) return '#ef4444'; // red
  if (score <= 50) return '#f97316'; // orange
  if (score <= 75) return '#eab308'; // yellow
  return '#22c55e'; // green
}

function riskBadgeClasses(level: string): string {
  switch (level) {
    case 'critical':
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
    case 'high':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
    default:
      return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
  }
}

function trendArrow(trend: string): string {
  switch (trend) {
    case 'escalating':
      return '↗';
    case 'de-escalating':
      return '↘';
    default:
      return '→';
  }
}

function ScoreGauge({ score }: { score: number }) {
  const color = scoreColor(score);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-700"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

function timeAgo(isoDate: string, lang: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return lang === 'he' ? 'עכשיו' : 'just now';
  if (mins < 60) return lang === 'he' ? `לפני ${mins} דק׳` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return lang === 'he' ? `לפני ${hrs} שע׳` : `${hrs}h ago`;
}

export default function WarPredictionCard({ articles }: { articles: Article[] }) {
  const { t, lang } = useLanguage();
  const [prediction, setPrediction] = useState<WarPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPrediction = useCallback(async (arts: Article[]) => {
    setLoading(true);
    setError(false);
    try {
      const titles = arts.slice(0, 50).map(
        (a) => `[${a.sourceID}/${a.category}] ${a.title}`
      );
      const res = await fetch('/api/ai/war-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titles }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setPrediction(data.prediction);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      fetchPrediction(articles);
    }
  }, [articles, fetchPrediction]);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 mb-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 mb-4">
        <p className="text-sm text-zinc-500">{t('prediction.error')}</p>
        <button
          onClick={() => fetchPrediction(articles)}
          className="mt-2 text-sm text-blue-500 hover:text-blue-600"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const trendKey = `prediction.${prediction.trend}` as const;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 mb-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
          {t('prediction.title')}
        </h2>
        <span className="text-[10px] text-zinc-400">
          {t('prediction.updated')} {timeAgo(prediction.analyzedAt, lang)}
        </span>
      </div>

      {/* Main content */}
      <div className="flex items-center gap-4">
        {/* Score gauge */}
        <ScoreGauge score={prediction.score} />

        {/* Details */}
        <div className="flex-1 min-w-0">
          {/* Risk + Trend row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${riskBadgeClasses(prediction.riskLevel)}`}
            >
              {t(`prediction.${prediction.riskLevel}` as 'prediction.low')}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="text-base">{trendArrow(prediction.trend)}</span>
              {t(trendKey as 'prediction.stable')}
            </span>
          </div>

          {/* Summary */}
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-2 line-clamp-2">
            {prediction.summary}
          </p>

          {/* Based on */}
          <p className="text-[10px] text-zinc-400">
            {t('prediction.basedOn')} {prediction.articleCount} {t('prediction.articles')}
          </p>
        </div>
      </div>

      {/* Factors */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {/* Escalation */}
        <div>
          <p className="text-[10px] font-medium text-red-500 mb-1">
            {t('prediction.escalation')}
          </p>
          <div className="flex flex-wrap gap-1">
            {prediction.escalationFactors.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* De-escalation */}
        <div>
          <p className="text-[10px] font-medium text-green-500 mb-1">
            {t('prediction.deescalation')}
          </p>
          <div className="flex flex-wrap gap-1">
            {prediction.deescalationFactors.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
