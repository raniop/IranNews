export type Language = 'en' | 'he';

const translations = {
  // Navigation
  'nav.feed': { en: 'Feed', he: 'פיד' },
  'nav.trending': { en: 'Trending', he: 'מגמות' },
  'nav.sources': { en: 'Sources', he: 'מקורות' },
  'nav.settings': { en: 'Settings', he: 'הגדרות' },
  'nav.analytics': { en: 'Analytics', he: 'אנליטיקס' },
  'nav.articleDetail': { en: 'Article Detail', he: 'פרטי כתבה' },
  'nav.storyComparison': { en: 'Story Comparison', he: 'השוואת סיפורים' },

  // Feed page
  'feed.title': { en: 'News Feed', he: 'עדכוני חדשות' },
  'feed.articlesCount': { en: 'articles from all sources', he: 'כתבות מכל המקורות' },
  'feed.search': { en: 'Search articles...', he: 'חיפוש כתבות...' },
  'feed.noMatch': { en: 'No matching articles', he: 'לא נמצאו כתבות תואמות' },
  'feed.tryDifferent': { en: 'Try a different search term', he: 'נסה מונח חיפוש אחר' },
  'feed.noArticles': { en: 'No articles yet', he: 'אין כתבות עדיין' },
  'feed.pullRefresh': { en: 'Pull to refresh or check your source settings', he: 'רענן או בדוק את הגדרות המקורות' },
  'feed.clearSearch': { en: 'Clear search', he: 'נקה חיפוש' },
  'feed.refresh': { en: 'Refresh', he: 'רענן' },
  'feed.loading': { en: 'Fetching news from all sources...', he: 'טוען חדשות מכל המקורות...' },
  'feed.failedLoad': { en: 'Failed to load articles', he: 'טעינת הכתבות נכשלה' },

  // Categories
  'category.all': { en: 'All', he: 'הכל' },
  'category.proRegime': { en: 'Pro-Regime', he: 'תומכי משטר' },
  'category.opposition': { en: 'Opposition', he: 'אופוזיציה' },
  'category.neutral': { en: 'Neutral', he: 'ניטרלי' },

  // Article detail
  'article.back': { en: 'Back', he: 'חזרה' },
  'article.notFound': { en: 'Article not found', he: 'הכתבה לא נמצאה' },
  'article.removedCache': { en: 'It may have been removed from the cache.', he: 'ייתכן שהכתבה הוסרה מהמטמון.' },
  'article.backToFeed': { en: 'Back to Feed', he: 'חזרה לפיד' },
  'article.loading': { en: 'Loading article...', he: 'טוען כתבה...' },
  'article.loadingContent': { en: 'Loading article content...', he: 'טוען תוכן הכתבה...' },
  'article.viewOriginal': { en: 'View original on', he: 'צפה במקור ב-' },
  'article.couldNotLoad': { en: 'Could not load full article content', he: 'לא ניתן לטעון את תוכן הכתבה המלא' },
  'article.readOn': { en: 'Read on', he: 'קרא ב-' },

  // AI
  'ai.title': { en: 'AI Analysis', he: 'ניתוח AI' },
  'ai.summarize': { en: 'Summarize', he: 'סיכום' },
  'ai.biasAnalysis': { en: 'Bias Analysis', he: 'ניתוח הטיה' },
  'ai.translateHebrew': { en: 'Translate to Hebrew', he: 'תרגם לעברית' },
  'ai.summary': { en: 'Summary', he: 'סיכום' },
  'ai.biasResult': { en: 'Bias Analysis', he: 'ניתוח הטיה' },
  'ai.negative': { en: 'Negative', he: 'שלילי' },
  'ai.positive': { en: 'Positive', he: 'חיובי' },
  'ai.hebrewTranslation': { en: 'Hebrew Translation', he: 'תרגום לעברית' },

  // Trending
  'trending.title': { en: 'Trending Topics', he: 'נושאים חמים' },
  'trending.computed': { en: 'Computed from', he: 'מחושב מ-' },
  'trending.articlesAcross': { en: 'articles across all sources', he: 'כתבות מכל המקורות' },
  'trending.noTopics': { en: 'No trending topics', he: 'אין נושאים חמים' },
  'trending.willAppear': { en: 'Trending topics will appear once enough articles are fetched', he: 'נושאים חמים יופיעו ברגע שיהיו מספיק כתבות' },
  'trending.analyzing': { en: 'Analyzing trending topics...', he: 'מנתח נושאים חמים...' },
  'trending.articles': { en: 'articles', he: 'כתבות' },
  'trending.sources': { en: 'sources', he: 'מקורות' },
  'trending.topicNotFound': { en: 'Topic not found', he: 'הנושא לא נמצא' },
  'trending.backToTrending': { en: 'Back to Trending', he: 'חזרה למגמות' },
  'trending.compare': { en: 'Compare Coverage Across Sources', he: 'השווה סיקור בין מקורות' },
  'trending.analyzingCoverage': { en: 'Analyzing coverage...', he: 'מנתח סיקור...' },
  'trending.commonTopic': { en: 'Common Topic', he: 'נושא משותף' },
  'trending.keyDifferences': { en: 'Key Differences', he: 'הבדלים עיקריים' },
  'trending.sourceFraming': { en: 'Source Framing', he: 'מסגור מקורות' },
  'trending.tone': { en: 'Tone', he: 'טון' },
  'trending.relatedArticles': { en: 'Related Articles', he: 'כתבות קשורות' },

  // Sources
  'sources.title': { en: 'News Sources', he: 'מקורות חדשות' },
  'sources.enabledOf': { en: 'of', he: 'מתוך' },
  'sources.sourcesEnabled': { en: 'sources enabled', he: 'מקורות מופעלים' },
  'sources.enableAll': { en: 'Enable All', he: 'הפעל הכל' },
  'sources.disableAll': { en: 'Disable All', he: 'בטל הכל' },
  'sources.unavailable': { en: 'Unavailable (geo-blocked)', he: 'לא זמין (חסום גאוגרפית)' },

  // Settings
  'settings.title': { en: 'Settings', he: 'הגדרות' },
  'settings.appearance': { en: 'Appearance', he: 'מראה' },
  'settings.light': { en: 'Light', he: 'בהיר' },
  'settings.dark': { en: 'Dark', he: 'כהה' },
  'settings.system': { en: 'System', he: 'מערכת' },
  'settings.language': { en: 'Language', he: 'שפה' },
  'settings.data': { en: 'Data', he: 'נתונים' },
  'settings.clearCache': { en: 'Clear Article Cache', he: 'נקה מטמון כתבות' },
  'settings.clearCacheDesc': { en: 'Forces a fresh fetch from all sources on next load', he: 'מאלץ טעינה מחדש מכל המקורות' },
  'settings.about': { en: 'About', he: 'אודות' },
  'settings.version': { en: 'Version', he: 'גרסה' },
  'settings.aiModel': { en: 'AI Model', he: 'מודל AI' },
  'settings.sourcesCount': { en: 'configured', he: 'מוגדרים' },
  'settings.cacheCleared': { en: 'Cache cleared! Next load will fetch fresh data.', he: 'המטמון נוקה! הטעינה הבאה תביא נתונים חדשים.' },
  'settings.cacheFailed': { en: 'Failed to clear cache', he: 'ניקוי המטמון נכשל' },

  // Analytics
  'analytics.title': { en: 'Live Analytics', he: 'אנליטיקס בזמן אמת' },
  'analytics.failedLoad': { en: 'Failed to load stats', he: 'טעינת הנתונים נכשלה' },
  'analytics.liveNow': { en: 'Live Now', he: 'עכשיו באתר' },
  'analytics.activeVisitors': { en: 'active visitors', he: 'מבקרים פעילים' },
  'analytics.totalPageViews': { en: 'Total Page Views', he: 'סה"כ צפיות' },
  'analytics.sinceStart': { en: 'since server start', he: 'מאז עליית השרת' },
  'analytics.activePages': { en: 'Active Pages', he: 'עמודים פעילים' },
  'analytics.pagesViewed': { en: 'pages being viewed', he: 'עמודים בצפייה' },
  'analytics.visitorsByPage': { en: 'Visitors by Page', he: 'מבקרים לפי עמוד' },
  'analytics.traffic24h': { en: 'Traffic (Last 24h)', he: 'תעבורה (24 שעות)' },
  'analytics.autoRefresh': { en: 'Auto-refreshing every 3 seconds', he: 'מתרענן כל 3 שניות' },

  // War Prediction
  'prediction.title': { en: 'Conflict Forecast', he: 'תחזית עימות' },
  'prediction.score': { en: 'Peace Score', he: 'ציון שלום' },
  'prediction.loading': { en: 'Analyzing conflict signals...', he: 'מנתח סימני עימות...' },
  'prediction.error': { en: 'Could not load prediction', he: 'לא ניתן לטעון תחזית' },
  'prediction.escalating': { en: 'Escalating', he: 'הסלמה' },
  'prediction.stable': { en: 'Stable', he: 'יציב' },
  'prediction.de-escalating': { en: 'De-escalating', he: 'הרגעה' },
  'prediction.critical': { en: 'Critical', he: 'קריטי' },
  'prediction.high': { en: 'High Risk', he: 'סיכון גבוה' },
  'prediction.moderate': { en: 'Moderate', he: 'בינוני' },
  'prediction.low': { en: 'Low Risk', he: 'סיכון נמוך' },
  'prediction.escalation': { en: 'Escalation Factors', he: 'גורמי הסלמה' },
  'prediction.deescalation': { en: 'De-escalation Signals', he: 'סימני הרגעה' },
  'prediction.updated': { en: 'Updated', he: 'עודכן' },
  'prediction.basedOn': { en: 'Based on', he: 'מבוסס על' },
  'prediction.articles': { en: 'recent articles', he: 'כתבות אחרונות' },
  'prediction.infoTitle': { en: 'Peace Score (1-100)', he: 'ציון שלום (1-100)' },
  'prediction.infoScale': {
    en: '1-15: Active war | 16-30: Major strikes | 31-45: Heightened tensions | 46-60: Political standoff | 61-75: Diplomacy | 76-90: Negotiations | 91-100: Peace',
    he: '1-15: מלחמה פעילה | 16-30: מתקפות משמעותיות | 31-45: מתיחות גבוהה | 46-60: עימות מדיני | 61-75: דיפלומטיה | 76-90: משא ומתן | 91-100: שלום',
  },
  'prediction.infoDesc': {
    en: 'AI analyzes 50 recent headlines from all sources and assesses the Iran-Israel-US conflict trajectory. Escalation factors (red) push the score down, de-escalation signals (green) push it up.',
    he: 'AI מנתח 50 כותרות אחרונות מכל המקורות ומעריך את מגמת העימות איראן-ישראל-ארה"ב. גורמי הסלמה (אדום) מורידים את הציון, סימני הרגעה (ירוק) מעלים אותו.',
  },

  // Common
  'common.retry': { en: 'Retry', he: 'נסה שוב' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  return translations[key]?.[lang] || translations[key]?.en || key;
}

export { translations };
