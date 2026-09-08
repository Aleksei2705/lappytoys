"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { studentWorks } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";
import { LessonsVideoCarousel } from "@/components/lessons-video-carousel";

export function WorksGallery() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollingRef = useRef(false);
  const titleId = useId();
  const count = studentWorks.length;

  useEffect(() => {
    setMounted(true);
  }, []);

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
    (next: number, options?: { scroll?: boolean }) => {
      const bounded = ((next % count) + count) % count;
      setIndex(bounded);
      if (options?.scroll !== false && !lightbox) {
        scrollToSlide(bounded);
      }
    },
    [count, lightbox, scrollToSlide],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  const lightboxPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const lightboxNext = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    function onScroll() {
      if (scrollingRef.current || lightbox) return;
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
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightbox(false);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        lightboxNext();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        lightboxPrev();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightbox, lightboxNext, lightboxPrev]);

  // Keep carousel aligned when closing lightbox
  useEffect(() => {
    if (lightbox) return;
    scrollToSlide(index);
  }, [lightbox]); // eslint-disable-line react-hooks/exhaustive-deps -- only sync on close

  if (count === 0) return null;

  return (
    <section id="works" className="page-section">
      <div className="container-main">
        <SectionHeader
          eyebrow={t("works.eyebrow")}
          title={
            t("works.title.accent") ? (
              <>
                {t("works.title.before")}{" "}
                <span className="text-gradient">{t("works.title.accent")}</span>
              </>
            ) : (
              t("works.title.before")
            )
          }
          description={t("works.desc")}
        />

        <div className="relative mt-10 sm:mt-12">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[8%] pb-2 [scrollbar-width:none] sm:gap-5 sm:px-[12%] [&::-webkit-scrollbar]:hidden"
            aria-roledescription="carousel"
            aria-label={t("works.aria")}
          >
            {studentWorks.map((work, i) => (
              <button
                key={work.src + work.title}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setLightbox(true);
                }}
                className="group relative aspect-[3/4] w-[78%] max-w-md shrink-0 snap-center overflow-hidden rounded-3xl text-left outline-none ring-brand-300 transition duration-300 focus-visible:ring-4 sm:w-[55%] lg:w-[42%]"
                aria-label={`${t(`work.${i}.title`)}, ${t(`work.${i}.category`)}`}
                aria-current={i === index ? "true" : undefined}
              >
                <Image
                  src={work.src}
                  alt={work.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 55vw, 42vw"
                  priority={i < 2}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-warm-900/60 via-warm-900/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="block text-xs font-medium uppercase tracking-[0.18em] text-white/75">
                    {t(`work.${i}.category`)}
                  </span>
                  <span className="mt-1 block font-heading text-xl font-semibold text-white sm:text-2xl">
                    {t(`work.${i}.title`)}
                  </span>
                </span>
              </button>
            ))}
          </div>

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
        </div>

        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label={t("aria.slides")}>
            {studentWorks.map((work, i) => (
              <button
                key={work.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${t("aria.slideN")} ${i + 1}: ${t(`work.${i}.title`)}`}
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
            {t(`work.${index}.title`)}
          </p>
        </div>

        <LessonsVideoCarousel />
      </div>

      {mounted && lightbox
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] bg-warm-900/92"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={() => setLightbox(false)}
            >
              <button
                ref={closeBtnRef}
                type="button"
                className="absolute right-3 top-3 z-20 inline-flex size-11 items-center justify-center rounded-full bg-white/95 text-warm-900 shadow-md transition hover:bg-white sm:right-6 sm:top-6"
                aria-label={t("aria.close")}
                onClick={() => setLightbox(false)}
              >
                <X className="size-5" />
              </button>

              <button
                type="button"
                className="absolute left-2 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-warm-900 shadow-md transition hover:bg-white sm:left-6"
                aria-label={t("aria.prevPhoto")}
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxPrev();
                }}
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                className="absolute right-2 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-warm-900 shadow-md transition hover:bg-white sm:right-6"
                aria-label={t("aria.nextPhoto")}
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
              >
                <ChevronRight className="size-5" />
              </button>

              <div
                className="flex h-[100dvh] w-full items-center justify-center px-12 pb-16 pt-14 sm:px-16"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={studentWorks[index].src}
                  alt={studentWorks[index].alt}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-3 px-4 text-center sm:bottom-5">
                <p id={titleId} className="font-heading text-lg font-semibold text-white sm:text-xl">
                  {t(`work.${index}.title`)}
                </p>
                <p className="mt-0.5 text-sm text-white/75">{t(`work.${index}.category`)}</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
