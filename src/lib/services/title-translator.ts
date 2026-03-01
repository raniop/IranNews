import { sendClaudeMessage, parseClaudeJSON } from './claude-api';

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
    // Build the prompt with numbered items for Claude
    const numbered = toTranslate.map((item, i) => {
      let text = `${i + 1}. TITLE: ${item.title}`;
      if (item.description) {
        text += `\nDESC: ${item.description}`;
      }
      return text;
    });

    const systemPrompt = `You are a professional translator. Translate the following news article titles and descriptions to Hebrew.
Return ONLY a JSON array where each element has: {"i": number, "title": "Hebrew title", "description": "Hebrew description or null"}
The "i" field is the 1-based index of the item.
Keep translations natural and concise. Preserve proper nouns as-is when appropriate.
Return ONLY valid JSON, no other text.`;

    const userMessage = `Translate these ${toTranslate.length} items to Hebrew:\n\n${numbered.join('\n\n')}`;

    const response = await sendClaudeMessage(systemPrompt, userMessage);
    const parsed = parseClaudeJSON<Array<{ i: number; title: string; description?: string | null }>>(response);

    if (parsed && Array.isArray(parsed)) {
      for (const entry of parsed) {
        const idx = entry.i - 1;
        if (idx >= 0 && idx < toTranslate.length) {
          const item = toTranslate[idx];
          const translation = {
            title: entry.title,
            description: entry.description || undefined,
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
