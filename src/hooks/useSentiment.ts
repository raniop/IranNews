'use client';

import useSWR from 'swr';
import { SentimentIndex } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSentiment() {
  const { data, error, isLoading } = useSWR<SentimentIndex>(
    '/api/sentiment',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 min dedup
    }
  );

  return {
    data: data ?? null,
    isLoading,
    error,
  };
}
