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
        setError(
          insertError.message
            ? `Не удалось отправить отзыв: ${insertError.message}`
            : "Не удалось отправить отзыв. Попробуйте позже.",
        );
        return;
      }

      // Wait for mail request so a list refresh does not cancel it.
      await notifySiteAuthorAboutReview({
        name: authorName,
        course: course.trim(),
        text: text.trim(),
        rating,
      });

      if (!lockedName) setName("");
      setText("");
      setCourse(courseOptions[0]);
      setRating(5);
      setStatus("success");
      onSubmitted?.();
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
    if (!lockedName) setName("");
    setText("");
    setCourse(courseOptions[0]);
    setRating(5);
    setStatus("success");
  }

  return (
    <div className="card-soft mt-10 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5">
      <h3 className="font-heading text-xl font-semibold text-warm-900">Оставить отзыв</h3>
      <p className="mt-2 text-sm leading-relaxed text-warm-500">
        {isReviewsEnabled()
          ? "Ваш отзыв сразу появится на сайте."
          : "Отзыв откроется в WhatsApp — Ольга опубликует его на сайте."}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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
                  className="rounded-lg p-1 transition-transform hover:scale-110"
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

        <button type="submit" className="btn-primary h-11 w-full" disabled={status === "loading"}>
          <Send className="size-4" />
          {status === "loading" ? "Отправка..." : "Отправить отзыв"}
        </button>

        {status === "success" ? (
          <p className="text-center text-sm text-brand-700">Спасибо! Отзыв отправлен.</p>
        ) : null}

        {status === "error" ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : null}
      </form>
    </div>
  );
}
