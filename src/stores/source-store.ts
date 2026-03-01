'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { allSources } from '@/lib/sources';

interface SourceState {
  disabledSources: Set<string>;
  toggleSource: (id: string) => void;
  isSourceEnabled: (id: string) => boolean;
  enableAll: () => void;
  disableAll: () => void;
}

export const useSourceStore = create<SourceState>()(
  persist(
    (set, get) => ({
      disabledSources: new Set(
        allSources.filter((s) => !s.isEnabled).map((s) => s.id)
      ),
      toggleSource: (id: string) => {
        set((state) => {
          const next = new Set(state.disabledSources);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return { disabledSources: next };
        });
      },
      isSourceEnabled: (id: string) => !get().disabledSources.has(id),
      enableAll: () => set({ disabledSources: new Set() }),
      disableAll: () =>
        set({ disabledSources: new Set(allSources.map((s) => s.id)) }),
    }),
    {
      name: 'iran-news-sources',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Convert array back to Set
          if (parsed.state?.disabledSources) {
            parsed.state.disabledSources = new Set(parsed.state.disabledSources);
          }
          return parsed;
        },
        setItem: (name, value) => {
          // Convert Set to array for serialization
          const serializable = {
            ...value,
            state: {
              ...value.state,
              disabledSources: Array.from(value.state.disabledSources),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializable));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
