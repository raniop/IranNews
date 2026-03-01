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
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
          <p className="text-zinc-500 font-mono text-sm tracking-wider">{t('arsenal.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
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
    <div className="min-h-screen bg-[#0a0e1a] pb-24">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}
      />

      {/* Top banner */}
      <div className="border-b border-orange-500/20 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center">
          <span className="text-[10px] font-mono tracking-[0.3em] text-orange-500/60 uppercase">
            Open Source Intelligence Tracker &middot; For Informational and Entertainment Purposes Only
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-zinc-800/80 bg-[#0c1120]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-600" />
            </div>
            <div>
              <h1 className="text-white font-mono font-bold text-lg tracking-wider">CENTCOM</h1>
              <p className="text-zinc-500 text-[11px] font-mono">Iranian Arsenal Tracker &middot; OSINT Edition</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-mono text-xl tracking-[0.15em] tabular-nums">
              {utcTime}
              <span className="text-zinc-500 text-xs ml-2">UTC</span>
            </div>
            <p className="text-zinc-600 text-[11px] font-mono">{dateStr}</p>
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
            <div className="rounded-lg border border-zinc-800 bg-[#0c1120] p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-zinc-500">⚙️</span>
                <h3 className="text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
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
                <div className="mt-4 pt-3 border-t border-zinc-800/60 space-y-1">
                  <p className="text-[10px] font-mono text-zinc-600">
                    Last scan: <span className="text-zinc-400 font-bold">{formatScanTime(data.systemStatus.lastScan)}</span>
                  </p>
                  {data.systemStatus.nextScan && (
                    <p className="text-[10px] font-mono text-zinc-600">
                      Next scan: <span className="text-zinc-400 font-bold">{formatScanTime(data.systemStatus.nextScan)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline section */}
        <div className="mt-6 rounded-lg border border-zinc-800 bg-[#0c1120] p-5">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-zinc-500">📊</span>
            <h3 className="text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
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
                  <span className="text-[11px] text-zinc-600 w-20 shrink-0 font-mono">
                    {point.date}
                  </span>
                  <div className="flex-1 relative h-7 bg-zinc-900/50 rounded overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-1000 ${
                        isLast
                          ? 'bg-gradient-to-r from-red-700 to-orange-600'
                          : 'bg-gradient-to-r from-red-900/60 to-orange-900/40'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-2">
                      <span className={`text-[10px] font-mono font-bold ${
                        isLast ? 'text-orange-300' : 'text-zinc-500'
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
        <div className="mt-6 rounded-lg border border-zinc-800 bg-[#0c1120] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-zinc-500">🔍</span>
            <h3 className="text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
              Intelligence Sources
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.sources.map((source) => (
              <span
                key={source}
                className="px-3 py-1 text-xs font-mono font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 rounded"
              >
                {source}
              </span>
            ))}
          </div>
          <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
            <p className="text-[10px] font-mono text-zinc-600">
              Data from{' '}
              <a
                href="https://iranrocketsarsenal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500/70 hover:text-orange-400 transition-colors"
              >
                iranrocketsarsenal.com
              </a>
            </p>
            <p className="text-[10px] font-mono text-zinc-600">
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
          className="inline-block text-[56px] leading-none font-black tabular-nums"
          style={{
            fontFamily: 'ui-monospace, "Cascadia Mono", "Segoe UI Mono", "Liberation Mono", Menlo, Monaco, Consolas, monospace',
            color: '#ff8800',
            textShadow: '0 0 20px rgba(255,136,0,0.6), 0 0 40px rgba(255,136,0,0.3), 0 0 80px rgba(255,136,0,0.1)',
            WebkitTextStroke: '1px rgba(255,136,0,0.3)',
          }}
        >
          {d}
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
    <div className="rounded-lg border border-zinc-800 bg-[#0c1120] p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{icon}</span>
        <h3 className="text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
          {title}
        </h3>
      </div>

      <div className="flex items-end justify-between mb-2">
        <LedNumber value={remaining} />
        <div className="text-right space-y-1 pb-1">
          <div className="text-[10px] font-mono text-zinc-600">
            STARTED
          </div>
          <div className="text-lg font-mono font-bold text-zinc-300 tabular-nums leading-none">
            {started.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-zinc-600 mt-1.5">
            GONE
          </div>
          <div className="text-lg font-mono font-bold text-red-500 tabular-nums leading-none">
            {gone}
          </div>
        </div>
      </div>

      <p className="text-[11px] font-mono text-zinc-600 mb-3">
        {description}
      </p>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-zinc-500">Remaining</span>
          <span className="text-zinc-300 font-bold">{remainingPercent}%</span>
        </div>
        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
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
        <span className="text-[11px] font-mono text-zinc-400">{label}</span>
      </div>
      <span className={`text-[11px] font-mono font-bold ${active ? 'text-green-400' : 'text-red-400'}`}>
        {value}
      </span>
    </div>
  );
}

/* ───── Threat Map visualization ───── */
function ThreatMap() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-[#0c1120] p-4 h-full min-h-[400px] relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-sm">🌐</span>
          <h3 className="text-zinc-400 font-mono text-xs font-bold tracking-wider uppercase">
            Live Threat Visualization — Middle East Theater
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] bg-red-500 rounded" />
            <span className="text-red-400">LAUNCHES</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] bg-blue-400 rounded" />
            <span className="text-blue-400">INTERCEPTIONS</span>
          </span>
        </div>
      </div>

      {/* Map SVG */}
      <div className="relative w-full h-[350px]">
        <svg viewBox="0 0 800 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="glow-red" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(239,68,68,0.4)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0)" />
            </radialGradient>
            <radialGradient id="glow-blue" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(96,165,250,0.3)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0)" />
            </radialGradient>
            <linearGradient id="threat-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(239,68,68,0.8)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0.1)" />
            </linearGradient>
            <linearGradient id="intercept-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(96,165,250,0.1)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0.6)" />
            </linearGradient>
          </defs>
          <rect width="800" height="400" fill="url(#grid)" />

          {/* Simplified Middle East landmass outline */}
          <path d="M 200 80 Q 280 60 350 70 L 380 85 Q 420 75 480 80 L 520 100 Q 560 90 600 110 L 620 150 Q 640 180 630 220 L 600 260 Q 580 290 540 310 L 480 330 Q 440 340 400 320 L 350 300 Q 300 310 260 290 L 220 260 Q 190 230 180 190 L 185 140 Q 190 110 200 80 Z"
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Iran territory highlight */}
          <ellipse cx="520" cy="170" rx="80" ry="60" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.15)" strokeWidth="1" strokeDasharray="4 4">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
          </ellipse>

          {/* Cities */}
          {/* Tehran */}
          <circle cx="520" cy="150" r="5" fill="url(#glow-red)" />
          <circle cx="520" cy="150" r="3" fill="#ef4444" opacity="0.8">
            <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="520" y="140" textAnchor="middle" className="text-[10px] fill-red-400 font-mono font-bold">Tehran</text>

          {/* Baghdad */}
          <circle cx="400" cy="180" r="3" fill="#fbbf24" opacity="0.6" />
          <text x="400" y="170" textAnchor="middle" className="text-[9px] fill-yellow-500/60 font-mono">Baghdad</text>

          {/* Beirut */}
          <circle cx="330" cy="155" r="3" fill="#fbbf24" opacity="0.6" />
          <text x="330" y="145" textAnchor="middle" className="text-[9px] fill-yellow-500/60 font-mono">Beirut</text>

          {/* Tel Aviv / Israel */}
          <circle cx="310" cy="185" r="4" fill="url(#glow-blue)" />
          <circle cx="310" cy="185" r="3" fill="#60a5fa" opacity="0.8">
            <animate attributeName="r" values="3;4;3" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <text x="310" y="200" textAnchor="middle" className="text-[9px] fill-blue-400 font-mono font-bold">Tel Aviv</text>

          {/* Cairo */}
          <circle cx="280" cy="230" r="3" fill="#fbbf24" opacity="0.4" />
          <text x="280" y="245" textAnchor="middle" className="text-[9px] fill-yellow-500/40 font-mono">Cairo</text>

          {/* Riyadh */}
          <circle cx="420" cy="280" r="3" fill="#fbbf24" opacity="0.4" />
          <text x="420" y="295" textAnchor="middle" className="text-[9px] fill-yellow-500/40 font-mono">Riyadh</text>

          {/* Incirlik */}
          <circle cx="350" cy="90" r="3" fill="#22c55e" opacity="0.5" />
          <text x="350" y="80" textAnchor="middle" className="text-[9px] fill-green-500/60 font-mono">Incirlik</text>

          {/* Al Udeid */}
          <circle cx="490" cy="290" r="3" fill="#22c55e" opacity="0.5" />
          <text x="490" y="305" textAnchor="middle" className="text-[9px] fill-green-500/50 font-mono">Al Udeid</text>

          {/* Dubai */}
          <circle cx="540" cy="260" r="3" fill="#fbbf24" opacity="0.4" />
          <text x="555" y="260" textAnchor="start" className="text-[9px] fill-yellow-500/40 font-mono">Dubai</text>

          {/* Threat lines - Iran to Israel */}
          <line x1="510" y1="155" x2="320" y2="185" stroke="url(#threat-line)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7">
            <animate attributeName="strokeDashoffset" values="0;-20" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="500" y1="160" x2="315" y2="190" stroke="url(#threat-line)" strokeWidth="1" strokeDasharray="4 6" opacity="0.4">
            <animate attributeName="strokeDashoffset" values="0;-20" dur="3s" repeatCount="indefinite" />
          </line>

          {/* Intercept lines */}
          <line x1="315" y1="182" x2="400" y2="170" stroke="url(#intercept-line)" strokeWidth="1" strokeDasharray="3 5" opacity="0.5">
            <animate attributeName="strokeDashoffset" values="0;16" dur="2s" repeatCount="indefinite" />
          </line>

          {/* Coordinate labels */}
          <text x="15" y="95" className="text-[8px] fill-zinc-700 font-mono">34°N</text>
          <text x="15" y="195" className="text-[8px] fill-zinc-700 font-mono">28°N</text>
          <text x="15" y="295" className="text-[8px] fill-zinc-700 font-mono">22°N</text>
          <text x="300" y="395" className="text-[8px] fill-zinc-700 font-mono">40°E</text>
          <text x="500" y="395" className="text-[8px] fill-zinc-700 font-mono">50°E</text>
          <text x="650" y="395" className="text-[8px] fill-zinc-700 font-mono">56°E</text>
        </svg>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[9px] font-mono">
        <span className="flex items-center gap-1">
          <span className="w-3 h-[2px] bg-red-500 rounded" style={{ boxShadow: '0 0 4px rgba(239,68,68,0.5)' }} />
          <span className="text-red-400/70">Rocket Launch</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-[2px] bg-blue-400 rounded" style={{ boxShadow: '0 0 4px rgba(96,165,250,0.5)' }} />
          <span className="text-blue-400/70">Interception</span>
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
