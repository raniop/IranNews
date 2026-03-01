import { SentimentDataPoint, SentimentIndex } from './types';

/**
 * Baseline survey data points from verified research studies.
 * Each entry contains an explicit percentage from a published survey or study.
 * Phase 2 will add AI-powered extraction of new data points from news articles.
 */
export const BASELINE_DATA_POINTS: SentimentDataPoint[] = [
  // GAMAAN (Group for Analyzing and Measuring Attitudes in Iran) — Netherlands-based
  {
    id: 'gamaan-2022-oppose',
    percentage: 81,
    type: 'oppose',
    description: 'do not want an Islamic Republic',
    source: 'GAMAAN Survey 2022',
    organization: 'Group for Analyzing and Measuring Attitudes in Iran',
    date: '2022-06-01',
    url: 'https://gamaan.org/surveys',
    sampleSize: 200000,
  },
  {
    id: 'gamaan-2022-change',
    percentage: 60,
    type: 'oppose',
    description: 'support regime change',
    source: 'GAMAAN Survey 2022',
    organization: 'Group for Analyzing and Measuring Attitudes in Iran',
    date: '2022-06-01',
    url: 'https://gamaan.org/surveys',
    sampleSize: 200000,
  },
  {
    id: 'gamaan-2022-protests',
    percentage: 80,
    type: 'oppose',
    description: 'support nationwide protests',
    source: 'GAMAAN Survey 2022',
    organization: 'Group for Analyzing and Measuring Attitudes in Iran',
    date: '2022-09-01',
    url: 'https://gamaan.org/surveys',
    sampleSize: 158000,
  },
  {
    id: 'gamaan-2022-support',
    percentage: 15,
    type: 'support',
    description: 'support the Islamic Republic system',
    source: 'GAMAAN Survey 2022',
    organization: 'Group for Analyzing and Measuring Attitudes in Iran',
    date: '2022-06-01',
    url: 'https://gamaan.org/surveys',
    sampleSize: 200000,
  },

  // IranPoll / University of Maryland CISSM
  {
    id: 'iranpoll-umd-2023-dissatisfied',
    percentage: 68,
    type: 'oppose',
    description: 'dissatisfied with economic situation',
    source: 'IranPoll / UMD CISSM 2023',
    organization: 'University of Maryland Center for International & Security Studies',
    date: '2023-01-15',
    url: 'https://cissm.umd.edu/research-impact/publications',
    sampleSize: 1500,
  },
  {
    id: 'iranpoll-umd-2023-distrust-govt',
    percentage: 57,
    type: 'oppose',
    description: 'have little or no trust in government',
    source: 'IranPoll / UMD CISSM 2023',
    organization: 'University of Maryland Center for International & Security Studies',
    date: '2023-01-15',
    url: 'https://cissm.umd.edu/research-impact/publications',
    sampleSize: 1500,
  },
  {
    id: 'iranpoll-umd-2023-system-ok',
    percentage: 30,
    type: 'support',
    description: 'satisfied with political system direction',
    source: 'IranPoll / UMD CISSM 2023',
    organization: 'University of Maryland Center for International & Security Studies',
    date: '2023-01-15',
    url: 'https://cissm.umd.edu/research-impact/publications',
    sampleSize: 1500,
  },

  // Pew Research Center
  {
    id: 'pew-2013-dissatisfied',
    percentage: 56,
    type: 'oppose',
    description: 'dissatisfied with country direction',
    source: 'Pew Global Attitudes 2013',
    organization: 'Pew Research Center',
    date: '2013-06-11',
    url: 'https://www.pewresearch.org/global/2013/06/11/iranian-public-opinion/',
  },
  {
    id: 'pew-2013-satisfied',
    percentage: 40,
    type: 'support',
    description: 'satisfied with country direction',
    source: 'Pew Global Attitudes 2013',
    organization: 'Pew Research Center',
    date: '2013-06-11',
    url: 'https://www.pewresearch.org/global/2013/06/11/iranian-public-opinion/',
  },

  // World Values Survey Wave 7 (2017-2022)
  {
    id: 'wvs-2020-no-confidence',
    percentage: 65,
    type: 'oppose',
    description: 'have no or little confidence in government',
    source: 'World Values Survey Wave 7',
    organization: 'World Values Survey Association',
    date: '2020-01-01',
    url: 'https://www.worldvaluessurvey.org/WVSDocumentationWV7.jsp',
  },
  {
    id: 'wvs-2020-confidence',
    percentage: 22,
    type: 'support',
    description: 'express confidence in government',
    source: 'World Values Survey Wave 7',
    organization: 'World Values Survey Association',
    date: '2020-01-01',
    url: 'https://www.worldvaluessurvey.org/WVSDocumentationWV7.jsp',
  },
  {
    id: 'wvs-2020-neutral',
    percentage: 13,
    type: 'neutral',
    description: 'neither confident nor unconfident in government',
    source: 'World Values Survey Wave 7',
    organization: 'World Values Survey Association',
    date: '2020-01-01',
    url: 'https://www.worldvaluessurvey.org/WVSDocumentationWV7.jsp',
  },
];

/**
 * Calculate the sentiment index from data points.
 * Groups by type (oppose/support/neutral) and averages percentages.
 */
export function calculateIndex(dataPoints: SentimentDataPoint[]): SentimentIndex {
  const groups: Record<'oppose' | 'support' | 'neutral', number[]> = {
    oppose: [],
    support: [],
    neutral: [],
  };

  for (const dp of dataPoints) {
    groups[dp.type].push(dp.percentage);
  }

  const avg = (arr: number[]) =>
    arr.length > 0 ? Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10 : 0;

  const opposeAvg = avg(groups.oppose);
  const supportAvg = avg(groups.support);

  // If we have direct neutral data, use it; otherwise derive from 100 - oppose - support
  const neutralAvg =
    groups.neutral.length > 0
      ? avg(groups.neutral)
      : Math.round((100 - opposeAvg - supportAvg) * 10) / 10;

  // Collect unique source names
  const uniqueSources = [...new Set(dataPoints.map((dp) => dp.organization))];

  return {
    lastUpdated: new Date().toISOString(),
    oppose: { average: opposeAvg, dataPoints: groups.oppose.length },
    support: { average: supportAvg, dataPoints: groups.support.length },
    neutral: { average: neutralAvg, dataPoints: groups.neutral.length },
    dataPoints,
    disclaimer:
      'Population Sentiment Index is based exclusively on verified numerical data from surveys, research studies, and statistically valid sources. It does not use article counts, media sentiment, or text analysis. Sources: ' +
      uniqueSources.join(', ') +
      '.',
  };
}
