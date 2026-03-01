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
    return NextResponse.json(cached.data);
  }

  // Try to scrape fresh data from iranrocketsarsenal.com
  let data: ArsenalData = ARSENAL_BASELINE;

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
          // Try to extract relevant data if structure matches
          if (embedded?.props?.pageProps?.missiles) {
            const props = embedded.props.pageProps;
            data = {
              ...ARSENAL_BASELINE,
              lastUpdated: new Date().toISOString(),
              missiles: {
                ...ARSENAL_BASELINE.missiles,
                currentEstimate: props.missiles.current ?? ARSENAL_BASELINE.missiles.currentEstimate,
              },
            };
          }
        } catch {
          // JSON parse failed, use baseline
        }
      }

      // Also try to find specific numbers in the HTML
      const missileMatch = html.match(/~?([\d,]+)\s*(?:missiles|ballistic)/i);
      if (missileMatch) {
        const count = parseInt(missileMatch[1].replace(/,/g, ''), 10);
        if (count > 100 && count < 10000) {
          data = {
            ...data,
            missiles: { ...data.missiles, currentEstimate: count },
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
