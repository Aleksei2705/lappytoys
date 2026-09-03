import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { PriceText } from "@/components/price-text";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { courses, getCourseById, site } from "@/data/site";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseById(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: `${course.description} Студия lappy.art, ${site.city}. ${course.price}, ${course.duration}, уровень: ${course.level}.`,
    alternates: {
      canonical: `/courses/${course.id}/`,
    },
    openGraph: {
      title: `${course.title} — ${site.name}`,
      description: course.description,
      url: `${site.url}/courses/${course.id}/`,
      type: "website",
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseById(slug);
  if (!course) notFound();

  return (
    <div>
      <SiteHeader />
      <main className="container-main max-w-3xl py-14">
        <Link
          href="/#courses"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-warm-500 transition-colors hover:text-brand-800"
        >
          <ArrowLeft className="size-4" />
          Все курсы
        </Link>

        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${course.accent} px-6 pb-7 pt-3 text-center shadow-lg ring-1 ring-warm-900/5 sm:px-9 sm:pb-9 sm:pt-4`}
        >
          <span className="text-6xl drop-shadow-sm" aria-hidden="true">
            {course.emoji}
          </span>
          <p className="eyebrow mt-4">
            <PriceText>{course.badge}</PriceText>
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-warm-900 sm:text-4xl">
            {course.title}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-warm-600">
            <PriceText>{course.intro}</PriceText>
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <span className="badge-soft">
              <PriceText>{course.price}</PriceText>
            </span>
            <span className="badge-soft">{course.duration}</span>
            <span className="badge-soft">{course.level}</span>
          </div>
        </div>

        <div className="mt-10 space-y-4 text-base leading-relaxed text-warm-600">
          {course.details.map((d) => (
            <p key={d.slice(0, 40)}>
              <PriceText>{d}</PriceText>
            </p>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="card-soft px-5 pb-5 pt-2.5">
            <h2 className="font-heading text-xl font-semibold">Чему научитесь</h2>
            <ul className="mt-4 space-y-3">
              {course.learn.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-warm-600">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-soft px-5 pb-5 pt-2.5">
            <h2 className="font-heading text-xl font-semibold">Кому подойдёт</h2>
            <ul className="mt-4 space-y-3">
              {course.forWhom.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-warm-600">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <BackButton />
          <Link href="/#signup" className="btn-primary h-12 px-8 text-base">
            Записаться на курс
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
