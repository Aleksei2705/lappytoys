import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  Heart,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SignupForm } from "@/components/signup-form";
import {
  aboutParagraphs,
  benefits,
  courses,
  masterClasses,
  reviews,
  site,
  stats,
} from "@/data/site";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const benefitIcons = {
  heart: Heart,
  book: BookOpen,
  clock: Clock,
} as const;

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100/80 via-stone-50 to-stone-50" />
          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-amber-100/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-rose-100/50 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-start lg:py-20">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm text-rose-800">
                <Sparkles className="size-4" />
                Живые занятия вязанием тет-а-тет
              </div>
              <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Любимое ваше{" "}
                <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                  занятие
                </span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-stone-600">
                Приходите в студию на занятия по вязанию и откройте для себя новое увлечение —
                спокойно, пошагово и с поддержкой на каждом этапе.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#courses"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-rose-700 px-4 text-sm font-medium text-white hover:bg-rose-800"
                >
                  Выбрать курс
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#master-classes"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-stone-200 bg-white px-4 text-sm font-medium hover:bg-stone-50"
                >
                  Мастер-классы
                </Link>
              </div>
              <dl className="grid grid-cols-3 gap-4 border-t border-stone-200/60 pt-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-heading text-2xl font-bold text-rose-700 sm:text-3xl">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-xs text-stone-500 sm:text-sm">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-amber-50 to-stone-100 shadow-xl shadow-rose-100/50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="select-none text-[8rem] sm:text-[10rem]" aria-hidden="true">
                    🧶
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur-sm">
                  <p className="font-medium">Ольга Лаптева</p>
                  <p className="text-sm text-stone-500">Преподаватель вязания · Семей</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="page-section bg-stone-100/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-wider text-rose-600 lg:hidden">
              Обо мне
            </p>
            <div className="mt-2 grid items-start gap-8 lg:mt-0 lg:grid-cols-2 lg:gap-12">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/images/room.jpg"
                  alt="Уютная мастерская для занятий вязанием"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <p className="hidden text-sm font-medium uppercase tracking-wider text-rose-600 lg:block">
                    Обо мне
                  </p>
                  <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:mt-2">
                    Учу вязать{" "}
                    <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                      с душой
                    </span>
                  </h2>
                </div>
                <div className="space-y-4 leading-relaxed text-stone-600">
                  {aboutParagraphs.map((p) => (
                    <p key={p.slice(0, 30)}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="page-section">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-rose-600">
                Направления
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Уроки по вязанию
              </h2>
              <p className="mt-4 text-stone-600">
                Уже в этом году на мои уроки записалось много желающих. В следующем году планируем
                расширить горизонты направлений.
              </p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`flex flex-col overflow-hidden rounded-xl bg-gradient-to-br ${course.accent} shadow-md ring-1 ring-stone-900/10 transition-shadow hover:shadow-lg`}
                >
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <span className="w-fit rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium">
                      {course.badge}
                    </span>
                    <h3 className="font-heading text-xl font-medium">{course.title}</h3>
                    <p className="text-base leading-relaxed text-stone-600">{course.description}</p>
                  </div>
                  <div className="border-t border-stone-900/5 bg-white/50 p-4">
                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white/70 text-sm font-medium hover:bg-white"
                    >
                      Подробнее
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Master classes */}
        <section id="master-classes" className="page-section bg-stone-100/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-rose-600">
                Готовые проекты
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Мастер-классы
              </h2>
              <p className="mt-3 max-w-xl text-stone-600">
                Успейте приобрести готовые мастер-классы и не забудьте про скидку!
              </p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {masterClasses.map((mc) => (
                <div
                  key={mc.title}
                  className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-stone-900/10"
                >
                  <div
                    className={`flex aspect-[4/3] flex-col items-center justify-center bg-gradient-to-br ${mc.accent}`}
                  >
                    <span className="text-7xl" aria-hidden="true">
                      {mc.emoji}
                    </span>
                    <p className="mt-3 text-sm text-stone-500">Фото скоро</p>
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-medium leading-snug">{mc.title}</h3>
                      <span className="shrink-0 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-medium text-white">
                        {mc.badge}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">{mc.description}</p>
                    <p className="font-heading text-2xl font-bold text-rose-700">{mc.price}</p>
                    <a
                      href={site.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-rose-700 text-sm font-medium text-white hover:bg-rose-800"
                    >
                      Заказать
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="page-section">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-rose-600">Отзывы</p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Что говорят ученики
              </h2>
              <p className="mt-4 text-stone-600">
                Реальные истории людей, которые научились вязать вместе с Ольгой
              </p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="overflow-hidden rounded-xl border border-stone-200/60 bg-white p-6 shadow-sm"
                >
                  <div className="flex gap-0.5" aria-label="Оценка: 5 из 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                  <div className="mt-4 flex items-center justify-between border-t border-stone-200/60 pt-4">
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <p className="text-sm text-stone-500">{review.course}</p>
                    </div>
                    <span className="text-2xl" aria-hidden="true">
                      🧶
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="page-section">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {benefits.map((b) => {
                const Icon = benefitIcons[b.icon];
                return (
                  <div
                    key={b.title}
                    className="flex flex-col items-center rounded-2xl border border-stone-200/60 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                      <Icon className="size-7" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold">{b.title}</h3>
                    <p className="mt-2 text-stone-600">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contacts */}
        <section id="contacts" className="page-section bg-stone-100/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-rose-600">
                Связаться
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Контакты
              </h2>
              <p className="mt-4 text-stone-600">
                Позвоните или напишите — отвечу на вопросы и расскажу про текущие скидки.
              </p>
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
              <div className="space-y-4">
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-4 rounded-2xl border border-stone-200/60 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50/50"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Телефон</p>
                    <p className="font-medium">{site.phoneDisplay}</p>
                  </div>
                </a>
                <a
                  href={site.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-stone-200/60 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50/50"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Telegram</p>
                    <p className="font-medium">{site.telegramHandle}</p>
                  </div>
                </a>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-stone-200/60 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50/50"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">WhatsApp</p>
                    <p className="font-medium">{site.phoneDisplay}</p>
                  </div>
                </a>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-stone-200/60 bg-white p-4 transition-colors hover:border-rose-200 hover:bg-rose-50/50"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <InstagramIcon />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Instagram</p>
                    <p className="font-medium">{site.instagramHandle}</p>
                  </div>
                </a>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl shadow-lg lg:aspect-[4/3]">
                <Image
                  src="/images/signboard.jpg"
                  alt="Контакты творческой студии lappy.art"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Signup */}
        <section id="signup" className="page-section">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-xl">
              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-wider text-rose-600">Запись</p>
                <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  Записаться на урок
                </h2>
                <p className="mt-4 text-stone-600">
                  Оставьте заявку — в ближайшее время обязательно свяжусь с вами.
                </p>
              </div>
              <div className="mt-8 rounded-3xl border border-stone-200/60 bg-white p-6 shadow-lg sm:p-8">
                <SignupForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
