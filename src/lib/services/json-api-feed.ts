import { Article, NewsSource } from '../types';
import { generateArticleId } from '../utils';
import { sendClaudeMessage } from './claude-api';
import { batchTranslatePersianPrompt } from './claude-prompts';

interface TasnimMessage {
  id: string;
  text: string;
  datetime: string;
  imgUrl: string | null;
}

export async function fetchJSONAPIArticles(
  apiURL: string,
  source: NewsSource
): Promise<Article[]> {
  const res = await fetch(apiURL, {
    headers: { 'User-Agent': 'IranNewsWeb/1.0' },
    signal: AbortSignal.timeout(7000),
  });

  if (!res.ok) {
    throw new Error(`JSON API fetch failed: ${res.status}`);
  }

  const json = await res.json();

  // Handle { messages: [...], cached: bool } wrapper
  const messages: TasnimMessage[] = json.messages || json;
  if (!Array.isArray(messages)) {
    throw new Error('Invalid JSON API response format');
  }

  let articles = parseMessages(messages.slice(0, 20), source);

  // Batch translate Persian titles to English
  if (articles.length > 0) {
    articles = await batchTranslate(articles);
  }

  return articles;
}

function parseMessages(messages: TasnimMessage[], source: NewsSource): Article[] {
  return messages
    .filter(msg => msg.text && msg.text.trim().length > 0)
    .map(msg => {
      const cleanedText = cleanTelegramText(msg.text);
      if (!cleanedText) return null;

      const lines = cleanedText.split('\n').filter(l => l.trim().length > 0);
      const title = lines[0] || cleanedText;
      const description = lines.length > 1 ? lines.slice(1, 4).join(' ') : undefined;

      // Build Telegram link from message ID
      const parts = msg.id.split('/');
      const link = parts.length === 2
        ? `https://t.me/${parts[0]}/${parts[1]}`
        : source.baseURL;

      return {
        id: generateArticleId(link),
        title: title.trim(),
        articleDescription: description?.trim(),
        url: link,
        imageURL: msg.imgUrl || undefined,
        publishedDate: new Date(msg.datetime).toISOString(),
        sourceID: source.id,
        category: source.category,
      } as Article;
    })
    .filter((a): a is Article => a !== null);
}

function cleanTelegramText(text: string): string {
  let cleaned = text;
  // Remove @TasnimNews mentions
  cleaned = cleaned.replace(/@Tasnim[Nn]ews/g, '');
  // Remove reaction counts (emoji + number)
  cleaned = cleaned.replace(/[\p{So}\p{Sk}]\d+/gu, '');
  // Remove view counts like "543 views08:33"
  cleaned = cleaned.replace(/\d+\s*views?\d{2}:\d{2}/gi, '');
  return cleaned.trim();
}

async function batchTranslate(articles: Article[]): Promise<Article[]> {
  try {
    const titles = articles.map(a => a.title);
    const prompt = batchTranslatePersianPrompt(titles);

    const result = await sendClaudeMessage(prompt.system, prompt.user);

    const translatedLines = result
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    return articles.map((article, i) => {
      if (i >= translatedLines.length) return article;

      // Remove numbering prefix (e.g., "1. " or "1) ")
      let translated = translatedLines[i].replace(/^\d+[.)\\-]\s*/, '');
      if (!translated) return article;

      return { ...article, title: translated };
    });
  } catch (error) {
    console.warn('⚠️ [irantranslate] Translation failed, showing Persian titles:', error);
    return articles;
  }
}
