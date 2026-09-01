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
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-warm-700">
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Расскажите, какой курс интересует"
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
        Заявка откроется в WhatsApp для отправки Ольге. Нажимая кнопку, вы соглашаетесь на
        обработку контактных данных.
      </p>
    </form>
  );
}
