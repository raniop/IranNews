'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, t, TranslationKey } from '@/lib/i18n';
import { LanguageContext } from '@/hooks/useLanguage';

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('he');

  useEffect(() => {
    const saved = localStorage.getItem('iranews_lang') as Language | null;
    if (saved === 'en' || saved === 'he') {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('iranews_lang', newLang);
  }, []);

  const translate = useCallback(
    (key: TranslationKey) => t(key, lang),
    [lang]
  );

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: translate, isRTL: lang === 'he' }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
