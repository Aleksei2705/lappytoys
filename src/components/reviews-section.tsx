"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { ReviewCard } from "@/components/review-card";
import { ReviewAuthGate } from "@/components/review-auth-gate";
import { reviews as staticReviews } from "@/data/site";
import { getSupabase, type StoredReview } from "@/lib/supabase";

const INITIAL_VISIBLE = 4;

type DisplayReview = {
  id: string;
  name: string;
  text: string;
  course: string;
  rating: number;
};

export function ReviewsSection() {
  const [dynamicReviews, setDynamicReviews] = useState<StoredReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const loadReviews = useCallback(async () => {
    const supabase = getSupabase();

    if (!supabase) {
      setDynamicReviews([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("id,name,text,course,rating,created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDynamicReviews(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const allReviews = useMemo<DisplayReview[]>(() => {
    const fromDb = dynamicReviews.map((review) => ({
      id: review.id,
      name: review.name,
      text: review.text,
      course: review.course,
      rating: review.rating ?? 5,
    }));

    const fromStatic = staticReviews.map((review) => ({
      id: `static-${review.name}-${review.course}`,
      name: review.name,
      text: review.text,
      course: review.course,
      rating: 5,
    }));

    return [...fromDb, ...fromStatic];
  }, [dynamicReviews]);

  const visibleReviews = expanded ? allReviews : allReviews.slice(0, INITIAL_VISIBLE);
  const hiddenCount = Math.max(0, allReviews.length - INITIAL_VISIBLE);

  return (
    <section id="reviews" className="page-section">
      <div className="container-main">
        <SectionHeader
          eyebrow="Отзывы"
          title="Что говорят ученики"
          description="Реальные истории людей, которые научились вязать вместе с Ольгой"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              name={review.name}
              text={review.text}
              course={review.course}
              rating={review.rating}
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
                  Скрыть
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  Показать ещё ({hiddenCount})
                </>
              )}
            </button>
          </div>
        ) : null}

        {loading ? (
          <p className="mt-8 text-center text-sm text-warm-500">Загрузка отзывов...</p>
        ) : null}

        <div className="mx-auto max-w-xl">
          <ReviewAuthGate onSubmitted={loadReviews} />
        </div>
      </div>
    </section>
  );
}
