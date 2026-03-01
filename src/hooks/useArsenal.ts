'use client';

import useSWR from 'swr';
import { ArsenalData } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useArsenal() {
  const { data, error, isLoading } = useSWR<ArsenalData>(
    '/api/arsenal',
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
