'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TranslationKey } from '@/lib/i18n';

const THEME_KEYS: Record<string, TranslationKey> = {
  light: 'settings.light',
  dark: 'settings.dark',
  system: 'settings.system',
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const clearCache = () => {
    fetch('/api/articles?force=true')
      .then(() => alert(t('settings.cacheCleared')))
      .catch(() => alert(t('settings.cacheFailed')));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
        {t('settings.title')}
      </h1>

      <div className="space-y-4">
        {/* Language */}
        <Section title={t('settings.language')}>
          {mounted && (
            <div className="flex gap-2">
              {(['he', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    lang === l
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {l === 'he' ? 'עברית' : 'English'}
                </button>
              ))}
            </div>
          )}
        </Section>

        {/* Appearance */}
        <Section title={t('settings.appearance')}>
          {mounted && (
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    theme === themeOption
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {t(THEME_KEYS[themeOption])}
                </button>
              ))}
            </div>
          )}
        </Section>

        {/* Data */}
        <Section title={t('settings.data')}>
          <button
            onClick={clearCache}
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {t('settings.clearCache')}
          </button>
          <p className="text-[11px] text-zinc-400 mt-1.5">
            {t('settings.clearCacheDesc')}
          </p>
        </Section>

        {/* About */}
        <Section title={t('settings.about')}>
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>{t('settings.version')}</span>
              <span className="font-medium text-zinc-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>{t('settings.aiModel')}</span>
              <span className="font-medium text-zinc-900 dark:text-white">Claude Sonnet</span>
            </div>
            <div className="flex justify-between">
              <span>{t('nav.sources')}</span>
              <span className="font-medium text-zinc-900 dark:text-white">21 {t('settings.sourcesCount')}</span>
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
