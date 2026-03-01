import { NextResponse } from 'next/server';
import { sendClaudeMessage, parseClaudeJSON } from '@/lib/services/claude-api';
import { warPredictionPrompt } from '@/lib/services/claude-prompts';
import { getCachedArticles } from '@/lib/cache';
import { WarPrediction } from '@/lib/types';

export const maxDuration = 60;

// Server-side cache: prediction valid for 30 minutes
let cachedPrediction: WarPrediction | null = null;
let cachedAt = 0;
const CACHE_TTL = 30 * 60 * 1000;

export async function GET() {
  try {
    // Return cached if fresh
    if (cachedPrediction && Date.now() - cachedAt < CACHE_TTL) {
      return NextResponse.json({ prediction: cachedPrediction });
    }

    const articles = getCachedArticles();
    if (articles.length === 0) {
      return NextResponse.json(
        { error: 'No articles available for analysis' },
        { status: 404 }
      );
    }

    // Take up to 50 article summaries
    const summaries = articles
      .slice(0, 50)
      .map((a) => `[${a.sourceID}/${a.category}] ${a.title}`)
      .join('\n');

    const prompt = warPredictionPrompt(summaries);
    const response = await sendClaudeMessage(prompt.system, prompt.user, 2048);
    const parsed = parseClaudeJSON<Omit<WarPrediction, 'analyzedAt' | 'articleCount'>>(response);

    if (!parsed || typeof parsed.score !== 'number') {
      return NextResponse.json({ error: 'Failed to parse prediction' }, { status: 500 });
    }

    const prediction: WarPrediction = {
      ...parsed,
      analyzedAt: new Date().toISOString(),
      articleCount: Math.min(articles.length, 50),
    };

    cachedPrediction = prediction;
    cachedAt = Date.now();

    return NextResponse.json({ prediction });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
