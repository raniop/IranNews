import { NextResponse } from 'next/server';
import { translateToHebrew, translateToEnglish } from '@/lib/services/translation-service';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    const translation = targetLanguage === 'he'
      ? await translateToHebrew(text)
      : await translateToEnglish(text);

    return NextResponse.json({ translation });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
