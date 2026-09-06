"use client";

import { Share2, Star } from "lucide-react";
import { site } from "@/data/site";

type ReviewCardProps = {
  name: string;
  text: string;
  course: string;
  rating?: number;
};

export function ReviewCard({ name, text, course, rating = 5 }: ReviewCardProps) {
  const stars = Math.min(5, Math.max(1, Math.round(rating)));

  async function handleShare() {
    const shareText = `«${text}» — ${name}, ${course}. Студия ${site.brandTitle}: ${site.url}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Отзыв о ${site.brandTitle}`,
          text: shareText,
          url: `${site.url}/#reviews`,
        });
        return;
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }

    try {
      await navigator.clipboard.writeText(shareText);
      window.alert("Текст отзыва скопирован");
    } catch {
      // ignore
    }
  }

  return (
    <article className="card-soft card-hover px-5 pb-5 pt-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-0.5" aria-label={`Оценка: ${stars} из 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-4 ${
                i < stars ? "fill-accent-400 text-accent-400" : "text-cream-200"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-warm-500 transition-colors hover:bg-brand-50 hover:text-brand-800"
          aria-label="Поделиться отзывом"
        >
          <Share2 className="size-3.5" />
          Поделиться
        </button>
      </div>
      <p className="mt-3 text-base leading-relaxed text-warm-700">&ldquo;{text}&rdquo;</p>
      <div className="mt-5 flex items-center justify-between border-t border-cream-200/70 pt-4">
        <div>
          <p className="font-semibold text-warm-900">{name}</p>
          <p className="text-sm text-warm-500">{course}</p>
        </div>
        <span className="text-2xl" aria-hidden="true">
          🧶
        </span>
      </div>
    </article>
  );
}
