"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Instagram, Play } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { useI18n } from "@/components/i18n-provider";
import { site } from "@/data/site";
import bakedFeed from "@/data/instagram-feed.json";
import { normalizeInstagramFeed, type InstagramPost } from "@/lib/instagram-feed";

const FALLBACK_POSTS: InstagramPost[] = [
  { id: "sova", imageUrl: "/images/macrame-sova.jpg", permalink: site.instagram, caption: "", isVideo: false },
  { id: "turtle", imageUrl: "/images/macrame-turtle.jpg", permalink: site.instagram, caption: "", isVideo: false },
  { id: "chick", imageUrl: "/images/crochet-chick.jpg", permalink: site.instagram, caption: "", isVideo: false },
  { id: "room", imageUrl: "/images/room.jpg", permalink: site.instagram, caption: "", isVideo: false },
  { id: "dragon", imageUrl: "/images/works/dragon.jpg", permalink: site.instagram, caption: "", isVideo: false },
  { id: "berries", imageUrl: "/images/works/blueberry-strawberry.jpg", permalink: site.instagram, caption: "", isVideo: false },
];

const feedUrl = process.env.NEXT_PUBLIC_INSTAGRAM_FEED_URL || site.instagramFeedUrl;
const INITIAL_VISIBLE = 2;

export function InstagramFeed() {
  const { t } = useI18n();
  const baked = normalizeInstagramFeed(bakedFeed);
  const [posts, setPosts] = useState<InstagramPost[]>(baked);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!feedUrl) return;
    let cancelled = false;

    fetch(feedUrl)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        const next = normalizeInstagramFeed(data);
        if (!cancelled && next.length > 0) setPosts(next);
      })
      .catch(() => {
        /* keep baked or fallback */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const items = posts.length > 0 ? posts : FALLBACK_POSTS;
  const visibleItems = expanded ? items : items.slice(0, INITIAL_VISIBLE);
  const hiddenCount = Math.max(0, items.length - INITIAL_VISIBLE);

  return (
    <section id="instagram" className="page-section section-alt">
      <div className="container-main">
        <SectionHeader
          eyebrow={t("ig.eyebrow")}
          title={t("ig.title")}
          description={t("ig.desc")}
        />

        <div
          className={`mt-8 grid gap-3 sm:gap-4 ${
            expanded ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
          }`}
        >
          {visibleItems.map((post, i) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-brand-50 ring-1 ring-brand-100/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-100/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
              aria-label={post.caption.trim() || `${t("ig.post")} ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-warm-900/45 via-transparent to-transparent opacity-80" />
              {post.isVideo ? (
                <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-800 shadow-md">
                  <Play className="size-5 fill-current" />
                  <span className="sr-only">{t("ig.video")}</span>
                </span>
              ) : null}
              <span className="absolute bottom-2.5 right-2.5 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-brand-800 shadow-sm">
                <Instagram className="size-4" />
              </span>
            </a>
          ))}
        </div>

        {hiddenCount > 0 ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="btn-secondary h-11 px-6"
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  <ChevronUp className="size-4" />
                  {t("cta.hide")}
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  {t("cta.showMore")} ({hiddenCount})
                </>
              )}
            </button>
          </div>
        ) : null}

        <p className="mt-10 flex justify-center">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary h-11 px-6"
          >
            <Instagram className="size-4" />
            {t("ig.open")}
          </a>
        </p>
      </div>
    </section>
  );
}
