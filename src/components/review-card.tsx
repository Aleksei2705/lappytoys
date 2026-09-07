"use client";

import { FormEvent, useState } from "react";
import { Share2, Star } from "lucide-react";
import { site } from "@/data/site";
import { getSupabase } from "@/lib/supabase";
import { UserAvatar } from "@/components/user-avatar";
import { useI18n } from "@/components/i18n-provider";

type ReviewCardProps = {
  id: string;
  name: string;
  text: string;
  course: string;
  rating?: number;
  createdAt?: string | null;
  avatarUrl?: string | null;
  replyText?: string | null;
  replyAt?: string | null;
  canReply?: boolean;
  onReplySaved?: (replyText: string, replyAt: string) => void;
};

function formatWhen(iso: string | null | undefined, locale: string) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(locale === "kk" ? "kk-KZ" : "ru-RU", {
    timeZone: "Asia/Almaty",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReviewCard({
  id,
  name,
  text,
  course,
  rating = 5,
  createdAt,
  avatarUrl,
  replyText,
  replyAt,
  canReply = false,
  onReplySaved,
}: ReviewCardProps) {
  const { locale, t } = useI18n();
  const stars = Math.min(5, Math.max(1, Math.round(rating)));
  const when = formatWhen(createdAt, locale);
  const replyWhen = formatWhen(replyAt, locale);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(replyText ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const isDbReview = !id.startsWith("static-");
  const showReplyBox = Boolean(replyText?.trim());
  const canEditReply = canReply && isDbReview;

  async function handleShare() {
    const shareText = [
      `«${text}» — ${name}, ${course}.`,
      when ? `${t("review.shareDate")} ${when}.` : null,
      replyText?.trim() ? `${t("review.replyFrom")}: ${replyText.trim()}` : null,
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

  async function handleReplySubmit(e: FormEvent) {
    e.preventDefault();
    const next = draft.trim();
    if (next.length < 2) return;

    setStatus("loading");
    setError("");

    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setError(t("review.replyErr"));
      return;
    }

    const replyAtIso = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("reviews")
      .update({ reply_text: next, reply_at: replyAtIso })
      .eq("id", id);

    if (updateError) {
      setStatus("error");
      setError(t("review.replyErr"));
      return;
    }

    setStatus("idle");
    setEditing(false);
    onReplySaved?.(next, replyAtIso);
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

      {showReplyBox && !editing ? (
        <div className="mt-4 rounded-2xl border border-brand-100/80 bg-brand-50/50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            {t("review.replyFrom")}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-warm-700">{replyText}</p>
          {replyWhen ? (
            <time dateTime={replyAt ?? undefined} className="mt-2 block text-xs text-warm-500/90">
              {replyWhen}
            </time>
          ) : null}
        </div>
      ) : null}

      {canEditReply ? (
        editing ? (
          <form className="mt-4 space-y-3" onSubmit={handleReplySubmit}>
            <label htmlFor={`reply-${id}`} className="sr-only">
              {t("review.reply")}
            </label>
            <textarea
              id={`reply-${id}`}
              required
              minLength={2}
              maxLength={600}
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("review.replyPh")}
              className="textarea-field"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-ghost h-9 px-3 text-xs"
                onClick={() => setDraft(t("review.replyThanks"))}
              >
                {t("review.replyTemplate")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn-primary h-9 px-4 text-sm" disabled={status === "loading"}>
                {status === "loading" ? t("review.replySaving") : t("review.replySend")}
              </button>
              <button
                type="button"
                className="btn-secondary h-9 px-4 text-sm"
                onClick={() => {
                  setEditing(false);
                  setDraft(replyText ?? "");
                  setStatus("idle");
                  setError("");
                }}
              >
                {t("review.replyCancel")}
              </button>
            </div>
            {status === "error" ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>
        ) : (
          <button
            type="button"
            className="btn-ghost mt-3 h-9 px-3 text-sm"
            onClick={() => {
              setDraft(replyText ?? t("review.replyThanks"));
              setEditing(true);
            }}
          >
            {showReplyBox ? t("review.replyEdit") : t("review.reply")}
          </button>
        )
      ) : null}
    </article>
  );
}
