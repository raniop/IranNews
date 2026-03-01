import { NextResponse } from 'next/server';
import { sendClaudeMessage, parseClaudeJSON } from '@/lib/services/claude-api';
import { analyzeBiasPrompt } from '@/lib/services/claude-prompts';
import { Article, AIAnalysis } from '@/lib/types';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const article: Article = await request.json();
    const prompt = analyzeBiasPrompt(article);
    const result = await sendClaudeMessage(prompt.system, prompt.user);

    const analysis = parseClaudeJSON<AIAnalysis>(result);
    if (analysis) {
      return NextResponse.json(analysis);
    }

    // Fallback: return raw text
    return NextResponse.json({
      sentimentScore: 0,
      sentimentLabel: 'unknown',
      biasIndicators: [],
      explanation: result,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
