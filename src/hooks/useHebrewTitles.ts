'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Article } from '@/lib/types';
import { useLanguage } from './useLanguage';

interface Translation {
  title: string;
  description?: string;
}

// Global client-side cache persists across re-renders
const clientCache = new Map<string, Translation>();

export function useHebrewTitles(articles: Article[]) {
  const { lang } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, Translation>>({});
  const fetchingRef = useRef(false);
  const lastBatchRef = useRef('');

  const fetchTranslations = useCallback(async (items: Article[]) => {
    if (fetchingRef.current) return;

    // Find articles not yet translated
    const untranslated = items.filter((a) => !clientCache.has(a.id));
    if (untranslated.length === 0) {
      // All cached - just update state from cache
      const cached: Record<string, Translation> = {};
      for (const a of items) {
        const t = clientCache.get(a.id);
        if (t) cached[a.id] = t;
      }
      setTranslations(cached);
      return;
    }

    fetchingRef.current = true;
    try {
      // Send in batches of 20
      for (let i = 0; i < untranslated.length; i += 20) {
        const batch = untranslated.slice(i, i + 20).map((a) => ({
          id: a.id,
          title: a.title,
          description: a.articleDescription,
        }));

        const res = await fetch('/api/translate-titles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: batch }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.translations) {
            for (const [id, t] of Object.entries(data.translations)) {
              clientCache.set(id, t as Translation);
            }
          }
        }
      }
    } catch {
      // Silently fail - show original titles
    } finally {
      fetchingRef.current = false;
    }

    // Update state with all cached translations
    const result: Record<string, Translation> = {};
    for (const a of items) {
      const t = clientCache.get(a.id);
      if (t) result[a.id] = t;
    }
    setTranslations(result);
  }, []);

  useEffect(() => {
    if (lang !== 'he' || articles.length === 0) {
      setTranslations({});
      return;
    }

    // Build batch key to avoid re-fetching the same set
    const batchKey = articles
      .slice(0, 30)
      .map((a) => a.id)
      .join(',');
    if (batchKey === lastBatchRef.current) return;
    lastBatchRef.current = batchKey;

    // First set whatever we have cached
    const cached: Record<string, Translation> = {};
    for (const a of articles) {
      const t = clientCache.get(a.id);
      if (t) cached[a.id] = t;
    }
    if (Object.keys(cached).length > 0) {
      setTranslations(cached);
    }

    // Then fetch missing translations (first 30 articles visible)
    fetchTranslations(articles.slice(0, 30));
  }, [articles, lang, fetchTranslations]);

  // Helper to get translated title for an article
  const getTitle = useCallback(
    (article: Article): string => {
      if (lang === 'he' && translations[article.id]?.title) {
        return translations[article.id].title;
      }
      return article.title;
    },
    [lang, translations]
  );

  const getDescription = useCallback(
    (article: Article): string | undefined => {
      if (lang === 'he' && translations[article.id]?.description) {
        return translations[article.id].description;
      }
      return article.articleDescription;
    },
    [lang, translations]
  );

  return { translations, getTitle, getDescription };
}

// Single article translation hook
export function useHebrewTitle(article: Article | undefined) {
  const { lang } = useLanguage();
  const [translation, setTranslation] = useState<Translation | null>(null);

  useEffect(() => {
    if (!article || lang !== 'he') {
      setTranslation(null);
      return;
    }

    // Check cache first
    const cached = clientCache.get(article.id);
    if (cached) {
      setTranslation(cached);
      return;
    }

    // Fetch translation
    fetch('/api/translate-titles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: article.id, title: article.title, description: article.articleDescription }],
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.translations?.[article.id]) {
          const t = data.translations[article.id] as Translation;
          clientCache.set(article.id, t);
          setTranslation(t);
        }
      })
      .catch(() => {});
  }, [article, lang]);

  return {
    title: lang === 'he' && translation?.title ? translation.title : article?.title || '',
    description:
      lang === 'he' && translation?.description
        ? translation.description
        : article?.articleDescription,
  };
}
