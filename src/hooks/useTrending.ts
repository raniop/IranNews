'use client';

import useSWR from 'swr';
import { TrendingTopic } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTrending() {
  const { data, error, isLoading } = useSWR<{
    topics: TrendingTopic[];
    articleCount: number;
  }>('/api/trending', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });

  return {
    topics: data?.topics ?? [],
    articleCount: data?.articleCount ?? 0,
    isLoading,
    error,
  };
}
