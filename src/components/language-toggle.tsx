"use client";

import { useI18n } from "@/components/i18n-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="inline-flex h-9 items-center rounded-xl border border-cream-200 bg-white p-0.5 text-xs font-semibold">
      <button
        type="button"
        className={`rounded-lg px-2 py-1.5 transition-colors ${
          locale === "ru" ? "bg-brand-100 text-brand-800" : "text-warm-500 hover:text-brand-800"
        }`}
        onClick={() => setLocale("ru")}
        aria-pressed={locale === "ru"}
      >
        RU
      </button>
      <button
        type="button"
        className={`rounded-lg px-2 py-1.5 transition-colors ${
          locale === "kk" ? "bg-brand-100 text-brand-800" : "text-warm-500 hover:text-brand-800"
        }`}
        onClick={() => setLocale("kk")}
        aria-pressed={locale === "kk"}
      >
        KZ
      </button>
    </div>
  );
}
