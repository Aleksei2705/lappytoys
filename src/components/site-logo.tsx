"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

type SiteLogoProps = {
  imageClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function SiteLogo({
  imageClassName = "size-10 shrink-0 object-contain sm:size-12",
  titleClassName = "font-heading text-base font-semibold tracking-tight text-brand-800 sm:text-xl",
  subtitleClassName = "text-[11px] text-warm-500 sm:text-sm",
}: SiteLogoProps) {
  const { t } = useI18n();

  return (
    <>
      <Image
        src="/images/logo.png"
        alt=""
        width={48}
        height={48}
        className={imageClassName}
        priority
      />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={titleClassName}>{site.brandTitle}</span>
        <span className={subtitleClassName}>{t("brand.subtitle")}</span>
      </span>
    </>
  );
}
