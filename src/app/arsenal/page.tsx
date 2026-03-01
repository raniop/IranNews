'use client';

import { useArsenal } from '@/hooks/useArsenal';
import { useLanguage } from '@/hooks/useLanguage';
import { useState, useEffect } from 'react';

export default function ArsenalPage() {
  const { data, isLoading, error } = useArsenal();
  const { t } = useLanguage();
  const [utcTime, setUtcTime] = useState('');

  // Live UTC clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().slice(11, 19).replace(/:/g, ':')
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
          <p className="text-zinc-500 font-mono text-sm tracking-wider">{t('arsenal.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0e1a] flex items-center justify-center">
        <p className="text-red-500 font-mono text-sm">{t('arsenal.error')}</p>
      </div>
    );
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0e1a] pb-24">
      {/* Scanline overlay (dark only) */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-0 dark:opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}
      />

      {/* Top banner */}
      <div className="border-b border-orange-200 dark:border-orange-500/20 bg-white dark:bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center">
          <span className="text-[10px] font-mono tracking-[0.3em] text-orange-600/60 dark:text-orange-500/60 uppercase">
            Open Source Intelligence Tracker &middot; For Informational and Entertainment Purposes Only
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c1120]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            </div>
            <div>
              <h1 className="text-zinc-900 dark:text-white font-mono font-bold text-lg tracking-wider">CENTCOM</h1>
              <p className="text-zinc-500 text-[11px] font-mono">Iranian Arsenal Tracker &middot; OSINT Edition</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-zinc-900 dark:text-white font-mono text-xl tracking-[0.15em] tabular-nums">
              {utcTime}
              <span className="text-zinc-400 dark:text-zinc-500 text-xs ml-2">UTC</span>
            </div>
            <p className="text-zinc-400 dark:text-zinc-600 text-[11px] font-mono">{dateStr}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left column - Map visualization */}
          <div className="lg:col-span-2">
            <ThreatMap />
          </div>

          {/* Right column - Stats */}
          <div className="space-y-4">
            {/* Rockets Remaining */}
            <DashboardCard
              icon="🚀"
              title="ROCKETS REMAINING"
              remaining={data.rockets.remaining}
              started={data.rockets.started}
              gone={data.rockets.gone}
              remainingPercent={data.rockets.remainingPercent}
              description="Ballistic missiles & rockets in IRGC inventory"
              barColor="bg-red-600"
            />

            {/* Launchers Remaining */}
            <DashboardCard
              icon="🚛"
              title="LAUNCHERS REMAINING"
              remaining={data.launchers.remaining}
              started={data.launchers.started}
              gone={data.launchers.gone}
              remainingPercent={data.launchers.remainingPercent}
              description="Mobile erector launchers (MEL / TEL)"
              barColor="bg-orange-500"
            />

            {/* System Status */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1120] p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-zinc-500">⚙️</span>
                <h3 className="text-zinc-600 dark:text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
                  System Status
                </h3>
              </div>
              <div className="space-y-3">
                <StatusRow label="Auto-Scanner" value="Active" active />
                <StatusRow label="AI Parser" value="Online" active />
                <StatusRow label="Feeds" value={`${data.systemStatus.feeds} channels`} active />
                <StatusRow label="Interval" value={`${data.systemStatus.intervalMin} min`} active />
              </div>
              {data.systemStatus.lastScan && (
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 space-y-1">
                  <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                    Last scan: <span className="text-zinc-600 dark:text-zinc-400 font-bold">{formatScanTime(data.systemStatus.lastScan)}</span>
                  </p>
                  {data.systemStatus.nextScan && (
                    <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                      Next scan: <span className="text-zinc-600 dark:text-zinc-400 font-bold">{formatScanTime(data.systemStatus.nextScan)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline section */}
        <div className="mt-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1120] p-5">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-zinc-500">📊</span>
            <h3 className="text-zinc-600 dark:text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
              Arsenal Timeline
            </h3>
          </div>
          <div className="space-y-2.5">
            {data.timeline.map((point, i) => {
              const maxVal = data.timeline[0].missiles;
              const pct = (point.missiles / maxVal) * 100;
              const isLast = i === data.timeline.length - 1;
              return (
                <div key={point.date} className="flex items-center gap-3">
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-600 w-20 shrink-0 font-mono">
                    {point.date}
                  </span>
                  <div className="flex-1 relative h-7 bg-zinc-100 dark:bg-zinc-900/50 rounded overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-1000 ${
                        isLast
                          ? 'bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-700 dark:to-orange-600'
                          : 'bg-gradient-to-r from-red-200 to-orange-200 dark:from-red-900/60 dark:to-orange-900/40'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-2">
                      <span className={`text-[10px] font-mono font-bold ${
                        isLast ? 'text-white dark:text-orange-300' : 'text-zinc-600 dark:text-zinc-500'
                      }`}>
                        {point.missiles.toLocaleString()} — {point.label}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sources footer */}
        <div className="mt-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1120] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-zinc-500">🔍</span>
            <h3 className="text-zinc-600 dark:text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
              Intelligence Sources
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.sources.map((source) => (
              <span
                key={source}
                className="px-3 py-1 text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
              >
                {source}
              </span>
            ))}
          </div>
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
            <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
              Data from{' '}
              <a
                href="https://iranrocketsarsenal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 dark:text-orange-500/70 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                iranrocketsarsenal.com
              </a>
            </p>
            <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
              Updated: {new Date(data.lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── LED-style big number ───── */
function LedNumber({ value }: { value: number }) {
  const digits = value.toString().split('');
  return (
    <div className="flex items-baseline gap-[2px]">
      {digits.map((d, i) => (
        <span
          key={i}
          className="inline-block text-[56px] leading-none font-black tabular-nums text-orange-600 dark:text-[#ff8800]"
          style={{
            fontFamily: 'ui-monospace, "Cascadia Mono", "Segoe UI Mono", "Liberation Mono", Menlo, Monaco, Consolas, monospace',
          }}
        >
          <span className="hidden dark:inline" style={{
            color: '#ff8800',
            textShadow: '0 0 20px rgba(255,136,0,0.6), 0 0 40px rgba(255,136,0,0.3), 0 0 80px rgba(255,136,0,0.1)',
            WebkitTextStroke: '1px rgba(255,136,0,0.3)',
          }}>{d}</span>
          <span className="dark:hidden" style={{
            color: '#ea580c',
            textShadow: '0 0 10px rgba(234,88,12,0.15)',
          }}>{d}</span>
        </span>
      ))}
    </div>
  );
}

/* ───── Dashboard stat card ───── */
function DashboardCard({
  icon,
  title,
  remaining,
  started,
  gone,
  remainingPercent,
  description,
  barColor,
}: {
  icon: string;
  title: string;
  remaining: number;
  started: number;
  gone: number;
  remainingPercent: number;
  description: string;
  barColor: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1120] p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{icon}</span>
        <h3 className="text-zinc-600 dark:text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
          {title}
        </h3>
      </div>

      <div className="flex items-end justify-between mb-2">
        <LedNumber value={remaining} />
        <div className="text-right space-y-1 pb-1">
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
            STARTED
          </div>
          <div className="text-lg font-mono font-bold text-zinc-700 dark:text-zinc-300 tabular-nums leading-none">
            {started.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 mt-1.5">
            GONE
          </div>
          <div className="text-lg font-mono font-bold text-red-600 dark:text-red-500 tabular-nums leading-none">
            {gone}
          </div>
        </div>
      </div>

      <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-600 mb-3">
        {description}
      </p>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-zinc-400 dark:text-zinc-500">Remaining</span>
          <span className="text-zinc-700 dark:text-zinc-300 font-bold">{remainingPercent}%</span>
        </div>
        <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-1000`}
            style={{ width: `${remainingPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ───── System status row ───── */
function StatusRow({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{label}</span>
      </div>
      <span className={`text-[11px] font-mono font-bold ${active ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
        {value}
      </span>
    </div>
  );
}

/* ───── Threat Map visualization ───── */
function ThreatMap() {
  // Threat arc paths: Iran → targets (curved bezier)
  const threatArcs = [
    { id: 'ir-il-1', path: 'M 540,155 Q 420,90 285,195', dur: '3s', delay: '0s', w: 2 },
    { id: 'ir-il-2', path: 'M 535,165 Q 400,110 280,200', dur: '3.5s', delay: '0.5s', w: 1.5 },
    { id: 'ir-il-3', path: 'M 530,160 Q 430,70 290,190', dur: '4s', delay: '1s', w: 1 },
    { id: 'ir-qa', path: 'M 555,190 Q 520,250 480,295', dur: '2.5s', delay: '0.3s', w: 1.5 },
    { id: 'ir-kw', path: 'M 530,185 Q 470,220 420,275', dur: '3s', delay: '0.7s', w: 1 },
    { id: 'ir-in', path: 'M 520,140 Q 450,80 340,80', dur: '3.2s', delay: '1.2s', w: 1 },
  ];

  const interceptArcs = [
    { id: 'int-1', path: 'M 290,190 Q 340,140 390,130', dur: '2s', delay: '0.2s' },
    { id: 'int-2', path: 'M 285,195 Q 320,155 370,145', dur: '2.5s', delay: '0.8s' },
    { id: 'int-3', path: 'M 290,185 Q 350,120 400,115', dur: '2.2s', delay: '1.5s' },
  ];

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-slate-100 dark:bg-[#060b18] p-4 h-full min-h-[420px] relative overflow-hidden">
      {/* Background radial glow (dark) */}
      <div className="absolute inset-0 opacity-0 dark:opacity-30" style={{
        background: 'radial-gradient(ellipse 60% 50% at 68% 40%, rgba(220,38,38,0.15) 0%, transparent 70%)',
      }} />
      {/* Background radial glow (light) */}
      <div className="absolute inset-0 opacity-20 dark:opacity-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 68% 40%, rgba(220,38,38,0.08) 0%, transparent 70%)',
      }} />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-sm">🌐</span>
          <h3 className="text-zinc-600 dark:text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
            Live Threat Visualization — Middle East Theater
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" style={{ boxShadow: '0 0 6px #ef4444' }} />
            <span className="text-red-500 dark:text-red-400">LAUNCHES</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" style={{ boxShadow: '0 0 6px #60a5fa' }} />
            <span className="text-blue-600 dark:text-blue-400">INTERCEPTIONS</span>
          </span>
        </div>
      </div>

      <div className="relative w-full h-[380px]">
        <svg viewBox="0 0 800 420" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(128,128,128,0.08)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow-r" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-b" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-city" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="iran-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(220,38,38,0.25)" />
              <stop offset="40%" stopColor="rgba(220,38,38,0.08)" />
              <stop offset="100%" stopColor="rgba(220,38,38,0)" />
            </radialGradient>
            <radialGradient id="israel-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(96,165,250,0.2)" />
              <stop offset="60%" stopColor="rgba(96,165,250,0.05)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0)" />
            </radialGradient>
          </defs>

          <rect width="800" height="420" fill="url(#grid)" />

          {/* Region outlines */}
          <path d="M 240,55 Q 280,45 320,50 L 370,55 Q 400,50 420,60 L 440,75 Q 420,85 390,85 L 360,80 Q 330,90 300,85 L 260,80 Q 240,70 240,55 Z"
            fill="rgba(128,128,128,0.04)" stroke="rgba(128,128,128,0.12)" strokeWidth="0.8" />
          <path d="M 440,80 Q 480,70 530,75 L 580,85 Q 620,90 650,110 L 660,145 Q 670,180 660,210 L 640,240 Q 610,260 580,265 L 540,260 Q 510,250 490,235 L 460,215 Q 440,195 435,170 L 430,140 Q 430,110 440,80 Z"
            fill="rgba(220,38,38,0.05)" stroke="rgba(220,38,38,0.18)" strokeWidth="1" />
          <path d="M 360,80 Q 380,85 400,100 L 420,120 Q 435,145 440,170 L 445,200 Q 440,220 430,235 L 410,250 Q 390,260 370,255 L 350,240 Q 340,220 335,195 L 330,170 Q 330,140 340,115 L 350,95 Z"
            fill="rgba(128,128,128,0.03)" stroke="rgba(128,128,128,0.08)" strokeWidth="0.8" />
          <path d="M 310,220 Q 350,250 400,270 L 450,290 Q 500,300 530,280 L 560,270 Q 550,310 520,340 L 460,360 Q 400,370 350,350 L 310,320 Q 290,290 290,260 L 310,220 Z"
            fill="rgba(128,128,128,0.02)" stroke="rgba(128,128,128,0.06)" strokeWidth="0.6" />
          <path d="M 280,165 L 295,160 Q 300,170 298,185 L 295,205 Q 290,215 280,220 L 275,210 Q 270,195 272,180 L 280,165 Z"
            fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.2)" strokeWidth="0.8" />
          <path d="M 220,175 Q 250,165 270,170 L 275,185 Q 275,210 270,230 L 260,260 Q 240,290 220,300 L 200,290 Q 190,260 190,230 L 195,200 Q 200,185 220,175 Z"
            fill="rgba(128,128,128,0.02)" stroke="rgba(128,128,128,0.06)" strokeWidth="0.6" />

          {/* Territory glow zones */}
          <ellipse cx="550" cy="165" rx="110" ry="80" fill="url(#iran-glow)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="550" cy="165" rx="70" ry="50" fill="none" stroke="rgba(220,38,38,0.12)" strokeWidth="1" strokeDasharray="3 6">
            <animate attributeName="strokeDashoffset" values="0;18" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="290" cy="190" rx="35" ry="25" fill="url(#israel-glow)">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
          </ellipse>

          {/* Threat arcs (red) */}
          {threatArcs.map((arc) => (
            <g key={arc.id}>
              <path d={arc.path} fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth={arc.w + 3} filter="url(#glow-r)" />
              <path d={arc.path} fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth={arc.w} strokeDasharray="8 6" strokeLinecap="round">
                <animate attributeName="strokeDashoffset" values="0;-28" dur={arc.dur} repeatCount="indefinite" />
              </path>
              <circle r="3" fill="#ef4444" filter="url(#glow-r)" opacity="0.9">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
              <circle r="1.5" fill="#fca5a5">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
            </g>
          ))}

          {/* Intercept arcs (blue) */}
          {interceptArcs.map((arc) => (
            <g key={arc.id}>
              <path d={arc.path} fill="none" stroke="rgba(96,165,250,0.12)" strokeWidth="4" filter="url(#glow-b)" />
              <path d={arc.path} fill="none" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" strokeDasharray="4 8" strokeLinecap="round">
                <animate attributeName="strokeDashoffset" values="0;24" dur={arc.dur} repeatCount="indefinite" />
              </path>
              <circle r="2.5" fill="#60a5fa" filter="url(#glow-b)" opacity="0.8">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
              <circle r="1" fill="#93c5fd">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
            </g>
          ))}

          {/* Impact flashes */}
          <circle cx="290" cy="193" r="0" fill="rgba(239,68,68,0.6)" filter="url(#glow-r)">
            <animate attributeName="r" values="0;8;0" dur="3s" begin="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0" dur="3s" begin="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="480" cy="295" r="0" fill="rgba(239,68,68,0.4)" filter="url(#glow-r)">
            <animate attributeName="r" values="0;6;0" dur="2.5s" begin="2.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.6;0" dur="2.5s" begin="2.1s" repeatCount="indefinite" />
          </circle>

          {/* Cities */}
          <circle cx="545" cy="145" r="18" fill="none" stroke="rgba(239,68,68,0.12)" strokeWidth="0.5">
            <animate attributeName="r" values="18;24;18" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="545" cy="145" r="5" fill="#ef4444" opacity="0.7" filter="url(#glow-city)">
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="545" cy="145" r="2" fill="#fca5a5" />
          <text x="545" y="132" textAnchor="middle" fill="#dc2626" fontSize="11" fontFamily="monospace" fontWeight="bold">Tehran</text>

          <circle cx="285" cy="193" r="14" fill="none" stroke="rgba(96,165,250,0.18)" strokeWidth="0.5">
            <animate attributeName="r" values="14;20;14" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="285" cy="193" r="4" fill="#3b82f6" opacity="0.8" filter="url(#glow-city)">
            <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="285" cy="193" r="1.5" fill="#bfdbfe" />
          <text x="285" y="213" textAnchor="middle" fill="#2563eb" fontSize="10" fontFamily="monospace" fontWeight="bold">Tel Aviv</text>

          <circle cx="298" cy="163" r="3" fill="#d97706" opacity="0.6" filter="url(#glow-city)" />
          <text x="298" y="155" textAnchor="middle" fill="rgba(217,119,6,0.7)" fontSize="9" fontFamily="monospace">Beirut</text>

          <circle cx="400" cy="155" r="3" fill="#d97706" opacity="0.5" filter="url(#glow-city)" />
          <text x="400" y="147" textAnchor="middle" fill="rgba(217,119,6,0.6)" fontSize="9" fontFamily="monospace">Baghdad</text>

          <circle cx="340" cy="72" r="3" fill="#16a34a" opacity="0.6" filter="url(#glow-city)" />
          <circle cx="340" cy="72" r="6" fill="none" stroke="rgba(22,163,74,0.2)" strokeWidth="0.5" />
          <text x="340" y="64" textAnchor="middle" fill="rgba(22,163,74,0.8)" fontSize="9" fontFamily="monospace">Incirlik</text>

          <circle cx="480" cy="295" r="3" fill="#16a34a" opacity="0.5" filter="url(#glow-city)" />
          <circle cx="480" cy="295" r="6" fill="none" stroke="rgba(22,163,74,0.15)" strokeWidth="0.5" />
          <text x="480" y="312" textAnchor="middle" fill="rgba(22,163,74,0.7)" fontSize="9" fontFamily="monospace">Al Udeid</text>

          <circle cx="245" cy="235" r="2.5" fill="#d97706" opacity="0.35" />
          <text x="245" y="250" textAnchor="middle" fill="rgba(217,119,6,0.4)" fontSize="9" fontFamily="monospace">Cairo</text>

          <circle cx="410" cy="285" r="2.5" fill="#d97706" opacity="0.35" />
          <text x="410" y="300" textAnchor="middle" fill="rgba(217,119,6,0.4)" fontSize="9" fontFamily="monospace">Riyadh</text>

          <circle cx="530" cy="260" r="2.5" fill="#d97706" opacity="0.3" />
          <text x="543" y="260" textAnchor="start" fill="rgba(217,119,6,0.4)" fontSize="9" fontFamily="monospace">Dubai</text>

          {/* Coordinate labels */}
          <text x="12" y="80" fill="rgba(128,128,128,0.15)" fontSize="8" fontFamily="monospace">36°N</text>
          <text x="12" y="180" fill="rgba(128,128,128,0.15)" fontSize="8" fontFamily="monospace">30°N</text>
          <text x="12" y="280" fill="rgba(128,128,128,0.15)" fontSize="8" fontFamily="monospace">24°N</text>
          <text x="12" y="380" fill="rgba(128,128,128,0.15)" fontSize="8" fontFamily="monospace">18°N</text>
          <text x="200" y="412" fill="rgba(128,128,128,0.15)" fontSize="8" fontFamily="monospace">36°E</text>
          <text x="400" y="412" fill="rgba(128,128,128,0.15)" fontSize="8" fontFamily="monospace">44°E</text>
          <text x="600" y="412" fill="rgba(128,128,128,0.15)" fontSize="8" fontFamily="monospace">52°E</text>
        </svg>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-3 left-4 flex items-center gap-5 text-[9px] font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-[2px] rounded" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
          <span className="text-red-500 dark:text-red-400/80">Rocket Launch</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-[2px] rounded" style={{ backgroundColor: '#3b82f6', boxShadow: '0 0 6px #60a5fa' }} />
          <span className="text-blue-600 dark:text-blue-400/80">Interception</span>
        </span>
      </div>
    </div>
  );
}

/* ───── Helpers ───── */
function formatScanTime(iso: string): string {
  const d = new Date(iso);
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  const s = d.getUTCSeconds().toString().padStart(2, '0');
  return `${mon} ${day} at ${h}:${m}:${s}`;
}
