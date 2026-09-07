"use client";

import Link from "next/link";
import { site } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

export function PrivacyPageContent() {
  const { t } = useI18n();

  return (
    <div className="container-main mx-auto max-w-3xl">
      <p className="eyebrow">{t("privacy.eyebrow")}</p>
      <h1 className="mt-3 font-heading text-3xl font-bold text-warm-900 sm:text-4xl">
        {t("privacy.title")}
      </h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-warm-600">
        <p>
          {t("privacy.p1")} ({t("contacts.address")}). {site.url}
        </p>
        <h2 className="font-heading text-xl font-semibold text-warm-900">{t("privacy.h1")}</h2>
        <p>{t("privacy.p2")}</p>
        <h2 className="font-heading text-xl font-semibold text-warm-900">{t("privacy.h2")}</h2>
        <p>{t("privacy.p3")}</p>
        <h2 className="font-heading text-xl font-semibold text-warm-900">{t("privacy.h3")}</h2>
        <p>{t("privacy.p4")}</p>
        <h2 className="font-heading text-xl font-semibold text-warm-900">{t("privacy.h4")}</h2>
        <p>
          {t("privacy.p5a")} {site.notifyEmail} {t("privacy.p5b")} {site.telegramHandle}.
        </p>
        <h2 className="font-heading text-xl font-semibold text-warm-900">{t("privacy.h5")}</h2>
        <p>{t("privacy.p6")}</p>
      </div>
      <Link href="/#signup" className="btn-secondary mt-10 inline-flex h-11 px-6">
        {t("privacy.back")}
      </Link>
    </div>
  );
}
