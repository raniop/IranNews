import { NextResponse } from 'next/server';
import { translateBatch, getCachedTranslations } from '@/lib/services/title-translator';

export const maxDuration = 60;

// POST: translate a batch of titles
export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ translations: {} });
    }

    // Limit batch size to 25
    const batch = items.slice(0, 25);
    const translations = await translateBatch(batch);
    return NextResponse.json({ translations });
  } catch (error) {
    console.error('Translate titles error:', error);
    return NextResponse.json({ translations: {} });
  }
}

// GET: get cached translations by IDs (comma-separated)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const translations = getCachedTranslations(ids);
  return NextResponse.json({ translations });
}
