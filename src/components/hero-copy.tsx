"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

export function HeroCopy() {
  const { locale, t } = useI18n();

  return (
    <div className="hero-copy flex w-full max-w-2xl flex-col items-start text-left">
      <p className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
        {site.brandTitle}
      </p>
      <p className="mt-2 text-sm font-medium tracking-wide text-white/80 sm:text-base">
        {t("brand.subtitle")}
      </p>

      <h1 className="mt-8 font-heading text-2xl font-semibold leading-snug tracking-tight text-white sm:mt-10 sm:text-3xl lg:text-4xl">
        {locale === "kk" ? (
          <>
            Сіздің сүйікті <span className="text-accent-200">ісіңіз</span>
          </>
        ) : (
          <>
            Любимое ваше <span className="text-accent-200">занятие</span>
          </>
        )}
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">{t("hero.lead")}</p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link href="#courses" className="btn-primary h-11 px-6">
          {t("hero.courses")}
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="#master-classes"
          className="btn-secondary h-11 border-white/30 bg-white/15 px-6 text-white backdrop-blur-sm hover:bg-white/25"
        >
          {t("hero.masters")}
        </Link>
      </div>
    </div>
  );
}
