import { NextResponse } from 'next/server';

export const maxDuration = 15;

// In-memory cache for og:image results
const ogCache = new Map<string, { image: string | null; ts: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ image: null });
    }

    // Check cache
    const cached = ogCache.get(url);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json({ image: cached.image });
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; IranNewsBot/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      ogCache.set(url, { image: null, ts: Date.now() });
      return NextResponse.json({ image: null });
    }

    // Only read first 50KB to find meta tags quickly
    const reader = res.body?.getReader();
    let html = '';
    if (reader) {
      const decoder = new TextDecoder();
      let done = false;
      while (!done && html.length < 100000) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) html += decoder.decode(value, { stream: true });
      }
      reader.cancel();
    }

    // Extract og:image or twitter:image
    let image: string | null = null;
    const ogMatch = html.match(
      /<meta[^>]+(?:property=["']og:image["']|name=["']twitter:image["'])[^>]+content=["']([^"']+)["']/i
    );
    if (ogMatch?.[1]) {
      image = ogMatch[1];
    } else {
      // Try reverse attribute order
      const ogMatch2 = html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property=["']og:image["']|name=["']twitter:image["'])/i
      );
      if (ogMatch2?.[1]) {
        image = ogMatch2[1];
      }
    }

    // Fallback: find the first significant <img> in article content
    if (!image) {
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*/gi;
      let match;
      while ((match = imgRegex.exec(html)) !== null) {
        const src = match[0];
        const imgUrl = match[1];
        // Skip tiny icons, spacers, logos, tracking pixels, data URIs
        if (imgUrl.includes('data:image')) continue;
        if (imgUrl.includes('blank.gif') || imgUrl.includes('pixel') || imgUrl.includes('spacer')) continue;
        if (imgUrl.includes('logo') || imgUrl.includes('icon') || imgUrl.includes('favicon')) continue;
        if (imgUrl.includes('avatar') || imgUrl.includes('emoji')) continue;
        // Check for width/height attributes - skip tiny images
        const widthMatch = src.match(/width=["']?(\d+)/i);
        const heightMatch = src.match(/height=["']?(\d+)/i);
        if (widthMatch && parseInt(widthMatch[1]) < 100) continue;
        if (heightMatch && parseInt(heightMatch[1]) < 100) continue;
        // Resolve relative URLs
        let resolved = imgUrl;
        if (!imgUrl.startsWith('http')) {
          try {
            resolved = new URL(imgUrl, url).href;
          } catch {
            continue;
          }
        }
        image = resolved;
        break;
      }
    }

    ogCache.set(url, { image, ts: Date.now() });
    return NextResponse.json({ image });
  } catch {
    return NextResponse.json({ image: null });
  }
}
