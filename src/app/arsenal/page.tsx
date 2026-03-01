'use client';

import { useArsenal } from '@/hooks/useArsenal';
import { useLanguage } from '@/hooks/useLanguage';
import { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════
   Exact color tokens from iranrocketsarsenal.com
   ═══════════════════════════════════════════════════════ */
const C = {
  bodyBg: '#020a12',
  cardBg: '#07131c',
  cardBorder: '#1b2b36',
  rocketNum: '#ff6f69',
  launcherNum: '#f29520',
  label: '#466270',
  value: '#8caab9',
  green: '#00ca62',
  centcom: '#bedded',
  dimText: '#5c7988',
  clockText: '#516e7c',
  bannerText: '#00ca62',
};

/* ═══════ Static AI-parse events data ═══════ */
const AI_EVENTS = [
  { time: '16:50:06', source: 'Yedioth News', summary: 'Approximately 5 missiles are on their way towards the north.', delta: -5, confidence: 'High' },
  { time: '16:00:20', source: 'Breaking News', summary: "Iran's Revolutionary Guards targeted the USS Abraham...", delta: -4, confidence: 'High' },
  { time: '16:00:03', source: 'Yedioth News', summary: 'Iranian Revolutionary Guards stated they launched 4 ballisti...', delta: -4, confidence: 'High' },
  { time: '15:10:11', source: 'Breaking News', summary: '165 Iranian ballistic missiles and 541 Iranian drones were...', delta: -50, confidence: 'High' },
  { time: '15:10:09', source: 'Breaking News', summary: '165 ballistic missiles and 541 Iranian drones were launched...', delta: -50, confidence: 'High' },
  { time: '15:10:11', source: 'Breaking News', summary: 'Iran launched 165 missiles and 541 UAVs towards the UAE...', delta: -50, confidence: 'High' },
];

const CHANNELS = [
  { name: 'Red Alert System', url: 't.me/tzevaadomm', type: 'Alert', color: '#ef4444' },
  { name: 'Yedioth News', url: 't.me/yediotnews25', type: 'News', color: '#3b82f6' },
  { name: 'News Flash', url: 't.me/newsflashhhj', type: 'News', color: '#3b82f6' },
  { name: 'Breaking News', url: 't.me/news_is_breaking_out_telegram', type: 'OSINT', color: '#f29520' },
];

const INTEL_FEED = [
  { source: 'Breaking News', time: '17:50:03', text: '\u05d8\u05e8\u05d0\u05de\u05e4: \u05d4\u05de\u05d1\u05e6\u05e2 \u05d1\u05d0\u05d9\u05e8\u05d0\u05df \u05de\u05ea\u05e7\u05d3\u05dd \u05de\u05d4\u05e8 \u05d9\u05d5\u05ea\u05e8 \u05de\u05d4\u05ea\u05d5\u05db\u05e0\u05d9\u05ea' },
  { source: 'Yedioth News', time: '17:50:02', text: '\u05d8\u05e8\u05d0\u05de\u05e4: \u05d4\u05de\u05d1\u05e6\u05e2 \u05d1\u05d0\u05d9\u05e8\u05d0\u05df \u05de\u05ea\u05e7\u05d3\u05dd \u05de\u05d4\u05e8 \u05d9\u05d5\u05ea\u05e8 \u05de\u05d4\u05ea\u05d5\u05db\u05e0\u05d9\u05ea' },
];

export default function ArsenalPage() {
  const { data, isLoading, error } = useArsenal();
  const { t } = useLanguage();
  const [utcTime, setUtcTime] = useState('');
  const [utcDate, setUtcDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setUtcTime(now.toISOString().slice(11, 19));
      setUtcDate(now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#020a12] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#ff6f69]/30 border-t-[#ff6f69] rounded-full animate-spin mb-4" />
          <p className="text-zinc-500 dark:text-[#5c7988] font-[family-name:var(--font-share-tech-mono)] text-sm tracking-wider">{t('arsenal.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#020a12] flex items-center justify-center">
        <p className="text-red-500 font-[family-name:var(--font-share-tech-mono)] text-sm">{t('arsenal.error')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#020a12] pb-24" dir="ltr">
      {/* Scanline overlay (dark only) */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-0 dark:opacity-[0.02]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)' }}
      />

      {/* Top disclaimer banner */}
      <div className="border-b border-[#1b2b36] bg-zinc-100 dark:bg-[#020a12]">
        <div className="max-w-[1400px] mx-auto px-4 py-1.5 flex items-center justify-center">
          <span className="text-[10px] font-[family-name:var(--font-share-tech-mono)] tracking-[0.3em] text-emerald-700/60 dark:text-[#00ca62]/60 uppercase">
            Open Source Intelligence Tracker &middot; For Informational and Entertainment Purposes Only
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-[#1b2b36] bg-white dark:bg-[#020a12]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-zinc-300 dark:border-[#1b2b36] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-[#5c7988]" />
            </div>
            <div>
              <h1 className="text-zinc-900 dark:text-[#bedded] text-sm font-bold tracking-wider">CENTCOM</h1>
              <p className="text-zinc-500 dark:text-[#466270] text-[11px]">Iranian Arsenal Tracker &middot; OSINT Edition</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-zinc-600 dark:text-[#9ccce4] font-[family-name:var(--font-share-tech-mono)] text-base font-bold tracking-widest tabular-nums">
              {utcTime}
              <span className="ml-1.5">UTC</span>
            </div>
            <p className="text-zinc-400 dark:text-[#4c6876] text-[10px]">{utcDate}</p>
          </div>
          {/* Empty right spacer to keep clock centered */}
          <div className="w-[140px]" />
        </div>
      </div>

      {/* ═══════ Main content ═══════ */}
      <div className="max-w-[1400px] mx-auto px-4 py-5">

        {/* Top row: Map (3/5) + Stats (2/5) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Map - spans 3 columns (LEFT on desktop) */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <MilCard className="h-full overflow-hidden">
              <ThreatMap />
            </MilCard>
          </div>

          {/* Stats column - spans 2 columns (RIGHT on desktop) */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col gap-5">
            {/* Rockets Remaining */}
            <MilCard>
              <CardHeader emoji="🚀" title="Rockets Remaining" />
              <div className="px-5 pb-4">
                <div className="flex items-end justify-between mb-1">
                  <LedNumber value={data.rockets.remaining} color={C.rocketNum} />
                  <div className="text-right space-y-0.5 pb-1">
                    <div className="text-[11px] tracking-wider text-zinc-400 dark:text-[#466270]">STARTED</div>
                    <div className="text-lg font-[family-name:var(--font-orbitron)] font-bold text-zinc-600 dark:text-[#8caab9] tabular-nums leading-none">
                      {data.rockets.started.toLocaleString()}
                    </div>
                    <div className="text-[11px] tracking-wider text-zinc-400 dark:text-[#466270] mt-1">GONE</div>
                    <div className="text-lg font-[family-name:var(--font-orbitron)] font-bold tabular-nums leading-none" style={{ color: C.rocketNum }}>
                      {data.rockets.gone}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-[#5c7988] mb-3">
                  Ballistic missiles &amp; rockets in IRGC inventory
                </p>
                <ProgressBar percent={data.rockets.remainingPercent} color={C.rocketNum} />
              </div>
            </MilCard>

            {/* Launchers Remaining */}
            <MilCard>
              <CardHeader emoji="🎯" title="Launchers Remaining" />
              <div className="px-5 pb-4">
                <div className="flex items-end justify-between mb-1">
                  <LedNumber value={data.launchers.remaining} color={C.launcherNum} />
                  <div className="text-right space-y-0.5 pb-1">
                    <div className="text-[11px] tracking-wider text-zinc-400 dark:text-[#466270]">STARTED</div>
                    <div className="text-lg font-[family-name:var(--font-orbitron)] font-bold text-zinc-600 dark:text-[#8caab9] tabular-nums leading-none">
                      {data.launchers.started.toLocaleString()}
                    </div>
                    <div className="text-[11px] tracking-wider text-zinc-400 dark:text-[#466270] mt-1">GONE</div>
                    <div className="text-lg font-[family-name:var(--font-orbitron)] font-bold tabular-nums leading-none" style={{ color: C.rocketNum }}>
                      {data.launchers.gone}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-[#5c7988] mb-3">
                  Mobile erector launchers (MEL / TEL)
                </p>
                <ProgressBar percent={data.launchers.remainingPercent} color={C.launcherNum} />
              </div>
            </MilCard>

            {/* System Status */}
            <MilCard>
              <CardHeader emoji="⚙️" title="System Status" />
              <div className="px-5 pb-4 space-y-3">
                <StatusRow label="Auto-Scanner" value="Active" active />
                <StatusRow label="AI Parser" value="Online" active />
                <StatusRow label="Feeds" value={`${data.systemStatus.feeds} channels`} active />
                <StatusRow label="Interval" value={`${data.systemStatus.intervalMin} min`} active />
              </div>
              {data.systemStatus.lastScan && (
                <div className="px-5 pb-4 pt-0 space-y-0.5">
                  <p className="text-[11px] text-zinc-400 dark:text-[#466270]">
                    Last scan: <span className="font-[family-name:var(--font-share-tech-mono)] text-zinc-600 dark:text-[#8caab9] font-bold">{formatScanTime(data.systemStatus.lastScan)}</span>
                  </p>
                  {data.systemStatus.nextScan && (
                    <p className="text-[11px] text-zinc-400 dark:text-[#466270]">
                      Next scan: <span className="font-[family-name:var(--font-share-tech-mono)] text-zinc-600 dark:text-[#8caab9] font-bold">{formatScanTime(data.systemStatus.nextScan)}</span>
                    </p>
                  )}
                </div>
              )}
            </MilCard>
          </div>
        </div>

        {/* Bottom row: AI Parse Events (2/3) + Channels & Feed (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
          {/* AI Parse Events */}
          <div className="lg:col-span-2">
            <MilCard className="h-full">
              <CardHeader emoji="🧠" title="AI Parse Events" />
              <div className="px-5 pb-4">
                {/* Table header */}
                <div className="grid grid-cols-[70px_110px_1fr_60px_30px_30px_80px] gap-2 text-[10px] tracking-wider text-zinc-400 dark:text-[#466270] font-bold uppercase mb-2 pb-2 border-b border-zinc-100 dark:border-[#1b2b36]">
                  <span>Time</span>
                  <span>Source</span>
                  <span>Summary</span>
                  <span className="text-center">🚀</span>
                  <span className="text-center">🔥</span>
                  <span></span>
                  <span>Confidence</span>
                </div>
                {/* Table rows */}
                <div className="space-y-0">
                  {AI_EVENTS.map((evt, i) => (
                    <div key={i} className="grid grid-cols-[70px_110px_1fr_60px_30px_30px_80px] gap-2 py-2 border-b border-zinc-50 dark:border-[#0c1a24] text-[12px] items-center">
                      <span className="font-[family-name:var(--font-share-tech-mono)] text-zinc-400 dark:text-[#5c7988] text-[11px]">{evt.time}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium truncate text-[11px]">{evt.source}</span>
                      <span className="text-zinc-600 dark:text-[#8caab9] truncate text-[11px]">{evt.summary}</span>
                      <span className="text-center font-[family-name:var(--font-orbitron)] font-bold text-[#ff6f69] text-[12px]">{evt.delta}</span>
                      <span className="text-center text-zinc-400 dark:text-[#466270]">—</span>
                      <span></span>
                      <span className={`text-center text-[11px] font-medium ${
                        evt.confidence === 'High' ? 'text-emerald-600 dark:text-[#00ca62]' :
                        evt.confidence === 'Medium' ? 'text-amber-500' : 'text-zinc-400 dark:text-[#5c7988]'
                      }`}>{evt.confidence}</span>
                    </div>
                  ))}
                </div>
              </div>
            </MilCard>
          </div>

          {/* Right column: Channels + Feed */}
          <div className="space-y-5">
            {/* Monitored Channels */}
            <MilCard>
              <CardHeader emoji="📡" title="Monitored Channels" />
              <div className="px-5 pb-4 space-y-3">
                {CHANNELS.map((ch) => (
                  <div key={ch.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.green, boxShadow: `0 0 6px ${C.green}` }} />
                      <div>
                        <p className="text-[12px] font-medium text-zinc-700 dark:text-[#bedded]">{ch.name}</p>
                        <p className="text-[10px] text-zinc-400 dark:text-[#466270]">{ch.url}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded border" style={{
                      color: ch.color,
                      borderColor: ch.color + '40',
                      backgroundColor: ch.color + '10',
                    }}>
                      {ch.type}
                    </span>
                  </div>
                ))}
              </div>
            </MilCard>

            {/* Intelligence Feed */}
            <MilCard>
              <CardHeader emoji="📋" title="Intelligence Feed" />
              <div className="px-5 pb-4 space-y-3">
                {INTEL_FEED.map((item, i) => (
                  <div key={i} className="border-b border-zinc-50 dark:border-[#0c1a24] pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-medium text-blue-600 dark:text-blue-400">{item.source}</span>
                      <span className="text-[10px] font-[family-name:var(--font-share-tech-mono)] text-zinc-400 dark:text-[#5c7988]">{item.time}</span>
                    </div>
                    <p className="text-[12px] text-zinc-600 dark:text-[#8caab9] leading-relaxed" dir="rtl">{item.text}</p>
                  </div>
                ))}
              </div>
            </MilCard>
          </div>
        </div>

        {/* Timeline section */}
        <div className="mt-5">
          <MilCard>
            <CardHeader emoji="📊" title="Arsenal Timeline" />
            <div className="px-5 pb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.timeline.map((point, i) => {
                  const maxVal = data.timeline[0].missiles;
                  const pct = (point.missiles / maxVal) * 100;
                  const isLast = i === data.timeline.length - 1;
                  return (
                    <div key={point.date} className="flex items-center gap-3">
                      <span className="text-[11px] text-zinc-400 dark:text-[#5c7988] w-16 shrink-0 font-[family-name:var(--font-share-tech-mono)]">
                        {point.date}
                      </span>
                      <div className="flex-1 relative h-7 bg-zinc-100 dark:bg-[#0c1a24] rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-all duration-1000"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: isLast ? C.rocketNum : `${C.rocketNum}30`,
                          }}
                        />
                        <span className="absolute inset-0 flex items-center px-2">
                          <span className={`text-[10px] font-[family-name:var(--font-share-tech-mono)] font-bold ${
                            isLast ? 'text-white dark:text-white' : 'text-zinc-500 dark:text-[#5c7988]'
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
          </MilCard>
        </div>

        {/* Sources footer */}
        <div className="mt-5">
          <MilCard>
            <CardHeader emoji="🔍" title="Intelligence Sources" />
            <div className="px-5 pb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {data.sources.map((source) => (
                  <span
                    key={source}
                    className="px-3 py-1 text-[11px] font-medium bg-zinc-100 dark:bg-[#0c1a24] border border-zinc-200 dark:border-[#1b2b36] text-zinc-600 dark:text-[#8caab9] rounded"
                  >
                    {source}
                  </span>
                ))}
              </div>
              <div className="pt-3 border-t border-zinc-100 dark:border-[#1b2b36] flex items-center justify-between">
                <p className="text-[10px] text-zinc-400 dark:text-[#466270]">
                  Data from{' '}
                  <a href="https://iranrocketsarsenal.com" target="_blank" rel="noopener noreferrer"
                    className="text-[#ff6f69] hover:text-[#ff8f89] transition-colors">
                    iranrocketsarsenal.com
                  </a>
                </p>
                <p className="text-[10px] font-[family-name:var(--font-share-tech-mono)] text-zinc-400 dark:text-[#466270]">
                  Updated: {new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </MilCard>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MilCard — exact card wrapper
   bg: #07131c, border: #1b2b36, radius: 10px
   ═══════════════════════════════════════════ */
function MilCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[10px] border border-zinc-200 dark:border-[#1b2b36] bg-white dark:bg-[#07131c] ${className}`}>
      {children}
    </div>
  );
}

/* ═══════ Card section header ═══════ */
function CardHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-100 dark:border-[#1b2b36]">
      <span className="text-sm">{emoji}</span>
      <h3 className="text-zinc-700 dark:text-[#bedded] text-[13px] font-bold tracking-wider uppercase">
        {title}
      </h3>
    </div>
  );
}

/* ═══════ LED-style number (Orbitron, 72px, weight 900) ═══════ */
function LedNumber({ value, color }: { value: number; color: string }) {
  return (
    <div
      className="font-[family-name:var(--font-orbitron)] text-[72px] leading-[72px] font-black tabular-nums tracking-[0.02em]"
      style={{ color }}
    >
      {value.toLocaleString()}
    </div>
  );
}

/* ═══════ Progress bar ═══════ */
function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="text-zinc-400 dark:text-[#5c7988]">Remaining</span>
        <span className="font-bold" style={{ color }}>{percent}%</span>
      </div>
      <div className="h-2 bg-zinc-100 dark:bg-[#0c1a24] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

/* ═══════ System status row ═══════ */
function StatusRow({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: active ? C.green : '#ef4444',
            boxShadow: active ? `0 0 6px ${C.green}` : '0 0 6px #ef4444',
          }}
        />
        <span className="text-[12px] text-zinc-500 dark:text-[#8caab9]">{label}</span>
      </div>
      <span className="text-[12px] font-bold" style={{ color: active ? C.green : '#ef4444' }}>
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Threat Map visualization — SVG with animated arcs
   ═══════════════════════════════════════════ */
function ThreatMap() {
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
    <div className="p-4 h-full min-h-[420px] relative overflow-hidden bg-slate-100 dark:bg-[#060b14]" style={{ borderRadius: 'inherit' }}>
      {/* Background radial glow */}
      <div className="absolute inset-0 opacity-0 dark:opacity-40" style={{
        background: 'radial-gradient(ellipse 60% 50% at 68% 40%, rgba(220,38,38,0.2) 0%, transparent 70%)',
      }} />
      <div className="absolute inset-0 opacity-20 dark:opacity-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 68% 40%, rgba(220,38,38,0.08) 0%, transparent 70%)',
      }} />

      {/* Map header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-sm">🌍</span>
          <h3 className="text-zinc-600 dark:text-[#bedded] text-xs font-bold tracking-wider uppercase">
            Live Threat Visualization — Middle East Theater
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" style={{ boxShadow: '0 0 6px #ef4444' }} />
            <span className="text-red-500 dark:text-red-400 font-medium">LAUNCHES</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" style={{ boxShadow: '0 0 6px #60a5fa' }} />
            <span className="text-blue-600 dark:text-blue-400 font-medium">INTERCEPTIONS</span>
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
              <stop offset="0%" stopColor="rgba(220,38,38,0.3)" />
              <stop offset="40%" stopColor="rgba(220,38,38,0.1)" />
              <stop offset="100%" stopColor="rgba(220,38,38,0)" />
            </radialGradient>
            <radialGradient id="israel-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(96,165,250,0.25)" />
              <stop offset="60%" stopColor="rgba(96,165,250,0.06)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0)" />
            </radialGradient>
          </defs>

          <rect width="800" height="420" fill="url(#grid)" />

          {/* Region outlines */}
          <path d="M 240,55 Q 280,45 320,50 L 370,55 Q 400,50 420,60 L 440,75 Q 420,85 390,85 L 360,80 Q 330,90 300,85 L 260,80 Q 240,70 240,55 Z"
            fill="rgba(128,128,128,0.04)" stroke="rgba(128,128,128,0.12)" strokeWidth="0.8" />
          <path d="M 440,80 Q 480,70 530,75 L 580,85 Q 620,90 650,110 L 660,145 Q 670,180 660,210 L 640,240 Q 610,260 580,265 L 540,260 Q 510,250 490,235 L 460,215 Q 440,195 435,170 L 430,140 Q 430,110 440,80 Z"
            fill="rgba(220,38,38,0.06)" stroke="rgba(220,38,38,0.22)" strokeWidth="1.2" />
          <path d="M 360,80 Q 380,85 400,100 L 420,120 Q 435,145 440,170 L 445,200 Q 440,220 430,235 L 410,250 Q 390,260 370,255 L 350,240 Q 340,220 335,195 L 330,170 Q 330,140 340,115 L 350,95 Z"
            fill="rgba(128,128,128,0.03)" stroke="rgba(128,128,128,0.08)" strokeWidth="0.8" />
          <path d="M 310,220 Q 350,250 400,270 L 450,290 Q 500,300 530,280 L 560,270 Q 550,310 520,340 L 460,360 Q 400,370 350,350 L 310,320 Q 290,290 290,260 L 310,220 Z"
            fill="rgba(128,128,128,0.02)" stroke="rgba(128,128,128,0.06)" strokeWidth="0.6" />
          <path d="M 280,165 L 295,160 Q 300,170 298,185 L 295,205 Q 290,215 280,220 L 275,210 Q 270,195 272,180 L 280,165 Z"
            fill="rgba(96,165,250,0.1)" stroke="rgba(96,165,250,0.25)" strokeWidth="1" />
          <path d="M 220,175 Q 250,165 270,170 L 275,185 Q 275,210 270,230 L 260,260 Q 240,290 220,300 L 200,290 Q 190,260 190,230 L 195,200 Q 200,185 220,175 Z"
            fill="rgba(128,128,128,0.02)" stroke="rgba(128,128,128,0.06)" strokeWidth="0.6" />

          {/* Territory glow zones */}
          <ellipse cx="550" cy="165" rx="120" ry="90" fill="url(#iran-glow)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="550" cy="165" rx="70" ry="50" fill="none" stroke="rgba(220,38,38,0.15)" strokeWidth="1" strokeDasharray="3 6">
            <animate attributeName="strokeDashoffset" values="0;18" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="290" cy="190" rx="40" ry="30" fill="url(#israel-glow)">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
          </ellipse>

          {/* Threat arcs (red) */}
          {threatArcs.map((arc) => (
            <g key={arc.id}>
              <path d={arc.path} fill="none" stroke="rgba(239,68,68,0.18)" strokeWidth={arc.w + 4} filter="url(#glow-r)" />
              <path d={arc.path} fill="none" stroke="rgba(239,68,68,0.55)" strokeWidth={arc.w} strokeDasharray="8 6" strokeLinecap="round">
                <animate attributeName="strokeDashoffset" values="0;-28" dur={arc.dur} repeatCount="indefinite" />
              </path>
              <circle r="3.5" fill="#ef4444" filter="url(#glow-r)" opacity="0.9">
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
              <path d={arc.path} fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="5" filter="url(#glow-b)" />
              <path d={arc.path} fill="none" stroke="rgba(96,165,250,0.45)" strokeWidth="1.5" strokeDasharray="4 8" strokeLinecap="round">
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
            <animate attributeName="r" values="0;10;0" dur="3s" begin="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0" dur="3s" begin="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="480" cy="295" r="0" fill="rgba(239,68,68,0.4)" filter="url(#glow-r)">
            <animate attributeName="r" values="0;7;0" dur="2.5s" begin="2.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.6;0" dur="2.5s" begin="2.1s" repeatCount="indefinite" />
          </circle>

          {/* Cities */}
          <circle cx="545" cy="145" r="18" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="0.5">
            <animate attributeName="r" values="18;26;18" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="545" cy="145" r="5" fill="#ef4444" opacity="0.7" filter="url(#glow-city)">
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="545" cy="145" r="2" fill="#fca5a5" />
          <text x="545" y="132" textAnchor="middle" fill="#dc2626" fontSize="11" fontFamily="monospace" fontWeight="bold">Tehran</text>

          <circle cx="285" cy="193" r="14" fill="none" stroke="rgba(96,165,250,0.2)" strokeWidth="0.5">
            <animate attributeName="r" values="14;22;14" dur="3s" repeatCount="indefinite" />
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
      <div className="absolute bottom-3 left-4 flex items-center gap-5 text-[9px]">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-[2px] rounded" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
          <span className="text-red-500 dark:text-red-400/80 font-medium">Rocket Launch</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-[2px] rounded" style={{ backgroundColor: '#3b82f6', boxShadow: '0 0 6px #60a5fa' }} />
          <span className="text-blue-600 dark:text-blue-400/80 font-medium">Interception</span>
        </span>
      </div>

      {/* Coordinate labels along bottom */}
      <div className="absolute bottom-3 right-4 flex gap-8 text-[8px] font-[family-name:var(--font-share-tech-mono)] text-zinc-300 dark:text-zinc-700">
        <span>36°E</span><span>44°E</span><span>52°E</span><span>60°E</span><span>68°E</span><span>76°E</span>
      </div>
    </div>
  );
}

/* ═══════ Helpers ═══════ */
function formatScanTime(iso: string): string {
  const d = new Date(iso);
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  const s = d.getUTCSeconds().toString().padStart(2, '0');
  return `${mon} ${day}, ${h}:${m}:${s}`;
}
