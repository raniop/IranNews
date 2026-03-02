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

// IRAN_KEYWORDS: used for non-Iran sources (CNN, JPost, Telegram IL, etc.)
// Article must mention Iran at all to pass.
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

// WAR_KEYWORDS: used for Iran-specific sources (IRNA, Tasnim, IranWire, etc.)
// These sources are already about Iran, so we filter for WAR/military content.
// An IRNA article about Iranian cinema or agriculture should be filtered OUT.
export const WAR_KEYWORDS = [
  // English - military & conflict
  'war', 'military', 'army', 'missile', 'rocket', 'drone', 'uav',
  'attack', 'strike', 'bomb', 'bombing', 'shell', 'shelling',
  'intercept', 'defense', 'defence', 'air defense', 'retaliation', 'retaliate',
  'weapon', 'weapons', 'arsenal', 'warhead', 'launcher',
  'combat', 'battle', 'front', 'frontline', 'offensive', 'operation',
  'kill', 'killed', 'casualty', 'casualties', 'martyr', 'martyrdom',
  'destroy', 'destroyed', 'destruction', 'damage', 'damaged',
  'threat', 'threaten', 'escalation', 'escalate', 'de-escalation',
  'ceasefire', 'truce', 'negotiate', 'negotiation',
  // English - specific weapons & systems
  'ballistic', 'cruise missile', 'hypersonic', 'shahed', 'fateh', 'emad', 'ghadr',
  'sejjil', 'khorramshahr', 'zolfaghar', 'dezful', 'haj qasem',
  'iron dome', 'arrow', 'david sling', 'thaad', 'patriot', 's-300', 's-400',
  'radar', 'air force', 'navy', 'irgc', 'revolutionary guard', 'quds force', 'basij',
  // English - nuclear
  'nuclear', 'enrichment', 'uranium', 'centrifuge', 'plutonium', 'warhead',
  'iaea', 'jcpoa', 'breakout', 'weapons-grade', 'fordow', 'natanz', 'isfahan',
  // English - sanctions & geopolitics
  'sanctions', 'embargo', 'designation', 'blacklist',
  'deterrence', 'confrontation', 'coalition', 'allies',
  // English - proxies & groups
  'hezbollah', 'houthi', 'houthis', 'hamas', 'islamic jihad',
  'proxy', 'militia', 'axis of resistance', 'resistance front',
  'kata\'ib hezbollah', 'pmu', 'hashd', 'ansar allah',
  // English - intelligence & espionage
  'intelligence', 'mossad', 'cia', 'espionage', 'sabotage', 'assassination',
  'covert', 'cyber attack', 'cyberattack',
  // Hebrew - military & conflict
  'מלחמה', 'צבא', 'צבאי', 'צה"ל', 'חיל האוויר',
  'טיל', 'טילים', 'רקטה', 'רקטות', 'מל"ט', 'כטב"ם',
  'התקפה', 'תקיפה', 'הפצצה', 'הפגזה', 'ירי',
  'יירוט', 'הגנה', 'הגנה אווירית', 'תגמול', 'מתקפה', 'תקרית',
  'נשק', 'חימוש', 'ארסנל', 'ראש נפץ', 'משגר',
  'קרב', 'לחימה', 'חזית', 'מבצע', 'פעולה צבאית',
  'הרוג', 'הרוגים', 'נפגע', 'נפגעים', 'שהיד', 'חלל',
  'השמדה', 'הרס', 'נזק', 'פגיעה',
  'איום', 'הסלמה', 'הפסקת אש',
  // Hebrew - specific systems
  'בליסטי', 'שאהד', 'כיפת ברזל', 'חץ', 'קלע דוד',
  'שיגור', 'פיקוד העורף', 'אזעקה', 'אזעקות', 'מרחב מוגן', 'מקלט',
  // Hebrew - nuclear
  'גרעין', 'גרעיני', 'העשרה', 'אורניום', 'צנטריפוגה', 'פצצה גרעינית',
  'סוכנות אטום', 'הסכם גרעין', 'פורדו', 'נתנז',
  // Hebrew - sanctions
  'סנקציות', 'עיצומים', 'חרם',
  // Hebrew - proxies
  'חיזבאללה', 'חות\'י', 'חות\'ים', 'חמאס', 'ג\'יהאד',
  'מיליציה', 'ציר ההתנגדות', 'שלוחות', 'פרוקסי',
  // Hebrew - intel
  'מוסד', 'מודיעין', 'ריגול', 'חיסול', 'סייבר',
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
