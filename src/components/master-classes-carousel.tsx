"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";
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
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[6%] pb-3 [scrollbar-width:none] sm:gap-6 sm:px-[10%] [&::-webkit-scrollbar]:hidden"
            aria-roledescription="carousel"
            aria-label={t("masters.title")}
          >
            {masterClasses.map((mc, i) => {
              const active = i === index;
              return (
                <article
                  key={mc.title}
                  className={`group relative aspect-[3/4] w-[82%] max-w-md shrink-0 snap-center overflow-hidden rounded-[1.75rem] transition-all duration-500 sm:w-[58%] lg:w-[40%] ${
                    active
                      ? "scale-[1.01] shadow-xl shadow-brand-200/40 ring-2 ring-brand-300/70"
                      : "scale-[0.97] opacity-80 ring-1 ring-warm-900/10"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  <Image
                    src={mc.image}
                    alt={t(`mc.${i}.title`)}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 58vw, 40vw"
                    priority={i < 2}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-warm-900/90 via-warm-900/25 to-warm-900/10" />

                  <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                    {"category" in mc && mc.category ? (
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-800 backdrop-blur-sm">
                        {t(`mc.${i}.category`)}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-brand-700/95 px-3 py-1 text-xs font-semibold text-white">
                      {t("masters.promo")}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-6">
                    <div>
                      <h3 className="font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                        {t(`mc.${i}.title`)}
                      </h3>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
                        {t(`mc.${i}.desc`)}
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-3 border-t border-white/20 pt-3">
                      <div className="flex items-baseline gap-2.5">
                        <PriceText className="font-heading text-2xl font-bold text-white" as="p">
                          {mc.price}
                        </PriceText>
                        <PriceText
                          className="price-strike-diagonal font-heading text-base text-white/55"
                          as="p"
                        >
                          {mc.priceFull}
                        </PriceText>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <a href="#signup" className="btn-primary h-10 flex-1 px-4">
                        {t("masters.signup")}
                      </a>
                      <a
                        href={site.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                      >
                        <Instagram className="size-4" />
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
            className="absolute left-0 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:left-1 sm:size-11"
            aria-label={t("aria.prevMc")}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:right-1 sm:size-11"
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
