'use client';

import { useArsenal } from '@/hooks/useArsenal';
import { useLanguage } from '@/hooks/useLanguage';
import { useState, useEffect, useMemo } from 'react';

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

/* ═══════════════════════════════════════════════════════
   Geographic data extracted from iranrocketsarsenal.com
   Real [longitude, latitude] coordinates for each country
   ═══════════════════════════════════════════════════════ */
const GEO = {
  iran: [[44,39.5],[45,39.2],[46.5,38.9],[47.8,38.5],[48.5,38.4],[50.1,37.4],[52.7,37.2],[54,37.6],[55.6,37.2],[56.4,36.5],[58,37.4],[59.6,37.2],[60.5,36.5],[61.2,35.6],[61.7,34.3],[60.8,33],[60.6,31.4],[61.4,29.9],[62.2,29.2],[62.6,26.6],[61.9,25.1],[58.5,25.6],[57.4,25.8],[56.9,27.1],[56.4,27.2],[55.7,26.2],[54.9,26.6],[54.4,25.7],[52.5,27],[51,27.8],[50.1,29.1],[49,30.2],[48,30],[47.2,30.7],[46.5,30.9],[45.4,31],[45,32],[44.2,33],[43.9,34],[44.5,35],[44.8,36],[44.3,37.1],[44,38],[44,39.5]],
  iraq: [[38.8,33.4],[39.2,32.2],[40,31.8],[41,31],[42,30.5],[43,30],[44.7,29.5],[46.4,29.1],[47.1,30],[47.4,31],[47.7,31.9],[47.8,33],[46.1,33.5],[45.5,34],[45,35],[44.8,36],[44.3,37.1],[43,37.4],[41.2,37.1],[40.7,36.3],[39.9,35.5],[39.1,34.3],[38.8,33.4]],
  syria: [[35.7,36.8],[36.6,36.5],[37.1,36.7],[38,36.9],[38.8,36.7],[40,36.8],[41.2,37.1],[42.4,37.1],[42.8,37.4],[41,37.6],[40,37],[39,36.7],[38.5,36],[37.5,35.5],[36.6,35.2],[36,35],[35.7,35.5],[35.7,36.8]],
  turkey: [[26,41.5],[28,41],[30,41],[32,41.5],[34,42],[36,42],[38,37.5],[40,38],[42,39],[44,39.5],[44.8,38],[43.5,37],[42,37.1],[41.2,37.1],[40,36.8],[38.8,36.7],[37,36.5],[36,36],[35.5,36.5],[35,37],[34,37],[32,36.5],[30,36],[28,36.5],[26.5,38],[26,39.5],[26,41.5]],
  saudi: [[36.9,29.2],[38,28],[39,27.5],[40,26.5],[42,25],[44,24],[46.5,24.1],[48.5,23.5],[50.5,24],[52,23],[55,22],[56,22.5],[57,21],[58,20],[58.5,18],[57.5,16.5],[55.5,15.5],[53,16.5],[51,18],[49,18.5],[46.5,17],[44,17.5],[43,17],[42.5,17.5],[41.5,19],[40.5,20],[39.5,21],[38.5,22],[37.5,23],[37,24.5],[37.5,26],[37,27],[36.9,29.2]],
  israel: [[34.5,33.1],[35,33.3],[35.7,33.1],[35.9,32.7],[35.6,32],[35.5,31.5],[35,31],[34.5,31.3],[34.3,31.6],[34.5,32],[34.5,33.1]],
  egypt: [[25,22],[34,22],[34.9,29.5],[34.5,31],[33,31.5],[32,31],[30,31.2],[28,30.8],[25,30],[25,22]],
  jordan: [[34.9,29.5],[36,29.2],[37,29.5],[38,30],[39,32],[38.5,32.5],[37,31.5],[36,31],[35.5,31.5],[35,31],[34.9,29.5]],
  lebanon: [[35.1,33.1],[35.7,33.1],[36.6,34.2],[36.4,34.7],[35.9,34.7],[35.1,33.9],[35.1,33.1]],
  uae: [[51.5,24],[54,24.5],[55.5,25],[56.5,24.5],[57,23.5],[58.5,23],[59.5,22],[58,21],[56,22],[54,23],[52,23],[51.5,24]],
  kuwait: [[46.5,29.1],[47.5,29],[48,29.5],[48,30],[47.1,30],[46.5,29.1]],
  afghanistan: [[61,35.6],[62.5,35.2],[63,35.9],[64.5,36.3],[66.5,37.4],[68,37],[69,37.5],[70.5,38],[71.5,37.9],[72,37],[71,36],[70,34.5],[69.5,33.5],[68,32],[66.5,31],[65,29.5],[63.5,29.5],[62,29.2],[61,29.5],[60.5,30],[60.5,31.5],[61,32.5],[61,35.6]],
  pakistan: [[62,29.2],[63.5,29.5],[65,29.5],[66.5,31],[68,32],[69.5,33.5],[70,34.5],[71,36],[72,37],[73,36.5],[74,37],[75,37.5],[76,35.5],[74.5,34],[73,31.5],[72,30],[71,28.5],[70,27.5],[68.5,26],[67,24.5],[66,23.5],[64.5,23],[63,25],[62,26.5],[62,29.2]],
};

