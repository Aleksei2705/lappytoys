import Image from "next/image";
import { site } from "@/data/site";

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
        <span className={subtitleClassName}>{site.brandSubtitle}</span>
      </span>
    </>
  );
}
