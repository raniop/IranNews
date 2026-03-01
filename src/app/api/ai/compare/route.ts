import { NextResponse } from 'next/server';
import { sendClaudeMessage, parseClaudeJSON } from '@/lib/services/claude-api';
import { compareStoriesPrompt } from '@/lib/services/claude-prompts';
import { Article } from '@/lib/types';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { articles }: { articles: Article[] } = await request.json();

    if (!articles || articles.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 articles required for comparison' },
        { status: 400 }
      );
    }

    const prompt = compareStoriesPrompt(articles);
    const raw = await sendClaudeMessage(prompt.system, prompt.user);
    const comparison = parseClaudeJSON(raw);

    return NextResponse.json({ comparison });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
