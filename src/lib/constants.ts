export const APP_NAME = 'IranNews';

// Claude API
export const CLAUDE_API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
export const CLAUDE_API_VERSION = '2023-06-01';
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
export const CLAUDE_MODEL_FAST = 'claude-haiku-4-5-20251001';
export const CLAUDE_MAX_TOKENS = 1024;

// Cache
export const CACHE_REVALIDATE_SECONDS = 300; // 5 minutes
export const MAX_ARTICLES_PER_SOURCE = 100;

// Iran keywords for filtering RSS feeds (Al Jazeera, BBC)
export const IRAN_KEYWORDS = [
  'iran', 'iranian', 'tehran', 'persian',
  'khamenei', 'raisi', 'rouhani',
  'irgc', 'revolutionary guard',
  'sanctions', 'nuclear',
  'ayatollah', 'islamic republic',
];

// Generic titles to filter out from scraped content
export const GENERIC_TITLES = new Set([
  'reports and statistics', 'about us', 'contact us', 'home',
  'news', 'articles', 'latest news', 'read more', 'more',
  'search', 'login', 'register', 'privacy policy', 'terms',
]);

// Stopwords for trending keyword extraction
export const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare',
  'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she',
  'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his',
  'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'not', 'no',
  'nor', 'as', 'if', 'then', 'than', 'when', 'where', 'how', 'what',
  'which', 'who', 'whom', 'whose', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same',
  'so', 'very', 'just', 'about', 'above', 'after', 'again', 'also',
  'any', 'because', 'before', 'below', 'between', 'during', 'into',
  'over', 'under', 'until', 'up', 'down', 'out', 'off', 'here', 'there',
  'says', 'said', 'new', 'like', 'get', 'make', 'know', 'think', 'take',
  'see', 'come', 'want', 'look', 'use', 'find', 'give', 'tell', 'work',
  'call', 'try', 'ask', 'seem', 'feel', 'leave', 'put', 'mean', 'keep',
  'let', 'begin', 'show', 'hear', 'play', 'run', 'move', 'live', 'believe',
  'hold', 'bring', 'happen', 'write', 'provide', 'sit', 'stand', 'lose',
  'pay', 'meet', 'include', 'continue', 'set', 'learn', 'change', 'lead',
  'understand', 'watch', 'follow', 'stop', 'create', 'speak', 'read',
  'allow', 'add', 'spend', 'grow', 'open', 'walk', 'win', 'offer', 'per',
]);
