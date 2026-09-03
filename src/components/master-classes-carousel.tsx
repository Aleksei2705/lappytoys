"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { PriceText } from "@/components/price-text";
import { masterClasses } from "@/data/site";

export function MasterClassesCarousel() {
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

  const current = masterClasses[index];

  return (
    <section id="master-classes" className="page-section section-alt">
      <div className="container-main">
        <SectionHeader
          align="left"
          eyebrow="Готовые проекты"
          title="Мастер-классы"
          description="Листайте влево и вправо — и записывайтесь на понравившийся проект."
        />

        <div className="relative mt-10 sm:mt-12">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[8%] pb-2 [scrollbar-width:none] sm:gap-5 sm:px-[12%] [&::-webkit-scrollbar]:hidden"
            aria-roledescription="карусель"
            aria-label="Мастер-классы"
          >
            {masterClasses.map((mc, i) => (
              <article
                key={mc.title}
                className="flex w-[78%] max-w-md shrink-0 snap-center flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-brand-100/60 sm:w-[55%] lg:w-[42%]"
                aria-current={i === index ? "true" : undefined}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={mc.image}
                    alt={mc.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 55vw, 42vw"
                    priority={i < 2}
                  />
                  {"category" in mc && mc.category ? (
                    <span className="badge-soft absolute left-3 top-3 bg-white/95 px-4 py-1.5 !text-sm shadow-sm">
                      {mc.category}
                    </span>
                  ) : null}
                  <span className="badge-solid absolute right-3 top-3">{mc.badge}</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-2">
                  <h3 className="font-heading text-xl font-semibold leading-snug text-warm-900">
                    {mc.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-warm-500">{mc.description}</p>
                  <div className="flex items-baseline gap-3">
                    <PriceText className="font-heading text-2xl font-bold text-brand-700" as="p">
                      {mc.price}
                    </PriceText>
                    <PriceText className="price-strike-diagonal font-heading text-lg text-warm-500" as="p">
                      {mc.priceFull}
                    </PriceText>
                  </div>
                  <a href="#signup" className="btn-primary mt-auto h-10 w-full">
                    Записаться
                  </a>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-[38%] z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:left-1 sm:size-11"
            aria-label="Предыдущий мастер-класс"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-[38%] z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:right-1 sm:size-11"
            aria-label="Следующий мастер-класс"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Слайды">
            {masterClasses.map((mc, i) => (
              <button
                key={mc.title}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Слайд ${i + 1}: ${mc.title}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-brand-600" : "w-2 bg-brand-200 hover:bg-brand-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-warm-500">
            <span className="font-medium text-warm-700">{index + 1}</span>
            {" / "}
            {count}
            <span className="mx-2 text-brand-200">·</span>
            {current.title}
          </p>
        </div>
      </div>
    </section>
  );
}
