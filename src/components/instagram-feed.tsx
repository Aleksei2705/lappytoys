"use client";

import { useEffect, useState } from "react";
import { Instagram, Play } from "lucide-react";
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

export function InstagramFeed() {
  const { t } = useI18n();
  const baked = normalizeInstagramFeed(bakedFeed);
  const [posts, setPosts] = useState<InstagramPost[]>(baked);

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

  return (
    <section id="instagram" className="page-section section-alt">
      <div className="container-main">
        <SectionHeader
          eyebrow={t("ig.eyebrow")}
          title={t("ig.title")}
          description={t("ig.desc")}
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {items.map((post, i) => (
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

        <p className="mt-6 text-center">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex h-11 px-6"
          >
            <Instagram className="size-4" />
            {t("ig.open")}
          </a>
        </p>
      </div>
    </section>
  );
}
