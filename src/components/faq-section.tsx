"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { useI18n } from "@/components/i18n-provider";

const FAQ_COUNT = 5;

export function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null);
  const { t } = useI18n();

  return (
    <section id="faq" className="page-section">
      <div className="container-main mx-auto max-w-3xl">
        <SectionHeader
          eyebrow={t("faq.eyebrow")}
          title={t("faq.title")}
          description={t("faq.desc")}
        />
        <div className="mt-10 space-y-3">
          {Array.from({ length: FAQ_COUNT }).map((_, index) => {
            const open = openId === index;
            const question = t(`faq.${index}.q`);
            return (
              <div key={question} className="card-soft overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : index)}
                >
                  <span className="font-heading text-base font-semibold text-warm-900 sm:text-lg">
                    {question}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-brand-700 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open ? (
                  <p className="border-t border-cream-200 px-5 py-4 text-sm leading-relaxed text-warm-500 sm:text-base">
                    {t(`faq.${index}.a`)}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
