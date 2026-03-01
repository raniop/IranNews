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
  /* Threat arcs: Iran → targets */
  const threatArcs = [
    { id: 'ir-il-1', path: 'M 590,200 Q 440,110 240,250', dur: '3s', delay: '0s', w: 2.5 },
    { id: 'ir-il-2', path: 'M 580,215 Q 420,130 235,255', dur: '3.5s', delay: '0.5s', w: 2 },
    { id: 'ir-il-3', path: 'M 575,210 Q 460,90 245,245', dur: '4s', delay: '1s', w: 1.5 },
    { id: 'ir-qa', path: 'M 610,250 Q 570,340 530,380', dur: '2.5s', delay: '0.3s', w: 2 },
    { id: 'ir-kw', path: 'M 580,240 Q 500,310 420,355', dur: '3s', delay: '0.7s', w: 1.5 },
    { id: 'ir-in', path: 'M 560,175 Q 470,100 310,90', dur: '3.2s', delay: '1.2s', w: 1.5 },
    { id: 'ir-dub', path: 'M 625,260 Q 630,340 640,380', dur: '2.8s', delay: '1.5s', w: 1 },
  ];

  const interceptArcs = [
    { id: 'int-1', path: 'M 245,248 Q 320,170 430,160', dur: '2s', delay: '0.2s' },
    { id: 'int-2', path: 'M 240,255 Q 290,190 380,175', dur: '2.5s', delay: '0.8s' },
    { id: 'int-3', path: 'M 248,243 Q 350,140 450,145', dur: '2.2s', delay: '1.5s' },
    { id: 'int-4', path: 'M 242,250 Q 360,160 480,165', dur: '2.8s', delay: '2.0s' },
    { id: 'int-5', path: 'M 246,252 Q 300,200 400,180', dur: '2.3s', delay: '2.5s' },
  ];

  return (
    <div className="p-4 h-full min-h-[420px] relative overflow-hidden bg-slate-100 dark:bg-[#060b14]" style={{ borderRadius: 'inherit' }}>
      {/* Background radial glow - much brighter */}
      <div className="absolute inset-0 opacity-0 dark:opacity-60" style={{
        background: 'radial-gradient(ellipse 55% 50% at 62% 42%, rgba(220,38,38,0.25) 0%, transparent 65%)',
      }} />
      <div className="absolute inset-0 opacity-20 dark:opacity-0" style={{
        background: 'radial-gradient(ellipse 55% 50% at 62% 42%, rgba(220,38,38,0.1) 0%, transparent 65%)',
      }} />

      {/* Map header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
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

      {/* SVG map - zoomed in tighter */}
      <div className="relative w-full h-[390px]">
        <svg viewBox="0 0 800 480" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(128,128,128,0.06)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow-r" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-b" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-city" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="iran-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(220,38,38,0.4)" />
              <stop offset="35%" stopColor="rgba(220,38,38,0.15)" />
              <stop offset="100%" stopColor="rgba(220,38,38,0)" />
            </radialGradient>
            <radialGradient id="israel-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(96,165,250,0.3)" />
              <stop offset="60%" stopColor="rgba(96,165,250,0.08)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0)" />
            </radialGradient>
          </defs>

          <rect width="800" height="480" fill="url(#grid)" />

          {/* ═══ Country shapes (approximate geography, zoomed to Middle East) ═══ */}
          {/* Turkey */}
          <path d="M 160,30 L 220,20 280,15 340,20 380,40 350,55 310,52 280,58 260,65 230,75 200,70 170,55 155,45 Z"
            fill="rgba(80,120,80,0.12)" stroke="rgba(100,140,100,0.3)" strokeWidth="1" />
          <path d="M 380,40 L 420,30 460,25 500,35 520,50 490,65 450,70 420,60 390,55 380,40 Z"
            fill="rgba(80,120,80,0.1)" stroke="rgba(100,140,100,0.25)" strokeWidth="0.8" />

          {/* Iran — BIG RED prominent fill */}
          <path d="M 500,70 L 540,55 590,50 650,65 700,90 740,120 755,170 760,220 740,270 710,300 670,320 630,310 600,290 560,300 520,290 490,270 470,240 460,200 465,160 475,120 490,90 Z"
            fill="rgba(220,38,38,0.15)" stroke="rgba(220,38,38,0.5)" strokeWidth="1.5" />

          {/* Iraq */}
          <path d="M 370,70 L 420,60 465,75 490,90 475,120 465,160 460,200 445,220 420,240 390,250 360,235 345,210 340,180 345,150 350,120 355,95 Z"
            fill="rgba(120,80,60,0.1)" stroke="rgba(140,100,70,0.25)" strokeWidth="0.8" />

          {/* Syria / Lebanon */}
          <path d="M 265,75 L 300,65 340,70 355,95 350,120 340,140 310,150 280,145 260,130 250,105 255,85 Z"
            fill="rgba(120,100,80,0.08)" stroke="rgba(140,120,90,0.2)" strokeWidth="0.7" />

          {/* Israel / Palestine — blue tint */}
          <path d="M 230,160 L 248,150 260,165 258,195 255,220 248,240 235,250 225,235 220,210 222,185 225,170 Z"
            fill="rgba(96,165,250,0.12)" stroke="rgba(96,165,250,0.35)" strokeWidth="1" />

          {/* Egypt */}
          <path d="M 80,200 L 130,170 175,165 210,175 220,210 225,250 220,300 200,360 160,400 110,410 70,380 50,330 45,280 55,240 Z"
            fill="rgba(120,110,80,0.06)" stroke="rgba(140,130,90,0.15)" strokeWidth="0.7" />

          {/* Saudi Arabia — large */}
          <path d="M 255,260 L 310,240 370,250 420,260 470,260 520,300 560,320 580,360 570,400 530,430 470,450 400,445 330,420 280,390 260,350 250,310 Z"
            fill="rgba(100,90,70,0.06)" stroke="rgba(120,110,80,0.15)" strokeWidth="0.7" />

          {/* UAE / Qatar / Bahrain area */}
          <path d="M 570,340 L 620,330 660,340 670,365 655,390 620,395 585,380 575,360 Z"
            fill="rgba(80,160,120,0.08)" stroke="rgba(100,180,140,0.2)" strokeWidth="0.7" />

          {/* Yemen */}
          <path d="M 350,430 L 420,450 480,455 520,445 540,430 530,460 480,475 400,475 340,460 Z"
            fill="rgba(100,90,70,0.04)" stroke="rgba(120,110,80,0.1)" strokeWidth="0.5" />

          {/* Territory glow zones — brighter */}
          <ellipse cx="610" cy="200" rx="140" ry="110" fill="url(#iran-glow)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="610" cy="200" rx="80" ry="60" fill="none" stroke="rgba(220,38,38,0.2)" strokeWidth="1.2" strokeDasharray="4 8">
            <animate attributeName="strokeDashoffset" values="0;24" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="245" cy="240" rx="40" ry="35" fill="url(#israel-glow)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
          </ellipse>

          {/* ═══ Threat arcs (red) — brighter ═══ */}
          {threatArcs.map((arc) => (
            <g key={arc.id}>
              <path d={arc.path} fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth={arc.w + 6} filter="url(#glow-r)" />
              <path d={arc.path} fill="none" stroke="rgba(239,68,68,0.65)" strokeWidth={arc.w} strokeDasharray="8 6" strokeLinecap="round">
                <animate attributeName="strokeDashoffset" values="0;-28" dur={arc.dur} repeatCount="indefinite" />
              </path>
              <circle r="4" fill="#ef4444" filter="url(#glow-r)" opacity="0.95">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
              <circle r="2" fill="#fca5a5">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
            </g>
          ))}

          {/* ═══ Intercept arcs (blue) — brighter, more of them ═══ */}
          {interceptArcs.map((arc) => (
            <g key={arc.id}>
              <path d={arc.path} fill="none" stroke="rgba(96,165,250,0.18)" strokeWidth="6" filter="url(#glow-b)" />
              <path d={arc.path} fill="none" stroke="rgba(96,165,250,0.55)" strokeWidth="1.8" strokeDasharray="4 8" strokeLinecap="round">
                <animate attributeName="strokeDashoffset" values="0;24" dur={arc.dur} repeatCount="indefinite" />
              </path>
              <circle r="3" fill="#60a5fa" filter="url(#glow-b)" opacity="0.9">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
              <circle r="1.2" fill="#93c5fd">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
            </g>
          ))}

          {/* Impact flashes */}
          <circle cx="245" cy="248" r="0" fill="rgba(239,68,68,0.7)" filter="url(#glow-r)">
            <animate attributeName="r" values="0;12;0" dur="3s" begin="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="530" cy="380" r="0" fill="rgba(239,68,68,0.5)" filter="url(#glow-r)">
            <animate attributeName="r" values="0;8;0" dur="2.5s" begin="2.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.7;0" dur="2.5s" begin="2.1s" repeatCount="indefinite" />
          </circle>

          {/* ═══ Cities — larger, brighter, more prominent ═══ */}
          {/* Tehran — main threat city */}
          <circle cx="595" cy="185" r="22" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="0.8">
            <animate attributeName="r" values="22;32;22" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="595" cy="185" r="6" fill="#ef4444" opacity="0.8" filter="url(#glow-city)">
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="595" cy="185" r="2.5" fill="#fca5a5" />
          <text x="600" y="170" textAnchor="start" fill="#ef4444" fontSize="12" fontFamily="monospace" fontWeight="bold" opacity="0.9">Tehran</text>

          {/* Tel Aviv — defense city */}
          <circle cx="240" cy="248" r="16" fill="none" stroke="rgba(96,165,250,0.25)" strokeWidth="0.8">
            <animate attributeName="r" values="16;26;16" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="240" cy="248" r="5" fill="#3b82f6" opacity="0.9" filter="url(#glow-city)">
            <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="240" cy="248" r="2" fill="#bfdbfe" />
          <text x="215" y="270" textAnchor="middle" fill="#60a5fa" fontSize="11" fontFamily="monospace" fontWeight="bold">Tel Aviv</text>

          {/* Beirut */}
          <circle cx="258" cy="195" r="4" fill="#d97706" opacity="0.7" filter="url(#glow-city)" />
          <text x="240" y="190" textAnchor="end" fill="rgba(217,119,6,0.85)" fontSize="10" fontFamily="monospace" fontWeight="bold">Beirut</text>

          {/* Baghdad */}
          <circle cx="420" cy="185" r="4" fill="#d97706" opacity="0.65" filter="url(#glow-city)" />
          <text x="425" y="175" textAnchor="start" fill="rgba(217,119,6,0.75)" fontSize="10" fontFamily="monospace" fontWeight="bold">Baghdad</text>

          {/* Incirlik — US base, green */}
          <circle cx="310" cy="85" r="4" fill="#16a34a" opacity="0.8" filter="url(#glow-city)" />
          <circle cx="310" cy="85" r="8" fill="none" stroke="rgba(22,163,74,0.3)" strokeWidth="0.6" />
          <text x="295" y="78" textAnchor="end" fill="rgba(22,163,74,0.9)" fontSize="10" fontFamily="monospace" fontWeight="bold">Incirlik</text>

          {/* Al Udeid — US base, green */}
          <circle cx="535" cy="380" r="4" fill="#16a34a" opacity="0.7" filter="url(#glow-city)" />
          <circle cx="535" cy="380" r="8" fill="none" stroke="rgba(22,163,74,0.25)" strokeWidth="0.6" />
          <text x="520" y="375" textAnchor="end" fill="rgba(22,163,74,0.85)" fontSize="10" fontFamily="monospace" fontWeight="bold">Al Udeid</text>

          {/* Cairo */}
          <circle cx="160" cy="275" r="3.5" fill="#d97706" opacity="0.5" filter="url(#glow-city)" />
          <text x="145" y="270" textAnchor="end" fill="rgba(217,119,6,0.6)" fontSize="10" fontFamily="monospace">Cairo</text>

          {/* Riyadh */}
          <circle cx="420" cy="355" r="3.5" fill="#d97706" opacity="0.45" filter="url(#glow-city)" />
          <text x="405" y="365" textAnchor="end" fill="rgba(217,119,6,0.55)" fontSize="10" fontFamily="monospace">Riyadh</text>

          {/* Dubai — green, US allied */}
          <circle cx="645" cy="380" r="4" fill="#16a34a" opacity="0.7" filter="url(#glow-city)" />
          <circle cx="645" cy="380" r="8" fill="none" stroke="rgba(22,163,74,0.2)" strokeWidth="0.5" />
          <text x="660" y="385" textAnchor="start" fill="rgba(22,163,74,0.8)" fontSize="10" fontFamily="monospace" fontWeight="bold">Dubai</text>

          {/* Isfahan — secondary Iran city */}
          <circle cx="590" cy="240" r="3" fill="#ef4444" opacity="0.5" filter="url(#glow-city)" />
          <text x="600" y="250" textAnchor="start" fill="rgba(239,68,68,0.5)" fontSize="9" fontFamily="monospace">Isfahan</text>

          {/* Bandar Abbas */}
          <circle cx="670" cy="295" r="3" fill="#ef4444" opacity="0.4" filter="url(#glow-city)" />
          <text x="685" y="300" textAnchor="start" fill="rgba(239,68,68,0.45)" fontSize="9" fontFamily="monospace">B.Abbas</text>

          {/* Intercept markers near Iran — blue dots showing successful intercepts */}
          <circle cx="520" cy="170" r="3.5" fill="#60a5fa" opacity="0.7" filter="url(#glow-b)">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="540" cy="195" r="3" fill="#60a5fa" opacity="0.6" filter="url(#glow-b)">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.5s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="505" cy="200" r="2.5" fill="#60a5fa" opacity="0.5" filter="url(#glow-b)">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="555" cy="210" r="3" fill="#60a5fa" opacity="0.6" filter="url(#glow-b)">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.2s" begin="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="480" cy="180" r="2.5" fill="#60a5fa" opacity="0.5" filter="url(#glow-b)">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.8s" begin="2s" repeatCount="indefinite" />
          </circle>

          {/* Coordinate labels — more visible */}
          <text x="12" y="55" fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">40°N</text>
          <text x="12" y="175" fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">30°N</text>
          <text x="12" y="295" fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">24°N</text>
          <text x="12" y="430" fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">18°N</text>
          <text x="150" y="472" fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">30°E</text>
          <text x="330" y="472" fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">40°E</text>
          <text x="510" y="472" fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">50°E</text>
          <text x="680" y="472" fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">60°E</text>
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
      <div className="absolute bottom-3 right-4 flex gap-6 text-[8px] font-[family-name:var(--font-share-tech-mono)] text-zinc-300 dark:text-zinc-600">
        <span>30°E</span><span>40°E</span><span>50°E</span><span>60°E</span><span>70°E</span>
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
