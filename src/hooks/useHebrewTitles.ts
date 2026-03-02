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
let serverCacheLoaded = false;

export function useHebrewTitles(articles: Article[]) {
  const { lang } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, Translation>>({});
  const fetchingRef = useRef(false);
  const lastBatchRef = useRef('');

  // Step 1: On Hebrew mode, hydrate from server pre-translated cache
  useEffect(() => {
    if (lang !== 'he' || serverCacheLoaded) return;

    fetch('/api/translate-titles?all=true')
      .then((r) => r.json())
      .then((data) => {
        if (data.translations) {
          for (const [id, t] of Object.entries(data.translations)) {
            clientCache.set(id, t as Translation);
          }
          serverCacheLoaded = true;

          // Immediately apply server translations
          if (articles.length > 0) {
            const cached: Record<string, Translation> = {};
            for (const a of articles) {
              const t = clientCache.get(a.id);
              if (t) cached[a.id] = t;
            }
            if (Object.keys(cached).length > 0) {
              setTranslations(cached);
            }
          }
        }
      })
      .catch(() => {});
  }, [lang, articles]);

  // Step 2: Translate what server didn't pre-translate
  const fetchTranslations = useCallback(async (items: Article[]) => {
    if (fetchingRef.current) return;

    const untranslated = items.filter((a) => !clientCache.has(a.id));
    if (untranslated.length === 0) {
      const cached: Record<string, Translation> = {};
      for (const a of items) {
        const t = clientCache.get(a.id);
        if (t) cached[a.id] = t;
      }
      setTranslations(cached);
      return;
    }

    fetchingRef.current = true;

    // Build batches of 50 (up from 25 - fewer API calls)
    const batches: Array<{ id: string; title: string; description?: string }[]> = [];
    for (let i = 0; i < untranslated.length; i += 50) {
      batches.push(
        untranslated.slice(i, i + 50).map((a) => ({
          id: a.id,
          title: a.title,
          description: a.articleDescription,
        }))
      );
    }

    const updateState = () => {
      const result: Record<string, Translation> = {};
      for (const a of items) {
        const t = clientCache.get(a.id);
        if (t) result[a.id] = t;
      }
      setTranslations(result);
    };

    await Promise.all(
      batches.map(async (batch) => {
        try {
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
              updateState();
            }
          }
        } catch {
          // Silently fail for this batch
        }
      })
    );

    fetchingRef.current = false;
  }, []);

  useEffect(() => {
    if (lang !== 'he' || articles.length === 0) {
      setTranslations({});
      return;
    }

    const batchKey = articles
      .slice(0, 50)
      .map((a) => a.id)
      .join(',');
    if (batchKey === lastBatchRef.current) return;
    lastBatchRef.current = batchKey;

    // Set whatever we already have cached (instant from server pre-translation)
    const cached: Record<string, Translation> = {};
    for (const a of articles) {
      const t = clientCache.get(a.id);
      if (t) cached[a.id] = t;
    }
    if (Object.keys(cached).length > 0) {
      setTranslations(cached);
    }

    // Fetch only what's missing
    fetchTranslations(articles.slice(0, 50));
  }, [articles, lang, fetchTranslations]);

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

    const cached = clientCache.get(article.id);
    if (cached) {
      setTranslation(cached);
      return;
    }

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
