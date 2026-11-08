/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import frMessages from './fr.json';
import arMessages from './ar.json';

export type Locale = 'fr' | 'ar';
type Messages = typeof frMessages;

const MESSAGES_MAP: Record<Locale, Messages> = {
  fr: frMessages,
  ar: arMessages,
};

const STORAGE_KEY = 'techialab_locale';

interface IntlContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  messages: Messages;
}

const IntlContext = createContext<IntlContextValue>({
  locale: 'fr',
  setLocale: () => {},
  messages: frMessages,
});

export const NextIntlClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default language is always FRENCH ('fr') if the user has never chosen
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ar' || saved === 'fr') {
        return saved;
      }
    } catch {
      // Fallback to French if storage is restricted
    }
    return 'fr';
  });

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Sync HTML dir (RTL for Arabic, LTR for French) and lang attribute
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return (
    <IntlContext.Provider
      value={{
        locale,
        setLocale,
        messages: MESSAGES_MAP[locale] || frMessages,
      }}
    >
      {children}
    </IntlContext.Provider>
  );
};

export function useLocale(): { locale: Locale; setLocale: (next: Locale) => void } {
  const ctx = useContext(IntlContext);
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}

export function useTranslations<Namespace extends keyof Messages>(namespace: Namespace) {
  const { messages } = useContext(IntlContext);
  const group = messages[namespace];

  return useCallback(
    (key: keyof Messages[Namespace]): string => {
      const val = group?.[key];
      return typeof val === 'string' ? val : String(key);
    },
    [group]
  );
}
