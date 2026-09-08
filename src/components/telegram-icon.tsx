import Image from "next/image";

type TelegramIconProps = {
  className?: string;
  /** Kept so older call sites still compile; the official logo is always shown. */
  brand?: boolean;
};

export function TelegramIcon({ className = "size-5" }: TelegramIconProps) {
  return (
    <Image
      src="/images/telegram.svg"
      alt=""
      width={128}
      height={128}
      className={className}
      aria-hidden
    />
  );
}
