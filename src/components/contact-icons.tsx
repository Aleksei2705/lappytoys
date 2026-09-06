import Image from "next/image";
import { TelegramIcon } from "@/components/telegram-icon";

const iconClass = "size-10 shrink-0";

export function ContactIconFrame({ children }: { children: React.ReactNode }) {
  return <div className="flex size-12 shrink-0 items-center justify-center">{children}</div>;
}

export function PhoneContactIcon() {
  return (
    <Image
      src="/images/phone.png"
      alt=""
      width={48}
      height={48}
      className={iconClass}
      aria-hidden
    />
  );
}

export function TelegramContactIcon() {
  return <TelegramIcon brand className={iconClass} />;
}

export function WhatsAppContactIcon() {
  return (
    <svg viewBox="0 0 48 48" className={iconClass} aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#25D366" />
      <path
        fill="#fff"
        d="M34.5 13.5c-2.7-2.7-6.3-4.2-10.1-4.2-7.9 0-14.3 6.4-14.3 14.3 0 2.5.7 4.9 2 7l-2.1 7.7 7.9-2.1c2 .9 4.2 1.4 6.5 1.4h.006c7.9 0 14.3-6.4 14.3-14.3 0-3.8-1.5-7.4-4.2-10.1zm-10.1 22c-2.2 0-4.3-.6-6.1-1.7l-.4-.3-4.4 1.2 1.2-4.3-.3-.4c-1.2-1.8-1.8-3.9-1.8-6.1 0-6.4 5.2-11.6 11.6-11.6 3.1 0 6 1.2 8.2 3.4s3.4 5.1 3.4 8.2c0 6.4-5.2 11.6-11.6 11.6zm6.4-8.7c-.3-.2-2-1-2.3-1.1-.3-.1-.6-.2-.8.2s-.9 1.1-1.1 1.3-.4.3-.8.1c-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.6-1.8-1.8-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.1-.3 0-.5 0-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.9.6.8.3 1.5.2 2.1.1.6-.1 2-1 2.3-1.9.3-.9.3-1.7.2-1.9-.1-.2-.3-.3-.6-.5z"
      />
    </svg>
  );
}

export function InstagramContactIcon() {
  return (
    <Image
      src="/images/instagram.png"
      alt=""
      width={48}
      height={48}
      className={iconClass}
      aria-hidden
    />
  );
}

const mapIconClass = "size-4 shrink-0 sm:size-[1.125rem]";

/** 2ГИС — зелёный знак. */
export function Map2GisIcon({ className = mapIconClass }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#00B53E" />
      <path
        fill="#fff"
        d="M7.2 6.5h3c1.7 0 2.8.9 2.8 2.3 0 1-.5 1.8-1.4 2.2L14.2 17h-2.1l-2.4-5H9.1V17H7.2V6.5zm1.9 4.4h.7c.8 0 1.3-.4 1.3-1.1S10.6 8.6 9.8 8.6h-.7v2.3z"
      />
    </svg>
  );
}

/** Google Maps — фирменный пин. */
export function MapGoogleIcon({ className = mapIconClass }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
      <path fill="#FBBC04" d="M12 2v20s-4.2-4.9-5.9-9.2C4.8 9.7 5 5.8 7.4 3.5A7 7 0 0 1 12 2z" opacity=".9" />
      <path fill="#34A853" d="M12 22s3.5-3.9 5.4-8.1c1.2-2.6 1.1-5.5-.3-7.8L12 12v10z" opacity=".85" />
      <circle cx="12" cy="9" r="3.1" fill="#fff" />
      <circle cx="12" cy="9" r="2" fill="#4285F4" />
    </svg>
  );
}

/** Яндекс.Карты — красный пин с «Я». */
export function MapYandexIcon({ className = mapIconClass }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#FC3F1D"
        d="M12 1.8C7.5 1.8 3.8 5.5 3.8 10c0 5.9 8.2 12.2 8.2 12.2S20.2 15.9 20.2 10C20.2 5.5 16.5 1.8 12 1.8z"
      />
      <path
        fill="#fff"
        d="M9.8 6.3h2.2c1.8 0 2.9.95 2.9 2.4 0 1.15-.65 2-1.6 2.3l1.9 3.3h-1.7l-1.7-3h-.9v3h-1.7V6.3zm1.7 3.7h.85c.85 0 1.35-.45 1.35-1.15S13.2 7.7 12.35 7.7H11.5v2.3z"
      />
    </svg>
  );
}
