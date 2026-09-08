"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { courses, masterClasses, site } from "@/data/site";
import { trackGoal } from "@/lib/metrika";
import { useI18n } from "@/components/i18n-provider";
import { TelegramIcon } from "@/components/telegram-icon";

function interpretPhone(raw: string) {
  const trimmed = raw.trim();
  const startsPlus = trimmed.startsWith("+") || trimmed.startsWith("00");
  let digits = raw.replace(/\D/g, "");
  if (trimmed.startsWith("00") && digits.startsWith("00")) digits = digits.slice(2);

  if (!digits) {
    return { digits: "", mode: startsPlus ? "intl" : "cis" } as const;
  }

  const foreign = startsPlus && !digits.startsWith("7");
  if (foreign) {
    return { digits: digits.slice(0, 15), mode: "intl" } as const;
  }

  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith("7")) digits = `7${digits}`;
  return { digits: digits.slice(0, 11), mode: "cis" } as const;
}

function formatPhone(digits: string, mode: "cis" | "intl") {
  if (!digits) return mode === "intl" ? "+" : "";

  if (mode === "intl") {
    const chunks = [digits.slice(0, Math.min(3, digits.length))];
    for (let i = chunks[0].length; i < digits.length; i += 3) {
      chunks.push(digits.slice(i, i + 3));
    }
    return `+${chunks.join(" ")}`;
  }

  const rest = digits.startsWith("7") ? digits.slice(1) : digits;
  let out = "+7";
  if (!rest) return out;
  out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += ")";
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

function isValidPhone(digits: string) {
  if (/^7\d{10}$/.test(digits)) return true;
  if (digits.startsWith("7")) return false;
  return digits.length >= 10 && digits.length <= 15;
}

/** Longer prefixes first. +7 is split KZ/RU by the next digit. */
const CALLING_PREFIXES: [string, string][] = [
  ["996", "KG"],
  ["998", "UZ"],
  ["993", "TM"],
  ["992", "TJ"],
  ["994", "AZ"],
  ["995", "GE"],
  ["380", "UA"],
  ["375", "BY"],
  ["374", "AM"],
  ["373", "MD"],
  ["971", "AE"],
  ["90", "TR"],
  ["86", "CN"],
  ["82", "KR"],
  ["81", "JP"],
  ["66", "TH"],
  ["49", "DE"],
  ["48", "PL"],
  ["44", "GB"],
  ["39", "IT"],
  ["34", "ES"],
  ["33", "FR"],
  ["31", "NL"],
  ["20", "EG"],
  ["91", "IN"],
  ["1", "US_CA"],
];

function countryKey(digits: string) {
  if (digits.startsWith("7")) {
    const next = digits[1];
    if (next === "0" || next === "6" || next === "7") return "KZ";
    if (next === "3" || next === "4" || next === "8" || next === "9") return "RU";
    return "KZ_RU";
  }

  const match = CALLING_PREFIXES.find(([code]) => digits.startsWith(code));
  return match?.[1] ?? "other";
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type SignupFormProps = {
  direction: string;
  onDirectionChange: (value: string) => void;
};

export function SignupForm({ direction, onDirectionChange }: SignupFormProps) {
  const { t } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const directionOptions = useMemo(() => {
    const courseTitles = courses.map((c) => t(`course.${c.id}.title`));
    const mcTitles = masterClasses.map((_, i) => `${t("signup.mcPrefix")} ${t(`mc.${i}.title`)}`);
    return [...courseTitles, ...mcTitles, t("signup.undecided")];
  }, [t]);

  function buildMessage(digits: string) {
    const country = t(`signup.country.${countryKey(digits)}`);
    const phoneLine = phone ? `${t("signup.waPhone")} ${phone} (${country})` : "";

    return [
      t("signup.waHello"),
      name && `${t("signup.waName")} ${name}`,
      phoneLine,
      direction && `${t("signup.waDirection")} ${direction}`,
      preferredDate && `${t("signup.waDate")} ${preferredDate}`,
      message && `${t("signup.waMessage")} ${message}`,
      "",
      t("signup.waFooter"),
    ]
      .filter(Boolean)
      .join("\n");
  }

  function send(channel: "whatsapp" | "telegram") {
    if (!formRef.current?.reportValidity()) return;

    const { digits } = interpretPhone(phone);
    if (!isValidPhone(digits)) {
      setPhoneError(t("signup.phoneErr"));
      return;
    }

    const text = buildMessage(digits);
    const encoded = encodeURIComponent(text);

    if (channel === "telegram") {
      trackGoal("signup_telegram");
      window.open(`${site.telegram}?text=${encoded}`, "_blank", "noopener,noreferrer");
    } else {
      trackGoal("signup_whatsapp");
      window.open(`${site.whatsapp}?text=${encoded}`, "_blank", "noopener,noreferrer");
    }

    setName("");
    setPhone("");
    onDirectionChange("");
    setPreferredDate("");
    setMessage("");
    setPhoneError("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send("whatsapp");
  }

  return (
    <form id="signup-form" ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-warm-700">
          {t("signup.name")}
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
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
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="+7 (___) ___-__-__"
          value={phone}
          aria-invalid={phoneError ? true : undefined}
          aria-describedby={phoneError ? "phone-error" : undefined}
          onChange={(e) => {
            const parsed = interpretPhone(e.target.value);
            setPhone(formatPhone(parsed.digits, parsed.mode));
            if (phoneError) setPhoneError("");
          }}
          className="input-field"
        />
        {phoneError ? (
          <p id="phone-error" className="mt-2 text-sm text-red-600">
            {phoneError}
          </p>
        ) : null}
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
          onChange={(e) => onDirectionChange(e.target.value)}
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
      <div className="flex flex-col gap-3">
        <button type="submit" className="btn-primary h-11 w-full">
          <WhatsAppIcon />
          {t("signup.viaWhatsapp")}
        </button>
        <button type="button" className="btn-secondary h-11 w-full" onClick={() => send("telegram")}>
          <TelegramIcon className="size-4" />
          {t("signup.viaTelegram")}
        </button>
      </div>
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
