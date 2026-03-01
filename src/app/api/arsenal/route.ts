import { NextResponse } from 'next/server';
import { ARSENAL_BASELINE } from '@/lib/arsenal-data';
import { ArsenalData } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Cache arsenal data for 10 minutes
let cached: { data: ArsenalData; fetchedAt: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000;

export async function GET() {
  const now = Date.now();

  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    // Update scan times dynamically
    const data = {
      ...cached.data,
      systemStatus: {
        ...cached.data.systemStatus,
        lastScan: new Date(cached.fetchedAt).toISOString(),
        nextScan: new Date(cached.fetchedAt + CACHE_TTL).toISOString(),
      },
    };
    return NextResponse.json(data);
  }

  // Try to scrape fresh data from iranrocketsarsenal.com
  let data: ArsenalData = {
    ...ARSENAL_BASELINE,
    systemStatus: {
      ...ARSENAL_BASELINE.systemStatus,
      lastScan: new Date(now).toISOString(),
      nextScan: new Date(now + CACHE_TTL).toISOString(),
    },
  };

  try {
    const res = await fetch('https://iranrocketsarsenal.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IranNewsBot/1.0)',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const html = await res.text();

      // Try to extract embedded JSON data from the React SPA
      const scriptMatch = html.match(new RegExp('__NEXT_DATA__\\s*=\\s*({.*?})\\s*</script>', 's'))
        || html.match(new RegExp('window\\.__data\\s*=\\s*({.*?});', 's'));

      if (scriptMatch) {
        try {
          const embedded = JSON.parse(scriptMatch[1]);
          if (embedded?.props?.pageProps) {
            const props = embedded.props.pageProps;
            if (props.rockets?.remaining) {
              data = {
                ...data,
                lastUpdated: new Date().toISOString(),
                rockets: {
                  remaining: props.rockets.remaining,
                  started: props.rockets.started ?? data.rockets.started,
                  gone: props.rockets.gone ?? data.rockets.gone,
                  remainingPercent: props.rockets.remainingPercent ?? data.rockets.remainingPercent,
                },
              };
            }
          }
        } catch {
          // JSON parse failed, use baseline
        }
      }

      // Also try to find specific numbers in the HTML
      const rocketMatch = html.match(/(\d{3,4})\s*<[^>]*>.*?(?:remaining|ballistic)/i);
      if (rocketMatch) {
        const count = parseInt(rocketMatch[1], 10);
        if (count > 100 && count < 5000) {
          data = {
            ...data,
            rockets: {
              ...data.rockets,
              remaining: count,
              gone: data.rockets.started - count,
              remainingPercent: Math.round((count / data.rockets.started) * 1000) / 10,
            },
            lastUpdated: new Date().toISOString(),
          };
        }
      }
    }
  } catch {
    // Scrape failed, use baseline data (this is expected)
    console.log('[arsenal] Scrape failed, using baseline data');
  }

  cached = { data, fetchedAt: now };
  return NextResponse.json(data);
}