/* Projection: [lon, lat] → [svgX, svgY] in 800×480 viewBox */
const P = { minLon: 24, maxLon: 76, minLat: 14, maxLat: 43 };
function gp(lon: number, lat: number): [number, number] {
  return [
    ((lon - P.minLon) / (P.maxLon - P.minLon)) * 800,
    ((P.maxLat - lat) / (P.maxLat - P.minLat)) * 480,
  ];
}
function toSvgPath(coords: number[][]): string {
  return coords.map((c, i) => {
    const [x, y] = gp(c[0], c[1]);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + ' Z';
}
function makeArc(f: number[], t: number[], bulge: number): string {
  const mx = (f[0] + t[0]) / 2, my = (f[1] + t[1]) / 2;
  const dx = t[0] - f[0], dy = t[1] - f[1];
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const cx = mx + (-dy / len) * bulge, cy = my + (dx / len) * bulge;
  return `M ${f[0].toFixed(0)},${f[1].toFixed(0)} Q ${cx.toFixed(0)},${cy.toFixed(0)} ${t[0].toFixed(0)},${t[1].toFixed(0)}`;
}

/* Country rendering config */
const COUNTRY_STYLES: { key: keyof typeof GEO; fill: string; stroke: string; sw: number }[] = [
  { key: 'turkey', fill: 'rgba(80,120,80,0.12)', stroke: 'rgba(100,140,100,0.3)', sw: 1 },
  { key: 'iran', fill: 'rgba(220,38,38,0.15)', stroke: 'rgba(220,38,38,0.5)', sw: 1.5 },
  { key: 'iraq', fill: 'rgba(120,80,60,0.1)', stroke: 'rgba(140,100,70,0.25)', sw: 0.8 },
  { key: 'syria', fill: 'rgba(120,100,80,0.08)', stroke: 'rgba(140,120,90,0.2)', sw: 0.7 },
  { key: 'saudi', fill: 'rgba(100,90,70,0.06)', stroke: 'rgba(120,110,80,0.15)', sw: 0.7 },
  { key: 'israel', fill: 'rgba(96,165,250,0.12)', stroke: 'rgba(96,165,250,0.35)', sw: 1 },
  { key: 'egypt', fill: 'rgba(120,110,80,0.06)', stroke: 'rgba(140,130,90,0.15)', sw: 0.7 },
  { key: 'jordan', fill: 'rgba(120,100,80,0.06)', stroke: 'rgba(140,120,90,0.15)', sw: 0.6 },
  { key: 'lebanon', fill: 'rgba(120,100,80,0.08)', stroke: 'rgba(140,120,90,0.2)', sw: 0.6 },
  { key: 'uae', fill: 'rgba(80,160,120,0.08)', stroke: 'rgba(100,180,140,0.2)', sw: 0.7 },
  { key: 'kuwait', fill: 'rgba(80,160,120,0.06)', stroke: 'rgba(100,180,140,0.15)', sw: 0.5 },
  { key: 'afghanistan', fill: 'rgba(100,90,70,0.04)', stroke: 'rgba(120,110,80,0.1)', sw: 0.5 },
  { key: 'pakistan', fill: 'rgba(100,90,70,0.04)', stroke: 'rgba(120,110,80,0.1)', sw: 0.5 },
];

/* City data with real geographic coordinates */
const CITY_DATA = [
  { name: 'Tehran', lon: 51.39, lat: 35.69, color: '#ef4444', sz: 6, ring: true, bold: true, fs: 12, dx: 5, dy: -15 },
  { name: 'Tel Aviv', lon: 34.79, lat: 32.07, color: '#3b82f6', sz: 5, ring: true, bold: true, fs: 11, dx: -25, dy: 22 },
  { name: 'Beirut', lon: 35.50, lat: 33.89, color: '#d97706', sz: 4, ring: false, bold: true, fs: 10, dx: -40, dy: -5 },
  { name: 'Baghdad', lon: 44.37, lat: 33.31, color: '#d97706', sz: 4, ring: false, bold: true, fs: 10, dx: 5, dy: -10 },
  { name: 'Incirlik', lon: 35.43, lat: 37.00, color: '#16a34a', sz: 4, ring: true, bold: true, fs: 10, dx: -50, dy: -7 },
  { name: 'Al Udeid', lon: 51.31, lat: 25.12, color: '#16a34a', sz: 4, ring: true, bold: true, fs: 10, dx: -55, dy: -5 },
  { name: 'Cairo', lon: 31.24, lat: 30.04, color: '#d97706', sz: 3.5, ring: false, bold: false, fs: 10, dx: -35, dy: -5 },
  { name: 'Riyadh', lon: 46.68, lat: 24.71, color: '#d97706', sz: 3.5, ring: false, bold: false, fs: 10, dx: -15, dy: 15 },
  { name: 'Dubai', lon: 55.27, lat: 25.20, color: '#16a34a', sz: 4, ring: true, bold: true, fs: 10, dx: 15, dy: 5 },
  { name: 'Isfahan', lon: 51.68, lat: 32.65, color: '#ef4444', sz: 3, ring: false, bold: false, fs: 9, dx: 10, dy: 10 },
  { name: 'B.Abbas', lon: 56.27, lat: 27.18, color: '#ef4444', sz: 3, ring: false, bold: false, fs: 9, dx: 15, dy: 5 },
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
   Threat Map — Real geographic coordinates
   projected to SVG with CSS + SMIL animations
   ═══════════════════════════════════════════ */
function ThreatMap() {
  /* Pre-compute projected city positions and arcs */
  const mapData = useMemo(() => {
    const cities = CITY_DATA.map(c => ({ ...c, cx: gp(c.lon, c.lat)[0], cy: gp(c.lon, c.lat)[1] }));
    const tehranPt = gp(51.39, 35.69);
    const telavivPt = gp(34.79, 32.07);
    const aludeidPt = gp(51.31, 25.12);
    const riyadhPt = gp(46.68, 24.71);
    const incirlikPt = gp(35.43, 37.00);
    const dubaiPt = gp(55.27, 25.20);

    const threatArcs = [
      { id: 'ir-il-1', path: makeArc(tehranPt, telavivPt, -80), dur: '3s', delay: '0s', w: 2.5 },
      { id: 'ir-il-2', path: makeArc(tehranPt, telavivPt, -50), dur: '3.5s', delay: '0.5s', w: 2 },
      { id: 'ir-il-3', path: makeArc(tehranPt, telavivPt, -120), dur: '4s', delay: '1s', w: 1.5 },
      { id: 'ir-qa', path: makeArc(tehranPt, aludeidPt, 40), dur: '2.5s', delay: '0.3s', w: 2 },
      { id: 'ir-riy', path: makeArc(tehranPt, riyadhPt, -30), dur: '3s', delay: '0.7s', w: 1.5 },
      { id: 'ir-in', path: makeArc(tehranPt, incirlikPt, -60), dur: '3.2s', delay: '1.2s', w: 1.5 },
      { id: 'ir-dub', path: makeArc(tehranPt, dubaiPt, 50), dur: '2.8s', delay: '1.5s', w: 1 },
    ];

    const interceptArcs = [
      { id: 'int-1', path: makeArc(telavivPt, [tehranPt[0] - 60, tehranPt[1] + 20], -40), dur: '2s', delay: '0.2s' },
      { id: 'int-2', path: makeArc(telavivPt, [tehranPt[0] - 100, tehranPt[1] + 10], -25), dur: '2.5s', delay: '0.8s' },
      { id: 'int-3', path: makeArc(telavivPt, [tehranPt[0] - 30, tehranPt[1] - 10], -50), dur: '2.2s', delay: '1.5s' },
      { id: 'int-4', path: makeArc(telavivPt, [tehranPt[0] + 10, tehranPt[1] + 5], -35), dur: '2.8s', delay: '2.0s' },
      { id: 'int-5', path: makeArc(telavivPt, [tehranPt[0] - 80, tehranPt[1] + 30], -20), dur: '2.3s', delay: '2.5s' },
    ];

    /* Center of Iran for glow */
    const iranCenter = gp(53, 32);
    const israelCenter = gp(34.8, 32);

    return { cities, threatArcs, interceptArcs, tehranPt, telavivPt, iranCenter, israelCenter };
  }, []);

  const { cities, threatArcs, interceptArcs, tehranPt, telavivPt, iranCenter, israelCenter } = mapData;

  /* Coordinate labels at projected positions */
  const latLabels = [40, 30, 24, 18].map(lat => ({ lat, y: gp(24, lat)[1] }));
  const lonLabels = [30, 40, 50, 60, 70].map(lon => ({ lon, x: gp(lon, 14)[0] }));

  return (
    <div className="p-4 h-full min-h-[420px] relative overflow-hidden bg-slate-100 dark:bg-[#060b14]" style={{ borderRadius: 'inherit' }}>
      {/* CSS animations */}
      <style>{`
        @keyframes dash-red { to { stroke-dashoffset: -28; } }
        @keyframes dash-blue { to { stroke-dashoffset: 24; } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes pulse-glow2 { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes intercept-dot { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
      `}</style>

      {/* Background radial glow */}
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

      {/* SVG map */}
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

          {/* ═══ Country shapes — real geographic coordinates ═══ */}
          {COUNTRY_STYLES.map(cs => (
            <path key={cs.key} d={toSvgPath(GEO[cs.key])} fill={cs.fill} stroke={cs.stroke} strokeWidth={cs.sw} />
          ))}

          {/* Territory glow zones */}
          <ellipse cx={iranCenter[0]} cy={iranCenter[1]} rx={140} ry={110} fill="url(#iran-glow)" style={{ animation: 'pulse-glow 4s ease-in-out infinite' }} />
          <ellipse cx={iranCenter[0]} cy={iranCenter[1]} rx={80} ry={60} fill="none" stroke="rgba(220,38,38,0.2)" strokeWidth="1.2" strokeDasharray="4 8">
            <animate attributeName="stroke-dashoffset" values="0;24" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx={israelCenter[0]} cy={israelCenter[1]} rx={40} ry={35} fill="url(#israel-glow)" style={{ animation: 'pulse-glow2 3s ease-in-out infinite' }} />

          {/* ═══ Threat arcs (red) ═══ */}
          {threatArcs.map((arc) => (
            <g key={arc.id}>
              <path d={arc.path} fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth={arc.w + 6} filter="url(#glow-r)" />
              <path d={arc.path} fill="none" stroke="rgba(239,68,68,0.65)" strokeWidth={arc.w} strokeDasharray="8 6" strokeLinecap="round"
                style={{ animation: `dash-red ${arc.dur} linear infinite` }} />
              <circle r="4" fill="#ef4444" filter="url(#glow-r)" opacity="0.95">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
              <circle r="2" fill="#fca5a5">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
            </g>
          ))}

          {/* ═══ Intercept arcs (blue) ═══ */}
          {interceptArcs.map((arc) => (
            <g key={arc.id}>
              <path d={arc.path} fill="none" stroke="rgba(96,165,250,0.18)" strokeWidth="6" filter="url(#glow-b)" />
              <path d={arc.path} fill="none" stroke="rgba(96,165,250,0.55)" strokeWidth="1.8" strokeDasharray="4 8" strokeLinecap="round"
                style={{ animation: `dash-blue ${arc.dur} linear infinite` }} />
              <circle r="3" fill="#60a5fa" filter="url(#glow-b)" opacity="0.9">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
              <circle r="1.2" fill="#93c5fd">
                <animateMotion dur={arc.dur} begin={arc.delay} repeatCount="indefinite" path={arc.path} />
              </circle>
            </g>
          ))}

          {/* Impact flashes */}
          <circle cx={telavivPt[0]} cy={telavivPt[1]} r="0" fill="rgba(239,68,68,0.7)" filter="url(#glow-r)">
            <animate attributeName="r" values="0;12;0" dur="3s" begin="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0" dur="3s" begin="2.8s" repeatCount="indefinite" />
          </circle>

          {/* Intercept markers near Iran */}
          {[
            [tehranPt[0] - 50, tehranPt[1] + 40, 3.5],
            [tehranPt[0] - 30, tehranPt[1] + 60, 3],
            [tehranPt[0] - 70, tehranPt[1] + 55, 2.5],
            [tehranPt[0] + 10, tehranPt[1] + 50, 3],
            [tehranPt[0] - 90, tehranPt[1] + 45, 2.5],
          ].map((m, i) => (
            <circle key={`im-${i}`} cx={m[0]} cy={m[1]} r={m[2]} fill="#60a5fa" opacity="0.6" filter="url(#glow-b)"
              style={{ animation: `intercept-dot ${3 + i * 0.3}s ease-in-out ${i * 0.5}s infinite` }} />
          ))}

          {/* ═══ Cities ═══ */}
          {cities.map(c => (
            <g key={c.name}>
              {c.ring && (
                <>
                  <circle cx={c.cx} cy={c.cy} r={c.sz * 3} fill="none" stroke={`${c.color}40`} strokeWidth="0.8">
                    <animate attributeName="r" values={`${c.sz * 3};${c.sz * 5};${c.sz * 3}`} dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
                  </circle>
                  {c.color === '#16a34a' && (
                    <circle cx={c.cx} cy={c.cy} r={c.sz * 2} fill="none" stroke={`${c.color}40`} strokeWidth="0.6" />
                  )}
                </>
              )}
              <circle cx={c.cx} cy={c.cy} r={c.sz} fill={c.color} opacity="0.8" filter="url(#glow-city)">
                {c.name === 'Tehran' && <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />}
                {c.name === 'Tel Aviv' && <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />}
              </circle>
              <circle cx={c.cx} cy={c.cy} r={c.sz * 0.4}
                fill={c.color === '#ef4444' ? '#fca5a5' : c.color === '#3b82f6' ? '#bfdbfe' : '#86efac'} />
              <text x={c.cx + c.dx} y={c.cy + c.dy} textAnchor={c.dx < 0 ? 'end' : 'start'}
                fill={c.color} fontSize={c.fs} fontFamily="monospace" fontWeight={c.bold ? 'bold' : 'normal'}
                opacity="0.9">{c.name}</text>
            </g>
          ))}

          {/* Coordinate labels */}
          {latLabels.map(l => (
            <text key={`lat-${l.lat}`} x="12" y={l.y} fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">{l.lat}&deg;N</text>
          ))}
          {lonLabels.map(l => (
            <text key={`lon-${l.lon}`} x={l.x} y="472" fill="rgba(128,128,128,0.2)" fontSize="9" fontFamily="monospace">{l.lon}&deg;E</text>
          ))}
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
        <span>30&deg;E</span><span>40&deg;E</span><span>50&deg;E</span><span>60&deg;E</span><span>70&deg;E</span>
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
