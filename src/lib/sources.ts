import { NewsSource } from './types';

// Direct port from iOS SourceConfigurations.swift

export const proRegimeSources: NewsSource[] = [
  {
    id: 'irna',
    name: 'IRNA',
    category: 'proRegime',
    baseURL: 'https://en.irna.ir',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:irna.ir&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'fars',
    name: 'Fars News',
    category: 'proRegime',
    baseURL: 'https://www.farsnews.ir',
    isEnabled: false, // Geo-blocked
    fetchMethod: 'unavailable',
  },
  {
    id: 'tasnim',
    name: 'Tasnim News',
    category: 'proRegime',
    baseURL: 'https://www.tasnimnews.ir/en',
    rssURL: 'https://www.tasnimnews.ir/en/rss/feed/0/0/8/1/TopStories',
    scrapingConfig: {
      articleSelector: 'article, div.item',
      titleSelector: 'h2 a, a',
      linkSelector: 'a',
      descriptionSelector: 'p',
      imageSelector: 'img',
      dateSelector: 'time',
      baseURLForRelativeLinks: 'https://www.tasnimnews.ir',
    },
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'irib',
    name: 'IRIB',
    category: 'proRegime',
    baseURL: 'https://www.irib.ir',
    isEnabled: false, // Geo-blocked
    fetchMethod: 'unavailable',
  },
  {
    id: 'resalat',
    name: 'Resalat',
    category: 'proRegime',
    baseURL: 'https://resalat-news.com',
    isEnabled: false, // Geo-blocked
    fetchMethod: 'unavailable',
  },
  {
    id: 'nournews',
    name: 'Nournews',
    category: 'proRegime',
    baseURL: 'https://nournews.ir/en',
    scrapingConfig: {
      articleSelector: 'div.news-top, div.news-item',
      titleSelector: 'h1 a, h2 a, h3 a, a',
      linkSelector: 'a',
      imageSelector: 'img',
      baseURLForRelativeLinks: 'https://nournews.ir/en/',
    },
    isEnabled: true,
    fetchMethod: 'scrape',
  },
  {
    id: 'irantranslate',
    name: 'Iran Translate',
    category: 'proRegime',
    baseURL: 'https://iran-translate.com',
    jsonAPIURL: 'https://tasnim-feed.tmaybloom.workers.dev/api/messages',
    isEnabled: true,
    fetchMethod: 'jsonAPI',
  },
];

export const oppositionSources: NewsSource[] = [
  {
    id: 'ncri',
    name: 'NCRI',
    category: 'opposition',
    baseURL: 'https://www.ncr-iran.org/en',
    rssURL: 'https://www.ncr-iran.org/en/feed/',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'amadnews',
    name: 'Amadnews',
    category: 'opposition',
    baseURL: 'https://amadnews.co',
    isEnabled: false, // Static page, redirects to Telegram
    fetchMethod: 'unavailable',
  },
  {
    id: 'iranwire',
    name: 'IranWire',
    category: 'opposition',
    baseURL: 'https://iranwire.com/en',
    rssURL: 'https://iranwire.com/en/feed/',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'iranfocus',
    name: 'Iran Focus',
    category: 'opposition',
    baseURL: 'https://iranfocus.com',
    rssURL: 'https://iranfocus.com/feed/',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'kayhanlife',
    name: 'Kayhan Life',
    category: 'opposition',
    baseURL: 'https://kayhanlife.com',
    rssURL: 'https://kayhanlife.com/feed/',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'chri',
    name: 'CHRI',
    category: 'opposition',
    baseURL: 'https://iranhumanrights.org',
    rssURL: 'https://iranhumanrights.org/feed/',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'khrn',
    name: 'Kurdistan HR Network',
    category: 'opposition',
    baseURL: 'https://kurdistanhumanrights.org/en/',
    rssURL: 'https://kurdistanhumanrights.org/en/feed/',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'hengaw',
    name: 'Hengaw',
    category: 'opposition',
    baseURL: 'https://hengaw.net/en',
    scrapingConfig: {
      articleSelector: 'article, div.post-item, div.card',
      titleSelector: 'h2 a, h3 a, a',
      linkSelector: 'a',
      descriptionSelector: 'p, div.excerpt',
      imageSelector: 'img',
      dateSelector: 'time, span.date',
      baseURLForRelativeLinks: 'https://hengaw.net',
    },
    isEnabled: true,
    fetchMethod: 'scrape',
  },
];

export const neutralSources: NewsSource[] = [
  {
    id: 'iranintl',
    name: 'Iran International',
    category: 'neutral',
    baseURL: 'https://www.iranintl.com/en',
    rssURL: 'https://www.iranintl.com/en/feed',
    scrapingConfig: {
      articleSelector: 'article, div',
      titleSelector: 'a',
      linkSelector: 'a',
      descriptionSelector: 'p',
      imageSelector: 'img',
      dateSelector: 'time',
      baseURLForRelativeLinks: 'https://www.iranintl.com',
    },
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    category: 'neutral',
    baseURL: 'https://www.aljazeera.com/where/iran',
    rssURL: 'https://www.aljazeera.com/xml/rss/all.xml',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'reuters',
    name: 'Reuters',
    category: 'neutral',
    baseURL: 'https://www.reuters.com',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:reuters.com&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'bbc',
    name: 'BBC News',
    category: 'neutral',
    baseURL: 'https://www.bbc.com/news/topics/cp7r8vgl2lgt/iran',
    rssURL: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'cbs',
    name: 'CBS News',
    category: 'neutral',
    baseURL: 'https://www.cbsnews.com',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:cbsnews.com&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  {
    id: 'medialine',
    name: 'The Media Line',
    category: 'neutral',
    baseURL: 'https://themedialine.org',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:themedialine.org&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
];

export const allSources: NewsSource[] = [
  ...proRegimeSources,
  ...oppositionSources,
  ...neutralSources,
];

export function getSourceById(id: string): NewsSource | undefined {
  return allSources.find(s => s.id === id);
}

export function getSourcesByCategory(category: string): NewsSource[] {
  return allSources.filter(s => s.category === category);
}

export function getEnabledSources(): NewsSource[] {
  return allSources.filter(s => s.isEnabled);
}
