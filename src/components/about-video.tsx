"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { site } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

type AboutVideoProps = {
  className?: string;
};

export function AboutVideo({ className = "" }: AboutVideoProps) {
  const { t } = useI18n();

  if (site.aboutVideoSrc) {
    const isFile = site.aboutVideoSrc.endsWith(".mp4") || site.aboutVideoSrc.startsWith("/");
    if (isFile) {
      return (
        <div
          className={`relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl bg-warm-900/5 shadow-xl ring-1 ring-warm-900/5 sm:max-w-md ${className}`}
        >
          <video
            className="absolute inset-0 h-full w-full object-contain"
            controls
            playsInline
            preload="metadata"
          >
            <source src={site.aboutVideoSrc} type="video/mp4" />
          </video>
        </div>
      );
    }

    return (
      <div
        className={`relative aspect-video overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5 ${className}`}
      >
        <iframe
          title={t("about.videoTitle")}
          src={site.aboutVideoSrc}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <a
      href={site.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative mx-auto block aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5 sm:max-w-md ${className}`}
    >
      <Image
        src={site.aboutVideoPoster}
        alt={t("about.posterAlt")}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 28rem"
      />
      <div className="absolute inset-0 bg-warm-900/35" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lg">
          <Play className="size-6 fill-current" />
        </span>
        <p className="font-heading text-lg font-semibold">{t("about.videoSoon")}</p>
        <p className="text-sm text-white/90">
          {t("about.videoIg")} {site.instagramHandle}
        </p>
      </div>
    </a>
  );
}
