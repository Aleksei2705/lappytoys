"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { courses, masterClasses, site } from "@/data/site";
import { trackGoal } from "@/lib/metrika";
import { useI18n } from "@/components/i18n-provider";

export function SignupForm() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [direction, setDirection] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");

  const directionOptions = useMemo(() => {
    const courseTitles = courses.map((c) => t(`course.${c.id}.title`));
    const mcTitles = masterClasses.map((_, i) => `${t("signup.mcPrefix")} ${t(`mc.${i}.title`)}`);
    return [...courseTitles, ...mcTitles, t("signup.undecided")];
  }, [t]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = [
      t("signup.waHello"),
      name && `${t("signup.waName")} ${name}`,
      phone && `${t("signup.waPhone")} ${phone}`,
      direction && `${t("signup.waDirection")} ${direction}`,
      preferredDate && `${t("signup.waDate")} ${preferredDate}`,
      message && `${t("signup.waMessage")} ${message}`,
      "",
      t("signup.waFooter"),
    ]
      .filter(Boolean)
      .join("\n");

    trackGoal("signup_whatsapp");
    const url = `${site.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-warm-700">
          {t("signup.name")}
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder={t("signup.namePh")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-warm-700">
          {t("signup.phone")}
        </label>
        <input
          id="phone"
          name="phone"
          required
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="direction" className="mb-2 block text-sm font-medium text-warm-700">
          {t("signup.direction")}
        </label>
        <select
          id="direction"
          name="direction"
          required
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="input-field"
        >
          <option value="" disabled>
            {t("signup.directionPh")}
          </option>
          {directionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="preferred-date" className="mb-2 block text-sm font-medium text-warm-700">
          {t("signup.date")}
        </label>
        <input
          id="preferred-date"
          name="preferredDate"
          type="date"
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-warm-700">
          {t("signup.message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder={t("signup.messagePh")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea-field"
        />
      </div>
      <button type="submit" className="btn-primary h-11 w-full">
        <Send className="size-4" />
        {t("cta.submit")}
      </button>
      <p className="text-center text-xs leading-relaxed text-warm-500">
        {t("signup.legal")}{" "}
        <Link href="/privacy/" className="underline decoration-brand-300 underline-offset-2 hover:text-brand-800">
          {t("signup.privacy")}
        </Link>
        .
      </p>
    </form>
  );
}
