export const APP_NAME = 'IranNews';

// Claude API
export const CLAUDE_API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
export const CLAUDE_API_VERSION = '2023-06-01';
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
export const CLAUDE_MODEL_FAST = 'claude-haiku-4-5-20251001';
export const CLAUDE_MAX_TOKENS = 1024;

// Supabase (anon key is safe to expose - it's designed to be public)
export const SUPABASE_URL = 'https://klctwlitekaqdbamlfpn.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_Usltmj6DeTXB2fENaq03Fg_JydDelVZ';

// Cache
export const CACHE_REVALIDATE_SECONDS = 300; // 5 minutes
export const MAX_ARTICLES_PER_SOURCE = 100;

// Iran war keywords for filtering non-Iran-specific sources
export const IRAN_KEYWORDS = [
  // Core Iran terms
  'iran', 'iranian', 'tehran', 'persian', 'persia',
  'khamenei', 'raisi', 'rouhani', 'pezeshkian', 'zarif', 'araghchi',
  'irgc', 'revolutionary guard', 'quds force',
  'ayatollah', 'islamic republic', 'islamic revolution',
  // Nuclear & sanctions
  'sanctions', 'nuclear', 'enrichment', 'uranium', 'centrifuge', 'jcpoa', 'iaea',
  // Military & war
  'ballistic missile', 'cruise missile', 'shahed', 'fateh', 'emad', 'ghadr',
  'drone attack', 'missile attack', 'iran strike', 'iran attack', 'iran war',
  'iran retaliation', 'iran intercept', 'iron dome', 'arrow', 'david sling',
  // Proxies & allies
  'hezbollah', 'houthi', 'houthis', 'axis of resistance', 'proxy',
  'hamas', 'islamic jihad', 'kata\'ib hezbollah', 'pmu',
  // Hebrew keywords - core
  'איראן', 'אירן', 'אירנ', 'טהרן', 'פרס',
  'חמנאי', 'ראיסי', 'פזשכיאן', 'ארגחי',
  'משמרות המהפכה', 'כוח קודס',
  'איסלאמית', 'פרסית',
  // Hebrew - nuclear & sanctions
  'גרעין', 'סנקציות', 'העשרה', 'אורניום', 'סוכנות אטום',
  // Hebrew - military & war
  'בליסטי', 'טיל', 'טילים', 'רקטה', 'רקטות', 'מל"ט',
  'שיגור', 'יירוט', 'כיפת ברזל', 'חץ', 'קלע דוד',
  'התקפה', 'תקיפה', 'תגמול', 'מתקפה',
  'פיקוד העורף', 'אזעקה', 'אזעקות', 'מרחב מוגן',
  // Hebrew - proxies
  'חיזבאללה', 'חות\'י', 'חות\'ים', 'ציר ההתנגדות',
  'חמאס', 'ג\'יהאד',
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
