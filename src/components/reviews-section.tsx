"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { ReviewCard } from "@/components/review-card";
import { ReviewAuthGate } from "@/components/review-auth-gate";
import { reviews as staticReviews } from "@/data/site";
import {
  getSupabase,
  isReviewAdmin,
  type StoredReview,
  type User,
} from "@/lib/supabase";
import { useI18n } from "@/components/i18n-provider";

const INITIAL_VISIBLE = 4;

type DisplayReview = {
  id: string;
  name: string;
  text: string;
  course: string;
  rating: number;
  createdAt?: string | null;
  avatarUrl?: string | null;
  replyText?: string | null;
  replyAt?: string | null;
};

export function ReviewsSection() {
  const { t } = useI18n();
  const [dynamicReviews, setDynamicReviews] = useState<StoredReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  const loadReviews = useCallback(async () => {
    const supabase = getSupabase();

    if (!supabase) {
      setDynamicReviews([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("id,name,text,course,rating,created_at,approved,avatar_url,reply_text,reply_at")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDynamicReviews(data);
    } else if (error) {
      const legacy = await supabase
        .from("reviews")
        .select("id,name,text,course,rating,created_at,avatar_url")
        .order("created_at", { ascending: false });
      if (!legacy.error && legacy.data) {
        setDynamicReviews(legacy.data);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setAdminUser(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const canReply = isReviewAdmin(adminUser);

  const allReviews = useMemo<DisplayReview[]>(() => {
    const fromDb = dynamicReviews.map((review) => ({
      id: review.id,
      name: review.name,
      text: review.text,
      course: review.course,
      rating: review.rating ?? 5,
      createdAt: review.created_at,
      avatarUrl: review.avatar_url ?? null,
      replyText: review.reply_text ?? null,
      replyAt: review.reply_at ?? null,
    }));

    const fromStatic = staticReviews.map((review, i) => ({
      id: `static-${review.name}-${review.course}`,
      name: review.name,
      text: t(`staticReview.${i}.text`),
      course: t(`staticReview.${i}.course`),
      rating: 5,
      createdAt: null,
      avatarUrl: null,
      replyText: t(`staticReview.${i}.reply`),
      replyAt: null,
    }));

    return [...fromDb, ...fromStatic];
  }, [dynamicReviews, t]);

  const visibleReviews = expanded ? allReviews : allReviews.slice(0, INITIAL_VISIBLE);
  const hiddenCount = Math.max(0, allReviews.length - INITIAL_VISIBLE);

  function handleReplySaved(reviewId: string, replyText: string, replyAt: string) {
    setDynamicReviews((list) =>
      list.map((item) =>
        item.id === reviewId ? { ...item, reply_text: replyText, reply_at: replyAt } : item,
      ),
    );
  }

  return (
    <section id="reviews" className="page-section">
      <div className="container-main">
        <SectionHeader
          eyebrow={t("reviews.eyebrow")}
          title={t("reviews.title")}
          description={t("reviews.desc")}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              name={review.name}
              text={review.text}
              course={review.course}
              rating={review.rating}
              createdAt={review.createdAt}
              avatarUrl={review.avatarUrl}
              replyText={review.replyText}
              replyAt={review.replyAt}
              canReply={canReply}
              onReplySaved={(replyText, replyAt) => handleReplySaved(review.id, replyText, replyAt)}
            />
          ))}
        </div>

        {hiddenCount > 0 ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="btn-secondary h-11 px-6"
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

        {loading ? (
          <p className="mt-8 text-center text-sm text-warm-500">{t("reviews.loading")}</p>
        ) : null}

        <div className="mx-auto max-w-xl">
          <ReviewAuthGate onSubmitted={loadReviews} />
        </div>
      </div>
    </section>
  );
}
