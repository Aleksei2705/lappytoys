"use client";

import { useState } from "react";
import { courses } from "@/data/site";
import { trackGoal } from "@/lib/metrika";
import { useI18n } from "@/components/i18n-provider";
import { SignupForm } from "@/components/signup-form";

const QUIZ_IDS = ["crochet", "needles", "macrame", "trial"] as const;

const QUIZ_OPTIONS = QUIZ_IDS.map((id) => {
  const course = courses.find((item) => item.id === id);
  return { id, emoji: course?.emoji ?? "" };
});

type SignupQuizProps = {
  direction: string;
  onPick: (title: string) => void;
};

function SignupQuiz({ direction, onPick }: SignupQuizProps) {
  const { t } = useI18n();

  return (
    <div className="mt-10">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-heading text-xl font-semibold text-warm-900 sm:text-2xl">{t("quiz.title")}</p>
        <p className="mt-2 text-sm leading-relaxed text-warm-500">{t("quiz.desc")}</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" role="group" aria-label={t("quiz.title")}>
        {QUIZ_OPTIONS.map(({ id, emoji }) => {
          const title = t(`course.${id}.title`);
          const selected = direction === title;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                onPick(title);
                trackGoal("signup_quiz", { direction: id });
                document.getElementById("signup-form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-4 text-center transition duration-200 ${
                selected
                  ? "border-brand-400 bg-brand-50 shadow-sm ring-2 ring-brand-200"
                  : "border-brand-100 bg-white/90 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/70 hover:shadow-md"
              }`}
            >
              <span className="text-2xl" aria-hidden>
                {emoji}
              </span>
              <span className="font-heading text-sm font-semibold text-warm-900">{t(`quiz.${id}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SignupQuizAndForm() {
  const [direction, setDirection] = useState("");

  return (
    <>
      <SignupQuiz direction={direction} onPick={setDirection} />
      <div className="card-soft mt-8 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5">
        <SignupForm direction={direction} onDirectionChange={setDirection} />
      </div>
    </>
  );
}
