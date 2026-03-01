import { CLAUDE_API_ENDPOINT, CLAUDE_API_VERSION, CLAUDE_MODEL, CLAUDE_MAX_TOKENS } from '../constants';

export async function sendClaudeMessage(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY not configured');
  }

  const res = await fetch(CLAUDE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': CLAUDE_API_VERSION,
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    const status = res.status;
    if (status === 401) throw new Error('Invalid Claude API key');
    if (status === 429) throw new Error('Claude API rate limited');
    throw new Error(`Claude API error: ${status}`);
  }

  const json = await res.json();
  const text = json?.content?.[0]?.text;
  if (!text) {
    throw new Error('Failed to parse Claude response');
  }

  return text;
}

/** Parse JSON from Claude response, stripping markdown code fences */
export function parseClaudeJSON<T>(text: string): T | null {
  let json = text.trim();

  // Strip markdown code fences
  if (json.startsWith('```')) {
    const firstNewline = json.indexOf('\n');
    if (firstNewline !== -1) {
      json = json.slice(firstNewline + 1);
    }
    if (json.endsWith('```')) {
      json = json.slice(0, -3);
    }
    json = json.trim();
  }

  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
