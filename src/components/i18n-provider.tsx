"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "ru" | "kk";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const dict: Record<Locale, Record<string, string>> = {
  ru: {
    "nav./#about": "Обо мне",
    "nav./#courses": "Уроки",
    "nav./#master-classes": "Мастер-классы",
    "nav./#schedule": "Расписание",
    "nav./#works": "Работы",
    "nav./#reviews": "Отзывы",
    "nav./#contacts": "Контакты",
    "cta.signup": "Записаться",
    "hero.badge": "Создаём руками вместе",
    "hero.title": "Любимое ваше занятие",
    "hero.lead":
      "Приходите в студию на занятия по вязанию, макраме, вышивке и откройте для себя новое увлечение — спокойно, пошагово и с поддержкой на каждом этапе.",
    "hero.courses": "Выбрать курс",
    "hero.masters": "Мастер-классы",
  },
  kk: {
    "nav./#about": "Мен туралы",
    "nav./#courses": "Сабақтар",
    "nav./#master-classes": "Мастер-класстар",
    "nav./#schedule": "Кесте",
    "nav./#works": "Жұмыстар",
    "nav./#reviews": "Пікірлер",
    "nav./#contacts": "Байланыс",
    "cta.signup": "Жазылу",
    "hero.badge": "Қолмен бірге жасаймыз",
    "hero.title": "Сүйікті ісіңіз",
    "hero.lead":
      "Студияға тоқыма, макраме, кесте сабақтарына келіңіз — байыппен, қадамдап және әр кезеңде қолдаумен.",
    "hero.courses": "Курс таңдау",
    "hero.masters": "Мастер-класстар",
  },
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
      t: (key: string) => dict[locale][key] ?? dict.ru[key] ?? key,
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
      t: (key: string) => dict.ru[key] ?? key,
    };
  }
  return ctx;
}
