import { NextResponse } from 'next/server';
import { sendClaudeMessage } from '@/lib/services/claude-api';
import { summarizePrompt } from '@/lib/services/claude-prompts';
import { Article } from '@/lib/types';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const article: Article = await request.json();
    const prompt = summarizePrompt(article);
    const summary = await sendClaudeMessage(prompt.system, prompt.user);
    return NextResponse.json({ summary });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
