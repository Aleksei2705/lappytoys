"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { PriceText } from "@/components/price-text";
import { masterClasses, site } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

export function MasterClassesCarousel() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const count = masterClasses.length;

  const goTo = useCallback(
    (next: number) => {
      const bounded = ((next % count) + count) % count;
      setIndex(bounded);
      const scroller = scrollerRef.current;
      const slide = scroller?.children[bounded] as HTMLElement | undefined;
      slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function onScroll() {
      if (!scroller) return;
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(scroller.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="master-classes" className="page-section section-alt">
      <div className="container-main">
        <SectionHeader
          align="left"
          eyebrow={t("masters.eyebrow")}
          title={t("masters.title")}
          description={t("masters.desc")}
        />

        <div className="relative mt-10 sm:mt-12">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[6%] pb-4 [scrollbar-width:none] sm:gap-7 sm:px-[10%] [&::-webkit-scrollbar]:hidden"
            aria-roledescription="carousel"
            aria-label={t("masters.title")}
          >
            {masterClasses.map((mc, i) => {
              const active = i === index;
              return (
                <article
                  key={mc.title}
                  className={`flex w-[80%] max-w-md shrink-0 snap-center flex-col transition-all duration-500 sm:w-[56%] lg:w-[38%] ${
                    active ? "translate-y-0 opacity-100" : "translate-y-1 opacity-75"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  <div className="relative overflow-hidden rounded-[1.5rem] bg-cream shadow-[0_18px_40px_-24px_rgba(63,50,57,0.35)]">
                    <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
                      <Image
                        src={mc.image}
                        alt={t(`mc.${i}.title`)}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 56vw, 38vw"
                        priority={i < 2}
                      />
                      {"badge" in mc && mc.badge ? (
                        <span className="absolute bottom-3 right-3 rounded-full bg-brand-700 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
                          {t("masters.promo")}
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-3 px-5 pb-5 pt-4">
                      {"category" in mc && mc.category ? (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                          {t(`mc.${i}.category`)}
                        </p>
                      ) : null}

                      <h3 className="font-heading text-2xl font-semibold leading-snug text-warm-900">
                        {t(`mc.${i}.title`)}
                      </h3>

                      <p className="text-sm leading-relaxed text-warm-500">{t(`mc.${i}.desc`)}</p>

                      <div className="flex items-baseline gap-3 pt-1">
                        <PriceText className="font-heading text-2xl font-bold text-brand-700" as="p">
                          {mc.price}
                        </PriceText>
                        {"priceFull" in mc && mc.priceFull ? (
                          <PriceText
                            className="price-strike-diagonal font-heading text-base text-warm-500"
                            as="p"
                          >
                            {mc.priceFull}
                          </PriceText>
                        ) : null}
                      </div>

                      <a href="#signup" className="btn-primary mt-1 h-10 w-full">
                        {t("masters.signup")}
                      </a>

                      <a
                        href={site.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-xs font-medium text-brand-700 underline-offset-2 transition hover:text-brand-800 hover:underline"
                      >
                        {t("masters.instagram")}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-[42%] z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:left-1 sm:size-11"
            aria-label={t("aria.prevMc")}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-[42%] z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:right-1 sm:size-11"
            aria-label={t("aria.nextMc")}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label={t("aria.slides")}
          >
            {masterClasses.map((mc, i) => (
              <button
                key={mc.title}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${t("aria.slideN")} ${i + 1}: ${t(`mc.${i}.title`)}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-brand-600" : "w-2 bg-brand-200 hover:bg-brand-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-warm-500">
            <span className="font-medium text-warm-700">{index + 1}</span>
            {" / "}
            {count}
            <span className="mx-2 text-brand-200">·</span>
            {t(`mc.${index}.title`)}
          </p>
        </div>
      </div>
    </section>
  );
}
