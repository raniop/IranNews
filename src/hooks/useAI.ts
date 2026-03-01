'use client';

import { useState } from 'react';
import { Article, AIAnalysis, ComparisonData } from '@/lib/types';

export function useAISummarize() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = async (article: Article) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to summarize');
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, error, summarize, reset: () => setSummary(null) };
}

export function useAIAnalyze() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (article: Article) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to analyze');
    } finally {
      setLoading(false);
    }
  };

  return { analysis, loading, error, analyze, reset: () => setAnalysis(null) };
}

export function useAITranslate() {
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (text: string, targetLanguage: 'he' | 'en') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTranslation(data.translation);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to translate');
    } finally {
      setLoading(false);
    }
  };

  return { translation, loading, error, translate, reset: () => setTranslation(null) };
}

export function useAICompare() {
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async (articles: Article[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setComparison(data.comparison);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to compare');
    } finally {
      setLoading(false);
    }
  };

  return { comparison, loading, error, compare, reset: () => setComparison(null) };
}
