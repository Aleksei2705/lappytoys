import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
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
    title: `${course.title} — ${site.name}`,
    description: course.description,
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseById(slug);
  if (!course) notFound();

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/#courses"
          className="mb-8 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="size-4" />
          Все курсы
        </Link>

        <div className={`rounded-3xl bg-gradient-to-br ${course.accent} p-8 text-center`}>
          <span className="text-6xl" aria-hidden="true">
            {course.emoji}
          </span>
          <p className="mt-4 text-sm font-medium uppercase tracking-wider text-rose-600">
            {course.badge}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{course.title}</h1>
          <p className="mt-4 text-stone-600">{course.intro}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="rounded-full bg-white/80 px-3 py-1">{course.price}</span>
            <span className="rounded-full bg-white/80 px-3 py-1">{course.duration}</span>
            <span className="rounded-full bg-white/80 px-3 py-1">{course.level}</span>
          </div>
        </div>

        <div className="mt-10 space-y-4 leading-relaxed text-stone-600">
          {course.details.map((d) => (
            <p key={d.slice(0, 40)}>{d}</p>
          ))}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl font-semibold">Чему научитесь</h2>
            <ul className="mt-4 space-y-3">
              {course.learn.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-rose-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold">Кому подойдёт</h2>
            <ul className="mt-4 space-y-3">
              {course.forWhom.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-rose-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/#signup"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-rose-700 px-6 text-sm font-medium text-white hover:bg-rose-800"
          >
            Записаться на курс
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
