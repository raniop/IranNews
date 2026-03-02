import { sendClaudeMessage, parseClaudeJSON } from './claude-api';
import { CLAUDE_MODEL_FAST } from '../constants';
import { Article } from '../types';

// In-memory cache for Hebrew translations: articleId -> { title, description }
const hebrewCache = new Map<string, { title: string; description?: string }>();

// Track in-flight requests to avoid duplicates
const pendingIds = new Set<string>();

export function getCachedTranslation(id: string): { title: string; description?: string } | null {
  return hebrewCache.get(id) || null;
}

export function getCachedTranslations(ids: string[]): Record<string, { title: string; description?: string }> {
  const result: Record<string, { title: string; description?: string }> = {};
  for (const id of ids) {
    const cached = hebrewCache.get(id);
    if (cached) result[id] = cached;
  }
  return result;
}

export function getAllCachedTranslations(): Record<string, { title: string; description?: string }> {
  const result: Record<string, { title: string; description?: string }> = {};
  for (const [id, t] of hebrewCache) {
    result[id] = t;
  }
  return result;
}

/**
 * Pre-translate articles to Hebrew server-side.
 * Called after fetching articles so Hebrew translations are ready
 * before the client even requests them.
 */
export async function preTranslateArticles(articles: Article[]): Promise<void> {
  // Filter out already translated
  const untranslated = articles.filter(a => !hebrewCache.has(a.id) && !pendingIds.has(a.id));
  if (untranslated.length === 0) return;

  console.log(`🌐 [translate] Pre-translating ${untranslated.length} articles to Hebrew`);
  const startTime = Date.now();

  // Split into batches of 15 — run in parallel for speed
  // (smaller batches = faster per-call response from Claude)
  const batches: Article[][] = [];
  for (let i = 0; i < untranslated.length; i += 15) {
    batches.push(untranslated.slice(i, i + 15));
  }

  // Translate all batches in parallel
  await Promise.allSettled(
    batches.map(async (batch) => {
      const items = batch.map(a => ({
        id: a.id,
        title: a.title,
        description: a.articleDescription,
      }));
      await translateBatch(items);
    })
  );

  console.log(`🌐 [translate] Pre-translation done in ${Date.now() - startTime}ms (${hebrewCache.size} total cached)`);
}

export async function translateBatch(
  items: { id: string; title: string; description?: string }[]
): Promise<Record<string, { title: string; description?: string }>> {
  // Filter out already cached and in-flight
  const toTranslate = items.filter(
    (item) => !hebrewCache.has(item.id) && !pendingIds.has(item.id)
  );

  if (toTranslate.length === 0) {
    return getCachedTranslations(items.map((i) => i.id));
  }

  // Mark as pending
  for (const item of toTranslate) {
    pendingIds.add(item.id);
  }

  try {
    // Build compact prompt
    const numbered = toTranslate.map((item, i) =>
      `${i + 1}. ${item.title}${item.description ? ` | ${item.description.substring(0, 80)}` : ''}`
    );

    const systemPrompt = `Translate these news items to Hebrew. Return JSON array: [{"i":1,"t":"title","d":"desc or null"},...] ONLY.`;

    const userMessage = numbered.join('\n');

    const response = await sendClaudeMessage(systemPrompt, userMessage, 4096, { model: CLAUDE_MODEL_FAST });
    const parsed = parseClaudeJSON<Array<{ i: number; t: string; d?: string | null }>>(response);

    if (parsed && Array.isArray(parsed)) {
      for (const entry of parsed) {
        const idx = entry.i - 1;
        if (idx >= 0 && idx < toTranslate.length) {
          const item = toTranslate[idx];
          const translation = {
            title: entry.t,
            description: entry.d || undefined,
          };
          hebrewCache.set(item.id, translation);
        }
      }
    }
  } catch (error) {
    console.error('Batch translation failed:', error);
  } finally {
    for (const item of toTranslate) {
      pendingIds.delete(item.id);
    }
  }

  return getCachedTranslations(items.map((i) => i.id));
}
