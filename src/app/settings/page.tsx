'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const clearCache = () => {
    fetch('/api/articles?force=true')
      .then(() => alert('Cache cleared! Next load will fetch fresh data.'))
      .catch(() => alert('Failed to clear cache'));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
        Settings
      </h1>

      <div className="space-y-4">
        {/* Appearance */}
        <Section title="Appearance">
          {mounted && (
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                    theme === t
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </Section>

        {/* Data */}
        <Section title="Data">
          <button
            onClick={clearCache}
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Clear Article Cache
          </button>
          <p className="text-[11px] text-zinc-400 mt-1.5">
            Forces a fresh fetch from all sources on next load
          </p>
        </Section>

        {/* About */}
        <Section title="About">
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium text-zinc-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>AI Model</span>
              <span className="font-medium text-zinc-900 dark:text-white">Claude Sonnet</span>
            </div>
            <div className="flex justify-between">
              <span>Sources</span>
              <span className="font-medium text-zinc-900 dark:text-white">21 configured</span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
