"use client";

import { TelegramIcon } from "@/components/telegram-icon";
import { useI18n } from "@/components/i18n-provider";
import { site } from "@/data/site";

type TelegramChatButtonProps = {
  className?: string;
};

export function TelegramChatButton({ className = "btn-secondary h-11 px-6" }: TelegramChatButtonProps) {
  const { t } = useI18n();

  return (
    <a
      href={site.telegramGroup}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <TelegramIcon className="size-5" />
      {t("cta.chat")}
    </a>
  );
}
