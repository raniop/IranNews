import { NextResponse } from 'next/server';
import { translateBatch, getCachedTranslations, getAllCachedTranslations } from '@/lib/services/title-translator';

export const maxDuration = 60;

// POST: translate a batch of titles
export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ translations: {} });
    }

    // Increased batch size to 50 for faster throughput
    const batch = items.slice(0, 50);
    const translations = await translateBatch(batch);
    return NextResponse.json({ translations });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Translate titles error:', msg);
    return NextResponse.json({ translations: {}, error: msg });
  }
}

// GET: get cached translations
// ?ids=id1,id2,... → specific IDs
// ?all=true → all cached translations (for client hydration)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Return ALL cached translations (for instant Hebrew hydration)
  if (searchParams.get('all') === 'true') {
    const translations = getAllCachedTranslations();
    return NextResponse.json({
      translations,
      count: Object.keys(translations).length,
    });
  }

  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const translations = getCachedTranslations(ids);
  return NextResponse.json({ translations });
}
