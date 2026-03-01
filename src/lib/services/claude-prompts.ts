import { Article } from '../types';

// Direct port from iOS ClaudePrompts.swift

export function summarizePrompt(article: Article) {
  return {
    system: `You are a news analyst specializing in Iranian affairs. Provide concise, objective summaries.
Always respond in plain text without markdown formatting.`,
    user: `Summarize the following news article in 3-4 sentences. Focus on key facts, actors involved, and significance.

Title: ${article.title}
Source: ${article.sourceID} (${article.category})
Description: ${article.articleDescription || 'N/A'}
Content: ${article.content || 'N/A'}`,
  };
}

export function analyzeBiasPrompt(article: Article) {
  return {
    system: `You are a media bias analyst. Analyze news articles for bias, sentiment, and framing.
Respond ONLY in valid JSON format with this exact structure:
{
    "sentimentScore": <number from -1.0 to 1.0>,
    "sentimentLabel": "<positive|negative|neutral|mixed>",
    "biasIndicators": ["<indicator1>", "<indicator2>"],
    "explanation": "<brief explanation>"
}`,
    user: `Analyze the following article for bias and sentiment:

Title: ${article.title}
Source: ${article.sourceID} (Category: ${article.category})
Description: ${article.articleDescription || 'N/A'}
Content: ${article.content || 'N/A'}`,
  };
}

export function translateToHebrewPrompt(text: string) {
  return {
    system: `You are a professional translator. Translate the following text to Hebrew.
Respond ONLY with the translated text, nothing else. Maintain the original meaning and tone.`,
    user: text,
  };
}

export function translateToEnglishPrompt(text: string) {
  return {
    system: `You are a professional translator. Translate the following text to English.
Respond ONLY with the translated text, nothing else. Maintain the original meaning and tone.`,
    user: text,
  };
}

export function compareStoriesPrompt(articles: Article[]) {
  const articlesText = articles
    .map((article, i) => `--- Article ${i + 1} ---
Source: ${article.sourceID} (${article.category})
Title: ${article.title}
Description: ${article.articleDescription || 'N/A'}`)
    .join('\n\n');

  return {
    system: `You are a media analyst comparing how different sources cover the same story.
Respond in valid JSON format:
{
    "topic": "<common topic>",
    "keyDifferences": "<summary of key differences in coverage>",
    "framingAnalysis": [
        {
            "sourceID": "<source>",
            "tone": "<tone description>",
            "keyQuote": "<representative phrase from article>"
        }
    ]
}`,
    user: `Compare how these sources cover the same story:

${articlesText}`,
  };
}

export function identifyTrendingPrompt(titles: string[]) {
  const titlesText = titles.map((t, i) => `${i + 1}. ${t}`).join('\n');

  return {
    system: `You are a news editor identifying trending topics from headlines.
Respond in valid JSON format:
{
    "topics": [
        {
            "title": "<topic title>",
            "relatedArticleIndices": [1, 3, 7],
            "significance": "<why this is trending>"
        }
    ]
}
Group related headlines into topics. Return up to 10 topics.`,
    user: `Identify trending topics from these headlines:

${titlesText}`,
  };
}

export function batchTranslatePersianPrompt(titles: string[]) {
  const numbered = titles.map((t, i) => `${i + 1}. ${t}`).join('\n');

  return {
    system: `You are a translator. Translate each numbered Persian/Farsi headline to English.
Return ONLY the numbered translations, one per line, in the same order.
Keep translations concise - headline style. Do not add explanations.`,
    user: `Translate these Persian headlines to English:\n\n${numbered}`,
  };
}
