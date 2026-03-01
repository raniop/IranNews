import * as cheerio from 'cheerio';
import { Article, NewsSource } from '../types';
import { generateArticleId } from '../utils';
import { sendClaudeMessage } from './claude-api';
import { batchTranslatePersianPrompt } from './claude-prompts';

const PERSIAN_CHANNELS = new Set(['farsna']);

export async function fetchTelegramArticles(source: NewsSource): Promise<Article[]> {
  const res = await fetch(source.baseURL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; IranNewsWeb/1.0)',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Telegram fetch failed: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const articles: Article[] = [];

  $('.tgme_widget_message').each((_, el) => {
    const post = $(el).attr('data-post');
    if (!post) return;

    const text = $(el).find('.tgme_widget_message_text').text().trim();
    if (!text) return;

    const datetime = $(el).find('time[datetime]').attr('datetime');

    // Extract image from background-image style
    const photoStyle = $(el).find('.tgme_widget_message_photo_wrap').attr('style') || '';
    const imageMatch = photoStyle.match(/url\('([^']+)'\)/);
    const imageURL = imageMatch?.[1];

    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const title = lines[0]?.substring(0, 200) || text.substring(0, 200);
    const description = lines.length > 1 ? lines.slice(1, 4).join(' ').substring(0, 500) : undefined;

    const [channel, msgId] = post.split('/');
    const url = `https://t.me/${channel}/${msgId}`;

    articles.push({
      id: generateArticleId(url),
      title: title.trim(),
      articleDescription: description?.trim(),
      url,
      imageURL,
      publishedDate: datetime ? new Date(datetime).toISOString() : new Date().toISOString(),
      sourceID: source.id,
      category: 'telegram',
    });
  });

  // Take the most recent 20
  const recent = articles.slice(-20);

  // Translate Persian channels
  const channel = extractChannel(source.baseURL);
  if (PERSIAN_CHANNELS.has(channel) && recent.length > 0) {
    return batchTranslate(recent);
  }

  return recent;
}

function extractChannel(baseURL: string): string {
  // https://t.me/s/farsna -> farsna
  const match = baseURL.match(/t\.me\/s\/([^/]+)/);
  return match?.[1] || '';
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
      let translated = translatedLines[i].replace(/^\d+[.)\\-]\s*/, '');
      if (!translated) return article;
      return { ...article, title: translated };
    });
  } catch (error) {
    console.warn('⚠️ [telegram] Translation failed, showing original titles:', error);
    return articles;
  }
}
