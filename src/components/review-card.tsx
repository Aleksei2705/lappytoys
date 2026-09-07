"use client";

import { Share2, Star } from "lucide-react";
import { site } from "@/data/site";
import { UserAvatar } from "@/components/user-avatar";
import { useI18n } from "@/components/i18n-provider";

type ReviewCardProps = {
  name: string;
  text: string;
  course: string;
  rating?: number;
  createdAt?: string | null;
  avatarUrl?: string | null;
};

export function ReviewCard({
  name,
  text,
  course,
  rating = 5,
  createdAt,
  avatarUrl,
}: ReviewCardProps) {
  const { locale, t } = useI18n();
  const stars = Math.min(5, Math.max(1, Math.round(rating)));

  const when = (() => {
    if (!createdAt) return null;
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString(locale === "kk" ? "kk-KZ" : "ru-RU", {
      timeZone: "Asia/Almaty",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  })();

  async function handleShare() {
    const shareText = [
      `«${text}» — ${name}, ${course}.`,
      when ? `${t("review.shareDate")} ${when}.` : null,
      `${t("review.shareStudio")} ${site.brandTitle}: ${site.url}`,
    ]
      .filter(Boolean)
      .join(" ");
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${t("review.shareTitle")} ${site.brandTitle}`,
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
      window.alert(t("review.copied"));
    } catch {
      // ignore
    }
  }

  return (
    <article className="card-soft card-hover px-5 pb-5 pt-2.5">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex gap-0.5"
          aria-label={`${t("review.ratingLabel")} ${stars} ${t("review.starsOf")}`}
        >
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
          aria-label={t("review.shareAria")}
        >
          <Share2 className="size-3.5" />
          {t("cta.share")}
        </button>
      </div>
      <p className="mt-3 text-base leading-relaxed text-warm-700">&ldquo;{text}&rdquo;</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-cream-200/70 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={name} src={avatarUrl} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-warm-900">{name}</p>
            <p className="text-sm text-warm-500">{course}</p>
            {when ? (
              <time dateTime={createdAt ?? undefined} className="mt-1 block text-xs text-warm-500/90">
                {when}
              </time>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
