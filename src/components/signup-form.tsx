"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { site } from "@/data/site";

export function SignupForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = [
      "Здравствуйте! Хочу записаться на урок.",
      name && `Имя: ${name}`,
      phone && `Телефон: ${phone}`,
      message && `Сообщение: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `${site.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Ваше имя
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Как к вам обращаться?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full rounded-lg border border-stone-200 bg-transparent px-3 text-sm outline-none focus:border-rose-300 focus:ring-3 focus:ring-rose-100"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
          Телефон
        </label>
        <input
          id="phone"
          name="phone"
          required
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-10 w-full rounded-lg border border-stone-200 bg-transparent px-3 text-sm outline-none focus:border-rose-300 focus:ring-3 focus:ring-rose-100"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Расскажите, какой курс интересует"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-16 w-full rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-3 focus:ring-rose-100"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-rose-700 text-sm font-medium text-white transition-colors hover:bg-rose-800"
      >
        <Send className="size-4" />
        Отправить заявку
      </button>
      <p className="text-center text-xs text-stone-500">
        Заявка откроется в WhatsApp для отправки Ольге. Нажимая кнопку, вы соглашаетесь на
        обработку контактных данных.
      </p>
    </form>
  );
}
