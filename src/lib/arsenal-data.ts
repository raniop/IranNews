import { ArsenalData } from './types';

export const ARSENAL_BASELINE: ArsenalData = {
  lastUpdated: '2026-03-01T00:00:00Z',
  missiles: {
    currentEstimate: 1500,
    peakInventory: 3000,
    peakSource: 'CENTCOM 2022',
    depletedJune2025: { low: 1000, high: 1200 },
  },
  launchers: {
    totalFleet: 200,
    lossesPercent: 33,
  },
  timeline: [
    { date: '2022-01', missiles: 3000, label: 'CENTCOM Peak Estimate' },
    { date: '2024-04', missiles: 2800, label: 'Pre-April 2024 Strike' },
    { date: '2024-10', missiles: 2500, label: 'Pre-October 2024 Strike' },
    { date: '2025-06', missiles: 2200, label: 'Pre-June 2025 Conflict' },
    { date: '2025-09', missiles: 1100, label: 'Post-Conflict Depletion' },
    { date: '2026-02', missiles: 1500, label: 'Partial Rebuild (Current)' },
  ],
  sources: ['CENTCOM', 'IranWatch', '19FortyFive', 'Israel-Alma', 'ISW'],
};
