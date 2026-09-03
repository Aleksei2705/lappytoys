import { Star } from "lucide-react";

type ReviewCardProps = {
  name: string;
  text: string;
  course: string;
  rating?: number;
};

export function ReviewCard({ name, text, course, rating = 5 }: ReviewCardProps) {
  const stars = Math.min(5, Math.max(1, Math.round(rating)));

  return (
    <article className="card-soft card-hover p-6">
      <div className="flex gap-0.5" aria-label={`Оценка: ${stars} из 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-4 ${
              i < stars ? "fill-accent-400 text-accent-400" : "text-cream-200"
            }`}
          />
        ))}
      </div>
      <p className="mt-4 text-base leading-relaxed text-warm-700">&ldquo;{text}&rdquo;</p>
      <div className="mt-5 flex items-center justify-between border-t border-cream-200/70 pt-4">
        <div>
          <p className="font-semibold text-warm-900">{name}</p>
          <p className="text-sm text-warm-500">{course}</p>
        </div>
        <span className="text-2xl" aria-hidden="true">
          🧶
        </span>
      </div>
    </article>
  );
}
