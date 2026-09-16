"use client";

import Link from "next/link";
import { BookOpen, Gift, MapPin, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { TelegramChatButton } from "@/components/telegram-chat-button";
import { WatchCat } from "@/components/watch-cat";
import { useI18n } from "@/components/i18n-provider";

const heroBtn =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-center text-sm font-semibold leading-snug shadow-md transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] sm:px-4";

export function HeroCopy() {
  const { t } = useI18n();

  return (
    <div className="hero-copy flex w-full max-w-2xl flex-col items-start text-left">
      <div className="flex items-end gap-1.5 sm:gap-2.5">
        <p className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-brand-800 sm:text-6xl lg:text-7xl">
          {site.brandTitle}
        </p>
        <WatchCat />
      </div>
      <p className="mt-2 text-sm font-medium tracking-wide text-warm-700 sm:text-base">
        {t("brand.subtitle")}
      </p>

      <Link href="/courses/trial/" className="hero-offer mt-6 sm:mt-7">
        <span className="hero-offer-aura" aria-hidden />
        <span className="hero-offer-card">
          <span className="hero-offer-shine" aria-hidden />
          <Gift className="relative z-[1] size-5 shrink-0 text-brand-700 sm:size-6" strokeWidth={1.75} />
          <span className="relative z-[1]">
            <span className="hero-offer-title">{t("hero.offer")}</span>
            <span className="mt-0.5 block text-[0.7rem] font-medium tracking-wide text-brand-800/80 sm:text-xs">
              {t("hero.offerHint")}
            </span>
          </span>
        </span>
      </Link>

      <h1 className="hero-heading mt-8 max-w-xl">
        <span className="hero-heading-line">{t("hero.title.before")}</span>
        <svg className="hero-heading-yarn" viewBox="0 0 280 14" fill="none" aria-hidden>
          <path
            d="M2 9 C 28 2, 52 13, 80 7 S 130 1, 160 8 S 220 14, 278 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="hero-heading-place">
          <MapPin className="size-4 shrink-0 sm:size-[1.1rem]" strokeWidth={2.25} aria-hidden />
          {t("hero.title.accent")}
        </span>
      </h1>
      <p className="hero-slogan mt-5">
        {t("hero.slogan.before")}{" "}
        <span className="hero-slogan-accent">{t("hero.slogan.accent")}</span>
      </p>
      <p className="mt-3 max-w-md text-base leading-relaxed text-warm-700 sm:text-lg">{t("hero.lead")}</p>

      <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-3">
        <Link
          href="#courses"
          className={`${heroBtn} bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-brand-900/15 hover:from-brand-700 hover:to-brand-800`}
        >
          <BookOpen className="size-4 shrink-0" strokeWidth={2.25} />
          {t("hero.courses")}
        </Link>
        <Link
          href="#master-classes"
          className={`${heroBtn} border border-white/80 bg-white/90 text-warm-900 shadow-warm-900/10 backdrop-blur-md hover:bg-white`}
        >
          <Sparkles className="size-4 shrink-0 text-brand-700" strokeWidth={2.25} />
          {t("hero.masters")}
        </Link>
        <TelegramChatButton
          className={`${heroBtn} border border-sky-200/90 bg-[#2AABEE]/12 text-warm-900 shadow-sky-900/10 backdrop-blur-md hover:bg-[#2AABEE]/18`}
        />
      </div>
    </div>
  );
}
