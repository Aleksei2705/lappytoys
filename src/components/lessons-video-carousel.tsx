"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { studioVideos } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

export function LessonsVideoCarousel() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef(false);
  const count = studioVideos.length;

  const scrollToSlide = useCallback((next: number) => {
    const scroller = scrollerRef.current;
    const slide = scroller?.children[next] as HTMLElement | undefined;
    if (!scroller || !slide) return;
    scrollingRef.current = true;
    const left = slide.offsetLeft - (scroller.clientWidth - slide.offsetWidth) / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
    window.setTimeout(() => {
      scrollingRef.current = false;
    }, 450);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      const bounded = ((next % count) + count) % count;
      setIndex(bounded);
      scrollToSlide(bounded);
    },
    [count, scrollToSlide],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    function onScroll() {
      if (scrollingRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
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
      });
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (count === 0) return null;

  const slideTitle = (i: number) => {
    const key = `lesson.${i}.title`;
    const translated = t(key);
    return translated === key ? studioVideos[i].title : translated;
  };

  return (
    <div className="mt-14 sm:mt-16">
      <h3 className="text-center font-heading text-2xl font-bold tracking-tight text-warm-900 sm:text-3xl">
        {t("works.lessonsTitle")}
      </h3>

      <div className="relative mt-8 sm:mt-10">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[8%] pb-2 [scrollbar-width:none] sm:gap-5 sm:px-[12%] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
          aria-label={t("works.lessonsAria")}
        >
          {studioVideos.map((video, i) => (
            <div
              key={video.src}
              className="relative aspect-[9/16] w-[78%] max-w-sm shrink-0 snap-center overflow-hidden rounded-3xl bg-warm-900 sm:w-[48%] lg:w-[36%]"
              aria-current={i === index ? "true" : undefined}
            >
              <iframe
                title={slideTitle(i)}
                src={video.src}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-0 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:left-1 sm:size-11"
              aria-label={t("aria.prevSlide")}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-0 top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white/95 text-warm-900 shadow-md transition hover:bg-brand-50 sm:right-1 sm:size-11"
              aria-label={t("aria.nextSlide")}
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label={t("aria.slides")}>
            {studioVideos.map((video, i) => (
              <button
                key={video.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${t("aria.slideN")} ${i + 1}: ${slideTitle(i)}`}
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
            {slideTitle(index)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
