"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function HeroCopy() {
  const { locale, t } = useI18n();

  return (
    <>
      <div className="badge-soft inline-flex shrink-0 gap-2 px-4 py-2 md:mb-10">
        <Sparkles className="size-4" />
        {t("hero.badge")}
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center space-y-6 py-4 sm:space-y-8 md:flex-none md:py-0">
        <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-warm-900 sm:text-5xl lg:text-6xl">
          {locale === "kk" ? (
            <>
              Сүйікті <span className="text-gradient">ісіңіз</span>
            </>
          ) : (
            <>
              Любимое ваше <span className="text-gradient">занятие</span>
            </>
          )}
        </h1>
        <p className="mx-auto max-w-lg text-lg leading-relaxed text-warm-500">{t("hero.lead")}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="#courses" className="btn-primary h-11 px-6">
            {t("hero.courses")}
            <ArrowRight className="size-4" />
          </Link>
          <Link href="#master-classes" className="btn-secondary h-11 px-6">
            {t("hero.masters")}
          </Link>
        </div>
      </div>
    </>
  );
}
