"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Send, Star } from "lucide-react";
import { courses, site } from "@/data/site";
import { notifySiteAuthorAboutReview } from "@/lib/notify-review";
import { getSupabase, isReviewsEnabled } from "@/lib/supabase";
import { UserAvatar } from "@/components/user-avatar";
import { useI18n } from "@/components/i18n-provider";

type ReviewFormProps = {
  onSubmitted?: () => void;
  /** When set, name is taken from the signed-in profile and cannot be edited. */
  lockedName?: string;
  avatarUrl?: string | null;
};

export function ReviewForm({ onSubmitted, lockedName, avatarUrl }: ReviewFormProps) {
  const { t } = useI18n();
  const courseOptions = useMemo(
    () => [
      ...courses.map((course) => t(`course.${course.id}.title`)),
      t("review.option.mc"),
      t("review.option.other"),
    ],
    [t],
  );
  const [name, setName] = useState(lockedName ?? "");
  const [course, setCourse] = useState(courseOptions[0]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    setCourse((prev) => (courseOptions.includes(prev) ? prev : courseOptions[0]));
  }, [courseOptions]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");

    const authorName = (lockedName ?? name).trim();
    if (!authorName) {
      setStatus("error");
      setError(t("review.errNoName"));
      return;
    }

    const supabase = getSupabase();

    if (supabase) {
      const { error: insertError } = await supabase.from("reviews").insert({
        name: authorName,
        course: course.trim(),
        text: text.trim(),
        rating,
        avatar_url: avatarUrl?.trim() || null,
        approved: false,
      });

      if (!insertError) {
        await notifySiteAuthorAboutReview({
          name: authorName,
          course: course.trim(),
          text: text.trim(),
          rating,
          createdAt: new Date().toISOString(),
        });

        setStatus("success");
        window.setTimeout(() => {
          onSubmitted?.();
        }, 400);
        return;
      }
    }

    const message = [
      t("review.waHello"),
      `${t("review.waName")} ${authorName}`,
      `${t("review.waCourse")} ${course.trim()}`,
      `${t("review.waRating")} ${rating} ${t("review.starsOf")}`,
      `${t("review.waText")} ${text.trim()}`,
    ].join("\n");

    window.open(`${site.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setStatus("success");
  }

  const frozen = status === "loading" || status === "success";

  return (
    <div className="card-soft mt-10 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5">
      <h3 className="font-heading text-xl font-semibold text-warm-900">{t("review.formTitle")}</h3>
      <p className="mt-2 text-sm leading-relaxed text-warm-500">
        {isReviewsEnabled() ? t("review.moderationHint") : t("review.whatsappHint")}
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit}
        aria-disabled={frozen}
      >
        <fieldset disabled={frozen} className="min-w-0 space-y-5 border-0 p-0 disabled:opacity-70">
          <legend className="sr-only">{t("review.formLegend")}</legend>

          <div>
            <p className="mb-2 text-sm font-medium text-warm-700">{t("review.yourName")}</p>
            {lockedName ? (
              <div
                className="flex h-11 items-center gap-3 rounded-xl border border-brand-100 bg-cream-100 px-3 text-sm text-warm-800"
                aria-live="polite"
              >
                <UserAvatar name={lockedName} src={avatarUrl} size="sm" />
                <span className="truncate">{lockedName}</span>
              </div>
            ) : (
              <>
                <label htmlFor="review-name" className="sr-only">
                  {t("review.yourName")}
                </label>
                <input
                  id="review-name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={60}
                  placeholder={t("review.namePh")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </>
            )}
          </div>

          <div>
            <label htmlFor="review-course" className="mb-2 block text-sm font-medium text-warm-700">
              {t("review.course")}
            </label>
            <select
              id="review-course"
              name="course"
              required
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="input-field"
            >
              {courseOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-warm-700">{t("review.rating")}</p>
            <div className="flex items-center gap-1" role="group" aria-label={t("review.ratingAria")}>
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const active = value <= rating;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="rounded-lg p-1 transition-transform hover:scale-110 disabled:hover:scale-100"
                    aria-label={`${value} ${t("review.starsOf")}`}
                    aria-pressed={rating === value}
                  >
                    <Star
                      className={`size-8 ${
                        active ? "fill-accent-400 text-accent-400" : "text-cream-200"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="review-text" className="mb-2 block text-sm font-medium text-warm-700">
              {t("review.text")}
            </label>
            <textarea
              id="review-text"
              name="text"
              required
              minLength={5}
              maxLength={600}
              rows={4}
              placeholder={t("review.textPh")}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="textarea-field"
            />
          </div>

          <button type="submit" className="btn-primary h-11 w-full">
            <Send className="size-4" />
            {status === "loading"
              ? t("review.sending")
              : status === "success"
                ? t("review.sent")
                : t("review.send")}
          </button>
        </fieldset>

        {status === "success" ? (
          <p className="text-center text-sm text-brand-700">{t("review.thanks")}</p>
        ) : null}

        {status === "error" ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : null}
      </form>
    </div>
  );
}
