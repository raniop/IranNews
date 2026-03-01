// News category enum matching iOS app
export type NewsCategory = 'proRegime' | 'opposition' | 'neutral' | 'telegram';

export const CATEGORY_CONFIG: Record<NewsCategory, {
  displayName: string;
  hebrewName: string;
  color: string;
  bgColor: string;
  emoji: string;
}> = {
  proRegime: {
    displayName: 'Pro-Regime',
    hebrewName: 'תומכי משטר',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    emoji: '🟥',
  },
  opposition: {
    displayName: 'Opposition',
    hebrewName: 'אופוזיציה',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    emoji: '🟦',
  },
  neutral: {
    displayName: 'Neutral',
    hebrewName: 'ניטרלי',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    emoji: '🟨',
  },
  telegram: {
    displayName: 'Telegram',
    hebrewName: 'טלגרם',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    emoji: '📨',
  },
};

export const ALL_CATEGORIES: NewsCategory[] = ['proRegime', 'opposition', 'neutral', 'telegram'];

export type FetchMethod = 'rss' | 'scrape' | 'jsonAPI' | 'telegram' | 'unavailable';

export interface ScrapingConfig {
  articleSelector: string;
  titleSelector: string;
  linkSelector: string;
  descriptionSelector?: string;
  imageSelector?: string;
  dateSelector?: string;
  dateFormat?: string;
  baseURLForRelativeLinks?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  category: NewsCategory;
  baseURL: string;
  rssURL?: string;
  scrapingConfig?: ScrapingConfig;
  jsonAPIURL?: string;
  isEnabled: boolean;
  fetchMethod: FetchMethod;
}

export interface Article {
  id: string; // SHA-256 hash of URL
  title: string;
  titleHebrew?: string;
  articleDescription?: string;
  descriptionHebrew?: string;
  content?: string;
  url: string;
  imageURL?: string;
  author?: string;
  publishedDate: string; // ISO string
  sourceID: string;
  category: NewsCategory;
  isRead?: boolean;
  isBookmarked?: boolean;
  trendingScore?: number;
}

export interface AIAnalysis {
  sentimentScore: number; // -1.0 to 1.0
  sentimentLabel: string;
  biasIndicators: string[];
  explanation: string;
}

export interface TrendingTopic {
  id: string;
  title: string;
  articles: Article[];
  score: number;
  sourceCount: number;
  categoryDistribution: Record<NewsCategory, number>;
  heatLevel: number; // 1-5
}

export interface ComparisonData {
  topic?: string;
  keyDifferences?: string;
  framingAnalysis?: FramingEntry[];
}

export interface FramingEntry {
  sourceID: string;
  tone?: string;
  keyQuote?: string;
}

export interface SourceFetchResult {
  sourceID: string;
  articles: Article[];
  error?: string;
}

export interface ArsenalData {
  lastUpdated: string;
  rockets: {
    remaining: number;
    started: number;
    gone: number;
    remainingPercent: number;
  };
  launchers: {
    remaining: number;
    started: number;
    gone: number;
    remainingPercent: number;
  };
  systemStatus: {
    autoScanner: boolean;
    aiParser: boolean;
    feeds: number;
    intervalMin: number;
    lastScan?: string;
    nextScan?: string;
  };
  timeline: { date: string; missiles: number; label: string }[];
  sources: string[];
}

export interface WarPrediction {
  score: number; // 1-100 (1=full war, 100=peace)
  trend: 'escalating' | 'stable' | 'de-escalating';
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  escalationFactors: string[];
  deescalationFactors: string[];
  summary: string;
  analyzedAt: string;
  articleCount: number;
}

export interface SentimentDataPoint {
  id: string;
  percentage: number;
  type: 'oppose' | 'support' | 'neutral';
  description: string;
  source: string;
  organization: string;
  date: string;
  url: string;
  sampleSize?: number;
}

export interface SentimentIndex {
  lastUpdated: string;
  oppose: { average: number; dataPoints: number };
  support: { average: number; dataPoints: number };
  neutral: { average: number; dataPoints: number };
  dataPoints: SentimentDataPoint[];
  disclaimer: string;
}
