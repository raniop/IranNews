import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${res.status}` },
        { status: 502 }
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, nav, footer, ads
    $('script, style, nav, footer, header, aside, iframe, .ad, .ads, .sidebar, .comments, .share, .social, .related, .newsletter, [role="navigation"]').remove();

    // Try to get og:image if available
    const ogImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      undefined;

    // Extract article content - try common selectors in order
    const articleSelectors = [
      'article .entry-content',
      'article .post-content',
      'article .article-body',
      'article .content',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.story-body',
      '.article-body',
      'article',
      '[itemprop="articleBody"]',
      '.content-area',
      'main',
    ];

    let contentHtml = '';
    let contentText = '';

    for (const sel of articleSelectors) {
      const $el = $(sel).first();
      if ($el.length && $el.text().trim().length > 100) {
        // Clean up the content
        $el.find('script, style, nav, .ad, .ads, .share, .social, .related, .newsletter, .comments').remove();

        // Extract paragraphs for clean text
        const paragraphs: string[] = [];
        $el.find('p').each((_, p) => {
          const text = $(p).text().trim();
          if (text.length > 10) {
            paragraphs.push(text);
          }
        });

        if (paragraphs.length > 0) {
          contentText = paragraphs.join('\n\n');
        } else {
          contentText = $el.text().trim();
        }

        // Get clean HTML (paragraphs, headers, lists only)
        const cleanParts: string[] = [];
        $el.find('p, h1, h2, h3, h4, ul, ol, blockquote').each((_, el) => {
          const tag = (el as cheerio.Element).tagName;
          const text = $(el).text().trim();
          if (text.length > 5) {
            cleanParts.push(`<${tag}>${text}</${tag}>`);
          }
        });
        contentHtml = cleanParts.join('');

        break;
      }
    }

    // Fallback: just get all paragraphs from the page
    if (!contentText) {
      const paragraphs: string[] = [];
      $('p').each((_, p) => {
        const text = $(p).text().trim();
        if (text.length > 30) {
          paragraphs.push(text);
        }
      });
      contentText = paragraphs.slice(0, 20).join('\n\n');
    }

    return NextResponse.json({
      content: contentText,
      contentHtml,
      ogImage,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
