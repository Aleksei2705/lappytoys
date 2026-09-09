"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Play, X } from "lucide-react";
import { studioVideos } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

function videoEmbedSrc(src: string, autoplay = false) {
  try {
    const url = new URL(src);
    url.searchParams.set("rel", "0");
    url.searchParams.set("playsinline", "1");
    url.searchParams.set("modestbranding", "1");
    if (autoplay) url.searchParams.set("autoplay", "1");
    return url.toString();
  } catch {
    return src;
  }
}

function youtubeIdFromEmbed(src: string) {
  try {
    const parts = new URL(src).pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  } catch {
    return "";
  }
}

function videoThumb(src: string) {
  const id = youtubeIdFromEmbed(src);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

export function LessonsVideoCarousel() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollingRef = useRef(false);
  const titleId = useId();
  const count = studioVideos.length;

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
    (next: number) => {
      if (count === 0) return;
      const bounded = ((next % count) + count) % count;
      setIndex(bounded);
      if (!lightbox) scrollToSlide(bounded);
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

  const openLightbox = useCallback((i: number) => {
    setIndex(i);
    setLightbox(true);
  }, []);

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
  }, [expanded, lightbox]);

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

  useEffect(() => {
    if (lightbox) return;
    scrollToSlide(index);
  }, [lightbox]); // eslint-disable-line react-hooks/exhaustive-deps -- only sync on close

  if (count === 0) return null;

  const slideTitle = (i: number) => {
    const key = `lesson.${i}.title`;
    const translated = t(key);
    return translated === key ? studioVideos[i].title : translated;
  };

  return (
    <div className="mt-14 sm:mt-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-warm-900 sm:text-4xl">
          {t("works.lessonsTitle")}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-warm-500">{t("works.lessonsDesc")}</p>
      </div>

      {!expanded ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="btn-secondary h-11 px-6"
            aria-expanded={false}
          >
            <ChevronDown className="size-4" />
            {t("works.lessonsShow")}
          </button>
        </div>
      ) : (
        <>
      <div className="relative mt-8 sm:mt-10">
        <div
          ref={scrollerRef}
          className={`flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden ${
            count === 1 ? "justify-center px-4" : "px-[8%] sm:px-[12%]"
          }`}
          aria-roledescription="carousel"
          aria-label={t("works.lessonsAria")}
        >
          {studioVideos.map((video, i) => (
            <button
              key={video.src}
              type="button"
              onClick={() => openLightbox(i)}
              className="group relative aspect-[9/16] w-[78%] max-w-sm shrink-0 snap-center overflow-hidden rounded-3xl bg-warm-900 text-left outline-none ring-brand-300 transition focus-visible:ring-4 sm:w-[48%] lg:w-[36%]"
              aria-label={`${slideTitle(i)}. ${t("aria.expandVideo")}`}
              aria-current={i === index ? "true" : undefined}
            >
              <img
                src={videoThumb(video.src)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-warm-900/55 via-warm-900/10 to-transparent" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-white/95 text-warm-900 shadow-md transition group-hover:scale-105">
                  <Play className="size-7 fill-current" />
                </span>
              </span>
            </button>
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

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => {
            setLightbox(false);
            setExpanded(false);
          }}
          className="btn-secondary h-11 px-6"
          aria-expanded={true}
        >
          <ChevronUp className="size-4" />
          {t("cta.hide")}
        </button>
      </div>
        </>
      )}

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

              {count > 1 ? (
                <>
                  <button
                    type="button"
                    className="absolute left-2 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-warm-900 shadow-md transition hover:bg-white sm:left-6"
                    aria-label={t("aria.prevVideo")}
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
                    aria-label={t("aria.nextVideo")}
                    onClick={(e) => {
                      e.stopPropagation();
                      lightboxNext();
                    }}
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              ) : null}

              <div
                className="flex h-[100dvh] w-full items-center justify-center px-3 pb-16 pt-14 sm:px-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="relative overflow-hidden rounded-2xl bg-black shadow-2xl"
                  style={{
                    width: "min(calc(100vw - 1.5rem), calc((100dvh - 7.5rem) * 9 / 16))",
                    height: "min(calc(100dvh - 7.5rem), calc((100vw - 1.5rem) * 16 / 9))",
                  }}
                >
                  <iframe
                    key={studioVideos[index].src}
                    title={slideTitle(index)}
                    src={videoEmbedSrc(studioVideos[index].src, true)}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-3 px-4 text-center sm:bottom-5">
                <p id={titleId} className="font-heading text-lg font-semibold text-white sm:text-xl">
                  {slideTitle(index)}
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
