"use client";

import { useEffect } from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/section-header";
import { useI18n } from "@/components/i18n-provider";
import { site } from "@/data/site";

const TIKTOK_EMBED_SRC = "https://www.tiktok.com/embed.js";
const username = site.tiktokHandle.replace(/^@/, "");

type TikTokWindow = Window & {
  tiktokEmbed?: { lib?: { render?: () => void } };
};

function loadTikTokEmbed() {
  const w = window as TikTokWindow;
  if (document.querySelector(`script[src="${TIKTOK_EMBED_SRC}"]`)) {
    w.tiktokEmbed?.lib?.render?.();
    return;
  }

  const script = document.createElement("script");
  script.src = TIKTOK_EMBED_SRC;
  script.async = true;
  document.body.appendChild(script);
}

export function TikTokFeed() {
  const { t } = useI18n();

  useEffect(() => {
    loadTikTokEmbed();
  }, []);

  return (
    <section id="tiktok" className="page-section">
      <div className="container-main">
        <SectionHeader
          eyebrow={t("tt.eyebrow")}
          title={t("tt.title")}
          description={t("tt.desc")}
        />

        <div className="mt-8 overflow-x-auto">
          <div className="mx-auto w-full min-w-[288px] max-w-[720px]">
            <blockquote
              className="tiktok-embed"
              cite={site.tiktok}
              data-unique-id={username}
              data-embed-type="creator"
              data-embed-from="oembed"
              style={{ maxWidth: 720, minWidth: 288 }}
            >
              <section>
                <a target="_blank" rel="noopener noreferrer" href={`${site.tiktok}?refer=creator_embed`}>
                  {site.tiktokHandle}
                </a>
              </section>
            </blockquote>
          </div>
        </div>

        <p className="mt-10 flex justify-center">
          <a
            href={site.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary h-11 px-6"
          >
            <Image src="/images/tiktok.svg" alt="" width={16} height={16} className="size-4" />
            {t("tt.open")}
          </a>
        </p>
      </div>
    </section>
  );
}
