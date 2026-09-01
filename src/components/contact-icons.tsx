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
