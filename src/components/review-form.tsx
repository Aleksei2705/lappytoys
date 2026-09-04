"use client";

import { FormEvent, useState } from "react";
import { Send, Star } from "lucide-react";
import { courses, site } from "@/data/site";
import { notifySiteAuthorAboutReview } from "@/lib/notify-review";
import { getSupabase, isReviewsEnabled } from "@/lib/supabase";

type ReviewFormProps = {
  onSubmitted?: () => void;
  /** When set, name is taken from the signed-in profile and cannot be edited. */
  lockedName?: string;
};

const courseOptions = [
  ...courses.map((course) => course.title),
  "Мастер-класс",
  "Другое",
];

export function ReviewForm({ onSubmitted, lockedName }: ReviewFormProps) {
  const [name, setName] = useState(lockedName ?? "");
  const [course, setCourse] = useState(courseOptions[0]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");

    const authorName = (lockedName ?? name).trim();
    if (!authorName) {
      setStatus("error");
      setError("Не удалось определить имя профиля. Войдите снова.");
      return;
    }

    const supabase = getSupabase();

    if (supabase) {
      const { error: insertError } = await supabase.from("reviews").insert({
        name: authorName,
        course: course.trim(),
        text: text.trim(),
        rating,
      });

      if (insertError) {
        setStatus("error");
        setError("Не удалось отправить отзыв. Попробуйте позже.");
        return;
      }

      // Fire email via hidden iframe first — must not be cancelled by UI refresh.
      notifySiteAuthorAboutReview({
        name: authorName,
        course: course.trim(),
        text: text.trim(),
        rating,
      });

      setStatus("success");
      // Delay list refresh slightly so the mail POST can leave the browser first.
      window.setTimeout(() => {
        onSubmitted?.();
      }, 400);
      return;
    }

    const message = [
      "Здравствуйте! Хочу оставить отзыв для сайта.",
      `Имя: ${authorName}`,
      `Курс: ${course.trim()}`,
      `Оценка: ${rating} из 5`,
      `Отзыв: ${text.trim()}`,
    ].join("\n");

    window.open(`${site.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setStatus("success");
  }

  const frozen = status === "loading" || status === "success";

  return (
    <div className="card-soft mt-10 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5">
      <h3 className="font-heading text-xl font-semibold text-warm-900">Оставить отзыв</h3>
      <p className="mt-2 text-sm leading-relaxed text-warm-500">
        {isReviewsEnabled()
          ? "Ваш отзыв сразу появится на сайте."
          : "Отзыв откроется в WhatsApp — Ольга опубликует его на сайте."}
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit}
        aria-disabled={frozen}
      >
        <fieldset disabled={frozen} className="min-w-0 space-y-5 border-0 p-0 disabled:opacity-70">
          <legend className="sr-only">Форма отзыва</legend>

          <div>
            <p className="mb-2 text-sm font-medium text-warm-700">Ваше имя</p>
            {lockedName ? (
              <div
                className="flex h-11 items-center rounded-xl border border-brand-100 bg-cream-100 px-4 text-sm text-warm-800"
                aria-live="polite"
              >
                {lockedName}
              </div>
            ) : (
              <>
                <label htmlFor="review-name" className="sr-only">
                  Ваше имя
                </label>
                <input
                  id="review-name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={60}
                  placeholder="Как вас подписать?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </>
            )}
          </div>

          <div>
            <label htmlFor="review-course" className="mb-2 block text-sm font-medium text-warm-700">
              Курс или занятие
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
            <p className="mb-2 text-sm font-medium text-warm-700">Оценка</p>
            <div className="flex items-center gap-1" role="group" aria-label="Оценка от 1 до 5">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const active = value <= rating;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="rounded-lg p-1 transition-transform hover:scale-110 disabled:hover:scale-100"
                    aria-label={`${value} из 5`}
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
              Отзыв
            </label>
            <textarea
              id="review-text"
              name="text"
              required
              minLength={20}
              maxLength={600}
              rows={4}
              placeholder="Расскажите, как прошли занятия"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="textarea-field"
            />
          </div>

          <button type="submit" className="btn-primary h-11 w-full">
            <Send className="size-4" />
            {status === "loading"
              ? "Отправка..."
              : status === "success"
                ? "Отзыв отправлен"
                : "Отправить отзыв"}
          </button>
        </fieldset>

        {status === "success" ? (
          <p className="text-center text-sm text-brand-700">
            Спасибо! Отзыв отправлен. Чтобы оставить ещё один — обновите страницу.
          </p>
        ) : null}

        {status === "error" ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : null}
      </form>
    </div>
  );
}
