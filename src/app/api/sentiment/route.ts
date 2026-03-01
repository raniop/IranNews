import { NextResponse } from 'next/server';
import { BASELINE_DATA_POINTS, calculateIndex } from '@/lib/sentiment-data';
import { SentimentIndex } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Cache sentiment index for 10 minutes
let cached: { data: SentimentIndex; fetchedAt: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000;

export async function GET() {
  const now = Date.now();

  if (cached && now - cached.fetchedAt < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // Phase 1: Calculate from baseline data only
  // Phase 2 (future): Merge with AI-extracted data points from Supabase
  const data = calculateIndex(BASELINE_DATA_POINTS);

  cached = { data, fetchedAt: now };
  return NextResponse.json(data);
}
