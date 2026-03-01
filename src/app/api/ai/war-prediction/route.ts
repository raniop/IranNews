import { NextResponse } from 'next/server';
import { sendClaudeMessage, parseClaudeJSON } from '@/lib/services/claude-api';
import { warPredictionPrompt } from '@/lib/services/claude-prompts';
import { WarPrediction } from '@/lib/types';

export const maxDuration = 60;

// Server-side cache: prediction valid for 30 minutes
let cachedPrediction: WarPrediction | null = null;
let cachedAt = 0;
const CACHE_TTL = 30 * 60 * 1000;

export async function POST(request: Request) {
  try {
    // Return cached if fresh
    if (cachedPrediction && Date.now() - cachedAt < CACHE_TTL) {
      return NextResponse.json({ prediction: cachedPrediction });
    }

    const { titles } = await request.json();
    if (!Array.isArray(titles) || titles.length === 0) {
      return NextResponse.json(
        { error: 'No article titles provided' },
        { status: 400 }
      );
    }

    const summaries = titles.slice(0, 50).join('\n');

    const prompt = warPredictionPrompt(summaries);
    const response = await sendClaudeMessage(prompt.system, prompt.user, 2048);
    const parsed = parseClaudeJSON<Omit<WarPrediction, 'analyzedAt' | 'articleCount'>>(response);

    if (!parsed || typeof parsed.score !== 'number') {
      return NextResponse.json({ error: 'Failed to parse prediction' }, { status: 500 });
    }

    const prediction: WarPrediction = {
      ...parsed,
      analyzedAt: new Date().toISOString(),
      articleCount: Math.min(titles.length, 50),
    };

    cachedPrediction = prediction;
    cachedAt = Date.now();

    return NextResponse.json({ prediction });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
