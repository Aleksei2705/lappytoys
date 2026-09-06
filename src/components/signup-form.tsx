"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { courses, masterClasses, site } from "@/data/site";
import { trackGoal } from "@/lib/metrika";

export function SignupForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [direction, setDirection] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");

  const directionOptions = useMemo(() => {
    const courseTitles = courses.map((c) => c.title);
    const mcTitles = masterClasses.map((m) => `Мастер-класс: ${m.title}`);
    return [...courseTitles, ...mcTitles, "Пока не определился(ась)"];
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = [
      "Здравствуйте! Хочу записаться на урок/мастер-класс.",
      name && `Имя: ${name}`,
      phone && `Телефон: ${phone}`,
      direction && `Направление: ${direction}`,
      preferredDate && `Желаемая дата: ${preferredDate}`,
      message && `Сообщение: ${message}`,
      "",
      "Заявка с сайта lappytoys.kz",
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
          Ваше имя
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Как к вам обращаться?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-warm-700">
          Телефон
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
          Направление
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
            Выберите курс или мастер-класс
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
          Желаемая дата
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
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Удобное время, возраст ученика, вопросы"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea-field"
        />
      </div>
      <button type="submit" className="btn-primary h-11 w-full">
        <Send className="size-4" />
        Отправить заявку
      </button>
      <p className="text-center text-xs leading-relaxed text-warm-500">
        Заявка откроется в WhatsApp для отправки Ольге. Нажимая кнопку, вы соглашаетесь с{" "}
        <Link href="/privacy/" className="underline decoration-brand-300 underline-offset-2 hover:text-brand-800">
          политикой обработки данных
        </Link>
        .
      </p>
    </form>
  );
}
