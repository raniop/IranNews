'use client';

import { useArsenal } from '@/hooks/useArsenal';
import { useLanguage } from '@/hooks/useLanguage';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function ArsenalPage() {
  const { data, isLoading, error } = useArsenal();
  const { t, lang } = useLanguage();
  const isRTL = lang === 'he';

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSpinner label={t('arsenal.loading')} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-zinc-500">{t('arsenal.error')}</p>
      </div>
    );
  }

  const depletionPercent = Math.round(
    ((data.missiles.peakInventory - data.missiles.currentEstimate) / data.missiles.peakInventory) * 100
  );

  const maxMissiles = data.missiles.peakInventory;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          {t('arsenal.title')}
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          {t('arsenal.subtitle')}
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Current Missiles */}
        <StatCard
          title={t('arsenal.currentMissiles')}
          value={`~${data.missiles.currentEstimate.toLocaleString()}`}
          subtitle={t('arsenal.estimated')}
          icon="🎯"
          color="red"
        />

        {/* Launchers */}
        <StatCard
          title={t('arsenal.launchers')}
          value={`~${data.launchers.totalFleet}`}
          subtitle={t('arsenal.telMel')}
          icon="🚛"
          color="amber"
        />

        {/* Depletion */}
        <StatCard
          title={t('arsenal.depletion')}
          value={`${depletionPercent}%`}
          subtitle={t('arsenal.fromPeak')}
          icon="📉"
          color="orange"
        />

        {/* Launcher Losses */}
        <StatCard
          title={t('arsenal.launcherLosses')}
          value={`~${data.launchers.lossesPercent}%`}
          subtitle={t('arsenal.destroyed')}
          icon="💥"
          color="rose"
        />
      </div>

      {/* Depletion Gauge */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 mb-6 bg-white dark:bg-zinc-900/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {t('arsenal.depletion')}
          </h2>
          <span className="text-xs text-zinc-400">
            {data.missiles.currentEstimate.toLocaleString()} / {data.missiles.peakInventory.toLocaleString()}
          </span>
        </div>

        {/* Gauge bar */}
        <div className="relative h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          {/* Remaining (current) */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000"
            style={{ width: `${(data.missiles.currentEstimate / maxMissiles) * 100}%` }}
          />
          {/* Depletion zone */}
          <div className="absolute inset-y-0 right-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 px-2">
              -{(data.missiles.depletedJune2025.low + data.missiles.depletedJune2025.high) / 2 | 0}
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-1.5 text-[10px] text-zinc-400">
          <span>0</span>
          <span>{t('arsenal.peakNote')}: {data.missiles.peakInventory.toLocaleString()} ({data.missiles.peakSource})</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 mb-6 bg-white dark:bg-zinc-900/50">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          {t('arsenal.timeline')}
        </h2>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-4">
          {t('arsenal.timelineDesc')}
        </p>

        {/* Timeline chart */}
        <div className="relative">
          {/* Y-axis labels & bars */}
          <div className="space-y-2">
            {data.timeline.map((point, i) => {
              const pct = (point.missiles / maxMissiles) * 100;
              const isLast = i === data.timeline.length - 1;
              const isPeak = point.missiles === maxMissiles;
              return (
                <div key={point.date} className="flex items-center gap-3">
                  <span className="text-[11px] text-zinc-400 w-16 shrink-0 font-mono">
                    {point.date}
                  </span>
                  <div className="flex-1 relative h-7">
                    <div
                      className={`h-full rounded-md transition-all duration-700 ${
                        isLast
                          ? 'bg-gradient-to-r from-red-500 to-orange-500'
                          : isPeak
                          ? 'bg-gradient-to-r from-zinc-500 to-zinc-400 dark:from-zinc-600 dark:to-zinc-500'
                          : 'bg-gradient-to-r from-red-400/60 to-orange-400/60 dark:from-red-500/40 dark:to-orange-500/40'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                    <span className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-semibold ${
                      pct > 30 ? 'text-white left-2' : 'text-zinc-500 dark:text-zinc-400'
                    }`} style={pct <= 30 ? { left: `calc(${pct}% + 8px)` } : undefined}>
                      {point.missiles.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Labels below */}
          <div className="mt-3 flex flex-wrap gap-2">
            {data.timeline.map((point) => (
              <span
                key={point.date}
                className="text-[9px] text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded"
              >
                {point.date}: {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Depletion Detail */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 mb-6 bg-white dark:bg-zinc-900/50">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          📊 {t('arsenal.depleted')}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.missiles.depletedJune2025.low.toLocaleString()}
            </div>
            <div className="text-[10px] text-red-500/70 mt-0.5">LOW EST.</div>
          </div>
          <div className="text-zinc-300 dark:text-zinc-600 text-lg">—</div>
          <div className="flex-1 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.missiles.depletedJune2025.high.toLocaleString()}
            </div>
            <div className="text-[10px] text-red-500/70 mt-0.5">HIGH EST.</div>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900/50">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          🔍 {t('arsenal.sources')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.sources.map((source) => (
            <span
              key={source}
              className="px-2.5 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full"
            >
              {source}
            </span>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-[10px] text-zinc-400">
            {t('arsenal.lastUpdated')}: {new Date(data.lastUpdated).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Data from{' '}
            <a
              href="https://iranrocketsarsenal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              iranrocketsarsenal.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: 'red' | 'amber' | 'orange' | 'rose';
}) {
  const colorMap = {
    red: 'from-red-500/10 to-red-600/5 border-red-200 dark:border-red-900/50',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-200 dark:border-amber-900/50',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-900/50',
    rose: 'from-rose-500/10 to-rose-600/5 border-rose-200 dark:border-rose-900/50',
  };
  const textColorMap = {
    red: 'text-red-600 dark:text-red-400',
    amber: 'text-amber-600 dark:text-amber-400',
    orange: 'text-orange-600 dark:text-orange-400',
    rose: 'text-rose-600 dark:text-rose-400',
  };

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colorMap[color]} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 leading-tight">
          {title}
        </span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${textColorMap[color]}`}>
        {value}
      </div>
      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
        {subtitle}
      </div>
    </div>
  );
}
