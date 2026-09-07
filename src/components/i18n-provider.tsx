"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { messages, type Locale } from "@/i18n/messages";

export type { Locale };

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    const saved = window.localStorage.getItem("lappy-locale");
    if (saved === "ru" || saved === "kk") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "kk" ? "kk" : "ru";
    window.localStorage.setItem("lappy-locale", locale);
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: (key: string) => messages[locale][key] ?? messages.ru[key] ?? key,
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: "ru" as Locale,
      setLocale: () => undefined,
      t: (key: string) => messages.ru[key] ?? key,
    };
  }
  return ctx;
}
