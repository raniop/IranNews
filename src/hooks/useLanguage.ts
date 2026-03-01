'use client';

import { createContext, useContext } from 'react';
import { Language, t, TranslationKey } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'he',
  setLang: () => {},
  t: (key) => t(key, 'he'),
  isRTL: true,
});

export function useLanguage() {
  return useContext(LanguageContext);
}
