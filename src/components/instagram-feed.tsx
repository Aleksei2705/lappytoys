"use client";

import { useEffect } from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/section-header";
import { useI18n } from "@/components/i18n-provider";
import { site } from "@/data/site";

const INSTAGRAM_EMBED_SRC = "https://www.instagram.com/embed.js";
const profileUrl = site.instagram.replace(/\/$/, "");
const embedPermalink = `${profileUrl}/?utm_source=ig_embed&utm_campaign=loading`;

type InstagramWindow = Window & {
  instgrm?: { Embeds?: { process?: () => void } };
};

function processInstagramEmbed() {
  (window as InstagramWindow).instgrm?.Embeds?.process?.();
}

function loadInstagramEmbed() {
  if (document.querySelector(`script[src="${INSTAGRAM_EMBED_SRC}"]`)) {
    processInstagramEmbed();
    return;
  }

  const script = document.createElement("script");
  script.src = INSTAGRAM_EMBED_SRC;
  script.async = true;
  script.onload = processInstagramEmbed;
  document.body.appendChild(script);
}

export function InstagramFeed() {
  const { t } = useI18n();

  useEffect(() => {
    loadInstagramEmbed();
    const later = window.setTimeout(processInstagramEmbed, 600);
    return () => window.clearTimeout(later);
  }, []);

  return (
    <section id="instagram" className="page-section section-alt">
      <div className="container-main">
        <SectionHeader
          eyebrow={t("ig.eyebrow")}
          title={t("ig.title")}
          description={t("ig.desc")}
        />

        <div className="mt-8 overflow-x-auto">
          <div className="mx-auto w-full min-w-[326px] max-w-[540px]">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={embedPermalink}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: 3,
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: "1px auto",
                maxWidth: 540,
                minWidth: 326,
                padding: 0,
                width: "calc(100% - 2px)",
              }}
            >
              <div style={{ padding: 16 }}>
                <a
                  href={embedPermalink}
                  style={{
                    background: "#FFFFFF",
                    lineHeight: 0,
                    padding: 0,
                    textAlign: "center",
                    textDecoration: "none",
                    width: "100%",
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <div
                      style={{
                        backgroundColor: "#F4F4F4",
                        borderRadius: "50%",
                        flexGrow: 0,
                        height: 40,
                        marginRight: 14,
                        width: 40,
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
                      <div
                        style={{
                          backgroundColor: "#F4F4F4",
                          borderRadius: 4,
                          flexGrow: 0,
                          height: 14,
                          marginBottom: 6,
                          width: 100,
                        }}
                      />
                      <div
                        style={{
                          backgroundColor: "#F4F4F4",
                          borderRadius: 4,
                          flexGrow: 0,
                          height: 14,
                          width: 60,
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ padding: "19% 0" }} />
                  <div style={{ paddingTop: 8 }}>
                    <div
                      style={{
                        color: "#3897f0",
                        fontFamily: "Arial,sans-serif",
                        fontSize: 14,
                        fontStyle: "normal",
                        fontWeight: 550,
                        lineHeight: "18px",
                      }}
                    >
                      View this profile on Instagram
                    </div>
                  </div>
                </a>
                <p
                  style={{
                    color: "#c9c8cd",
                    fontFamily: "Arial,sans-serif",
                    fontSize: 14,
                    lineHeight: "17px",
                    marginBottom: 0,
                    marginTop: 8,
                    overflow: "hidden",
                    padding: "8px 0 7px",
                    textAlign: "center",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <a
                    href={embedPermalink}
                    style={{
                      color: "#c9c8cd",
                      fontFamily: "Arial,sans-serif",
                      fontSize: 14,
                      fontStyle: "normal",
                      fontWeight: "normal",
                      lineHeight: "17px",
                      textDecoration: "none",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {site.brandTitle} ({site.instagramHandle})
                  </a>
                </p>
              </div>
            </blockquote>
          </div>
        </div>

        <p className="mt-10 flex justify-center">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary h-11 px-6"
          >
            <Image src="/images/instagram.png" alt="" width={16} height={16} className="size-4" />
            {t("ig.open")}
          </a>
        </p>
      </div>
    </section>
  );
}
