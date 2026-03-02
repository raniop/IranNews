'use client';

import useSWR from 'swr';
import { Article } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useArticles(category?: string) {
  const params = new URLSearchParams();
  if (category && category !== 'all') {
    params.set('category', category);
  }
  const query = params.toString();
  const url = `/api/articles${query ? `?${query}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<{
    articles: Article[];
    total: number;
    cached: boolean;
    fetchedAt?: string;
  }>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const refresh = () => {
    const forceUrl = `/api/articles?force=true${category && category !== 'all' ? `&category=${category}` : ''}`;
    return mutate(
      fetch(forceUrl).then((res) => res.json()),
      { revalidate: false }
    );
  };

  return {
    articles: data?.articles ?? [],
    total: data?.total ?? 0,
    cached: data?.cached ?? false,
    fetchedAt: data?.fetchedAt ?? null,
    isLoading,
    error,
    refresh,
  };
}
