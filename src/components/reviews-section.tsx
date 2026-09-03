"use client";

import { useCallback, useEffect, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { ReviewCard } from "@/components/review-card";
import { ReviewForm } from "@/components/review-form";
import { reviews as staticReviews } from "@/data/site";
import { getSupabase, type StoredReview } from "@/lib/supabase";

export function ReviewsSection() {
  const [dynamicReviews, setDynamicReviews] = useState<StoredReview[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section id="reviews" className="page-section">
      <div className="container-main">
        <SectionHeader
          eyebrow="Отзывы"
          title="Что говорят ученики"
          description="Реальные истории людей, которые научились вязать вместе с Ольгой"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {dynamicReviews.map((review) => (
            <ReviewCard
              key={review.id}
              name={review.name}
              text={review.text}
              course={review.course}
              rating={review.rating ?? 5}
            />
          ))}
          {staticReviews.map((review) => (
            <ReviewCard key={`${review.name}-${review.course}`} {...review} />
          ))}
        </div>

        {loading ? (
          <p className="mt-8 text-center text-sm text-warm-500">Загрузка отзывов...</p>
        ) : null}

        <div className="mx-auto max-w-xl">
          <ReviewForm onSubmitted={loadReviews} />
        </div>
      </div>
    </section>
  );
}
