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
  // NPR - Middle East coverage
  {
    id: 'npr',
    name: 'NPR',
    category: 'neutral',
    baseURL: 'https://www.npr.org',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:npr.org&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // TRT World - Turkish international broadcaster
  {
    id: 'trtworld',
    name: 'TRT World',
    category: 'neutral',
    baseURL: 'https://www.trtworld.com',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:trtworld.com&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // AP News - wire service
  {
    id: 'apnews',
    name: 'AP News',
    category: 'neutral',
    baseURL: 'https://apnews.com',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:apnews.com&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // CNN - World news
  {
    id: 'cnn',
    name: 'CNN',
    category: 'neutral',
    baseURL: 'https://www.cnn.com',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:cnn.com&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Fox News - World news
  {
    id: 'foxnews',
    name: 'Fox News',
    category: 'neutral',
    baseURL: 'https://www.foxnews.com',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:foxnews.com&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Economic Times - India perspective on Iran/missiles/defense
  {
    id: 'economictimes',
    name: 'Economic Times',
    category: 'neutral',
    baseURL: 'https://economictimes.indiatimes.com',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:economictimes.indiatimes.com&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Iran Watch - Wisconsin Project think tank, nuclear/missile tracking
  {
    id: 'iranwatch',
    name: 'Iran Watch',
    category: 'neutral',
    baseURL: 'https://www.iranwatch.org',
    rssURL: 'https://news.google.com/rss/search?q=site:iranwatch.org&hl=en-US&gl=US&ceid=US:en',
    scrapingConfig: {
      articleSelector: 'div.view-content div.views-row, article',
      titleSelector: 'h2 a, h3 a, a',
      linkSelector: 'a',
      descriptionSelector: 'p, div.field-content',
      imageSelector: 'img',
      dateSelector: 'span.date-display-single, time',
      baseURLForRelativeLinks: 'https://www.iranwatch.org',
    },
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Israel Alma Center - Israeli research center, Iran/Hezbollah analysis
  {
    id: 'alma',
    name: 'Alma Center',
    category: 'neutral',
    baseURL: 'https://israel-alma.org',
    rssURL: 'https://israel-alma.org/feed/',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Critical Threats (AEI) - daily Iran updates and analysis
  {
    id: 'criticalthreats',
    name: 'Critical Threats',
    category: 'neutral',
    baseURL: 'https://www.criticalthreats.org',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:criticalthreats.org&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Understanding War / ISW Iran analysis
  {
    id: 'isw',
    name: 'ISW',
    category: 'neutral',
    baseURL: 'https://understandingwar.org',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:understandingwar.org&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Jerusalem Post - dedicated Iran RSS feed
  {
    id: 'jpost',
    name: 'Jerusalem Post',
    category: 'neutral',
    baseURL: 'https://www.jpost.com',
    rssURL: 'https://www.jpost.com/rss/rssfeedsiran',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Times of Israel - main RSS, needs Iran filter
  {
    id: 'timesofisrael',
    name: 'Times of Israel',
    category: 'neutral',
    baseURL: 'https://www.timesofisrael.com',
    rssURL: 'https://www.timesofisrael.com/feed/',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Ynetnews - English edition of Ynet
  {
    id: 'ynetnews',
    name: 'Ynetnews',
    category: 'neutral',
    baseURL: 'https://www.ynetnews.com',
    rssURL: 'https://www.ynet.co.il/3rdparty/mobile/rss/ynetnews/3082/',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // i24News - Israeli international news channel
  {
    id: 'i24news',
    name: 'i24NEWS',
    category: 'neutral',
    baseURL: 'https://www.i24news.tv/en',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:i24news.tv&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Israel Hayom - English edition
  {
    id: 'israelhayom',
    name: 'Israel Hayom',
    category: 'neutral',
    baseURL: 'https://www.israelhayom.com',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:israelhayom.com&hl=en-US&gl=US&ceid=US:en',
    isEnabled: true,
    fetchMethod: 'rss',
  },
  // Walla! News - major Israeli news portal (Hebrew, via Google News)
  {
    id: 'walla',
    name: 'Walla! News',
    category: 'neutral',
    baseURL: 'https://news.walla.co.il',
    rssURL: 'https://news.google.com/rss/search?q=iran+site:walla.co.il&hl=iw&gl=IL&ceid=IL:he',
    isEnabled: true,
    fetchMethod: 'rss',
  },
];

export const telegramSources: NewsSource[] = [
  // Pro-regime Telegram channels
  {
    id: 'presstv',
    name: 'Press TV',
    category: 'telegram',
    baseURL: 'https://t.me/s/presstv',
    isEnabled: true,
    fetchMethod: 'telegram',
  },
  {
    id: 'irna_en_tg',
    name: 'IRNA English',
    category: 'telegram',
    baseURL: 'https://t.me/s/Irna_en',
    isEnabled: true,
    fetchMethod: 'telegram',
  },
  {
    id: 'farsna',
    name: 'Fars News',
    category: 'telegram',
    baseURL: 'https://t.me/s/farsna',
    isEnabled: true,
    fetchMethod: 'telegram',
  },
  // Israeli & Hebrew breaking news Telegram channels
  {
    id: 'tg_breakingnews',
    name: 'Breaking News TG',
    category: 'telegram',
    baseURL: 'https://t.me/s/news_is_breaking_out_telegram',
    isEnabled: true,
    fetchMethod: 'telegram',
  },
  {
    id: 'tg_newsflash',
    name: 'News Flash TG',
    category: 'telegram',
    baseURL: 'https://t.me/s/newsflashhhj',
    isEnabled: true,
    fetchMethod: 'telegram',
  },
  {
    id: 'tg_yediotnews',
    name: 'Yedioth News TG',
    category: 'telegram',
    baseURL: 'https://t.me/s/yediotnews25',
    isEnabled: true,
    fetchMethod: 'telegram',
  },
  // OSINT / Military intelligence channels
  {
    id: 'tg_abuali',
    name: 'Abu Ali Express',
    category: 'telegram',
    baseURL: 'https://t.me/s/AbuAliExpress',
    isEnabled: true,
    fetchMethod: 'telegram',
  },
  {
    id: 'tg_inteldoge',
    name: 'Intel Doge',
    category: 'telegram',
    baseURL: 'https://t.me/s/IntelDoge',
    isEnabled: true,
    fetchMethod: 'telegram',
  },
];

export const allSources: NewsSource[] = [
  ...proRegimeSources,
  ...oppositionSources,
  ...neutralSources,
  ...telegramSources,
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
