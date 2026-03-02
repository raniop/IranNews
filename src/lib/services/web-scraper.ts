import * as cheerio from 'cheerio';
import { Article, ScrapingConfig, NewsSource } from '../types';
import { generateArticleId, resolveURL, isValidArticleTitle, stripHTML } from '../utils';

export async function fetchScrapedArticles(
  url: string,
  config: ScrapingConfig,
  source: NewsSource
): Promise<Article[]> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Scrape fetch failed: ${res.status}`);
  }

  const html = await res.text();
  console.log(`🔍 [${source.id}] Scraping ${html.length} chars of HTML`);

  let articles = parseStructured(html, config, source);

  // Fallback to generic link extraction
  if (articles.length === 0) {
    console.log(`🔍 [${source.id}] Structured parse found 0, trying generic extraction...`);
    articles = extractGenericLinks(html, source, config.baseURLForRelativeLinks);
  }

  // Filter and deduplicate
  articles = articles.filter(a => isValidArticleTitle(a.title));

  const seen = new Set<string>();
  articles = articles.filter(a => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  console.log(`🔍 [${source.id}] Final: ${articles.length} articles after filtering`);
  return articles;
}

function parseStructured(html: string, config: ScrapingConfig, source: NewsSource): Article[] {
  const $ = cheerio.load(html);
  const articles: Article[] = [];

  // Parse comma-separated selectors
  const selectors = config.articleSelector.split(',').map(s => s.trim());

  for (const sel of selectors) {
    $(sel).each((i, el) => {
      if (articles.length >= 30) return false;

      const $el = $(el);

      // Find the first link
      const $link = $el.find('a').first();
      let href = $link.attr('href') || '';
      let title = $link.text().trim() || $link.attr('title') || '';

      if (!title || !href) return;

      // Resolve relative URL
      href = resolveURL(href, config.baseURLForRelativeLinks);
      if (!href.startsWith('http')) return;

      // Extract description
      let description: string | undefined;
      if (config.descriptionSelector) {
        const descSelectors = config.descriptionSelector.split(',').map(s => s.trim());
        for (const ds of descSelectors) {
          const descText = $el.find(ds).first().text().trim();
          if (descText) {
            description = descText;
            break;
          }
        }
      }

      // Extract image - try multiple attributes
      let imageURL: string | undefined;
      if (config.imageSelector) {
        const $img = $el.find(config.imageSelector).first();
        const imgSrc = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src') || $img.attr('data-original');
        if (imgSrc && !imgSrc.includes('data:image') && !imgSrc.includes('blank.gif')) {
          imageURL = resolveURL(imgSrc, config.baseURLForRelativeLinks);
        }
      }

      articles.push({
        id: generateArticleId(href),
        title: stripHTML(title),
        articleDescription: description ? stripHTML(description) : undefined,
        url: href,
        imageURL,
        publishedDate: new Date().toISOString(),
        sourceID: source.id,
        category: source.category,
      });
    });
  }

  return articles;
}

function extractGenericLinks(html: string, source: NewsSource, baseURL?: string): Article[] {
  const $ = cheerio.load(html);
  const articles: Article[] = [];

  $('a[href]').each((i, el) => {
    if (articles.length >= 100) return false;

    const $a = $(el);
    let href = $a.attr('href') || '';
    const title = $a.text().trim() || $a.attr('title') || '';

    if (!title || title.length < 20) return;

    // Skip navigation/utility links
    if (href.includes('javascript:') || href === '#' || href.includes('mailto:')) return;
    if (href.includes('/tag/') || href.includes('/category/') || href.includes('/page/')) return;

    // Resolve relative URL
    href = resolveURL(href, baseURL);
    if (!href.startsWith('http')) return;

    articles.push({
      id: generateArticleId(href),
      title: stripHTML(title),
      url: href,
      publishedDate: new Date().toISOString(),
      sourceID: source.id,
      category: source.category,
    });
  });

  return articles;
}
