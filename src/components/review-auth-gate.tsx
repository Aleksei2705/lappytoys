"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { getSupabase, isReviewsEnabled, type User as AuthUser } from "@/lib/supabase";
import { ReviewForm } from "@/components/review-form";

type ReviewAuthGateProps = {
  onSubmitted?: () => void;
};

export function ReviewAuthGate({ onSubmitted }: ReviewAuthGateProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!ready) {
    return (
      <div className="card-soft mt-10 px-5 py-6 text-center text-sm text-warm-500 shadow-lg sm:px-7">
        Загрузка...
      </div>
    );
  }

  if (!isReviewsEnabled()) {
    return <ReviewForm onSubmitted={onSubmitted} />;
  }

  if (user) {
    return (
      <div className="mt-10">
        <ReviewForm onSubmitted={onSubmitted} />
      </div>
    );
  }

  return (
    <div className="card-soft mt-10 px-5 py-6 text-center shadow-lg sm:px-7">
      <div className="mx-auto inline-flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <User className="size-5" />
      </div>
      <h3 className="mt-3 font-heading text-xl font-semibold text-warm-900">Оставить отзыв</h3>
      <p className="mt-2 text-sm leading-relaxed text-warm-500">
        Войдите в профиль в шапке сайта — через Google или по email — затем здесь появится форма
        отзыва.
      </p>
      <button
        type="button"
        className="btn-secondary mt-5 h-10 px-4 text-sm"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.dispatchEvent(new CustomEvent("open-header-auth"));
        }}
      >
        Открыть вход
      </button>
    </div>
  );
}
