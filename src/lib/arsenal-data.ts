import { ArsenalData } from './types';

export const ARSENAL_BASELINE: ArsenalData = {
  lastUpdated: '2026-03-01T17:30:00Z',
  rockets: {
    remaining: 989,
    started: 1500,
    gone: 511,
    remainingPercent: 65.9,
  },
  launchers: {
    remaining: 187,
    started: 200,
    gone: 13,
    remainingPercent: 93.5,
  },
  systemStatus: {
    autoScanner: true,
    aiParser: true,
    feeds: 4,
    intervalMin: 10,
  },
  timeline: [
    { date: '2022-01', missiles: 3000, label: 'CENTCOM Peak Estimate' },
    { date: '2024-04', missiles: 2800, label: 'Pre-April 2024 Strike' },
    { date: '2024-10', missiles: 2500, label: 'Pre-October 2024 Strike' },
    { date: '2025-06', missiles: 2200, label: 'Pre-June 2025 Conflict' },
    { date: '2025-09', missiles: 1100, label: 'Post-Conflict Depletion' },
    { date: '2026-02', missiles: 989, label: 'Current Estimate' },
  ],
  sources: ['CENTCOM', 'IranWatch', '19FortyFive', 'Israel-Alma', 'ISW', 'TRT World', 'NPR', 'BBC'],
};
