"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { faqItems } from "@/data/site";

export function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section id="faq" className="page-section">
      <div className="container-main mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="Вопросы"
          title="Частые вопросы"
          description="Коротко о возрасте, материалах, длительности занятий и записи."
        />
        <div className="mt-10 space-y-3">
          {faqItems.map((item, index) => {
            const open = openId === index;
            return (
              <div key={item.question} className="card-soft overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : index)}
                >
                  <span className="font-heading text-base font-semibold text-warm-900 sm:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-brand-700 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open ? (
                  <p className="border-t border-cream-200 px-5 py-4 text-sm leading-relaxed text-warm-500 sm:text-base">
                    {item.answer}
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
