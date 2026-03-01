import { sendClaudeMessage } from './claude-api';
import { translateToHebrewPrompt, translateToEnglishPrompt } from './claude-prompts';

export async function translateToHebrew(text: string): Promise<string> {
  const prompt = translateToHebrewPrompt(text);
  return sendClaudeMessage(prompt.system, prompt.user);
}

export async function translateToEnglish(text: string): Promise<string> {
  const prompt = translateToEnglishPrompt(text);
  return sendClaudeMessage(prompt.system, prompt.user);
}
