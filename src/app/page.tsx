import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Clock,
  Heart,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SignupForm } from "@/components/signup-form";
import {
  ContactIconFrame,
  InstagramContactIcon,
  PhoneContactIcon,
  TelegramContactIcon,
  WhatsAppContactIcon,
} from "@/components/contact-icons";
import {
  aboutParagraphs,
  benefits,
  courses,
  masterClasses,
  reviews,
  site,
  stats,
} from "@/data/site";

const benefitIcons = {
  heart: Heart,
  book: BookOpen,
  clock: Clock,
} as const;

const statIcons = {
  users: Users,
} as const;

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-100/20" />
          <div className="glow-brand -right-24 -top-24 size-96" />
          <div className="glow-accent -bottom-32 -left-24 size-80" />
          <div className="container-main relative mx-auto max-w-3xl pt-10 pb-16 text-center sm:pt-12 lg:pt-14 lg:pb-20">
            <div className="space-y-8">
              <div className="text-left">
                <div className="badge-soft inline-flex gap-2 px-4 py-2">
                  <Sparkles className="size-4" />
                  Создаём руками вместе
                </div>
              </div>
              <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-warm-900 sm:text-5xl lg:text-6xl">
                Любимое ваше <span className="text-gradient">занятие</span>
              </h1>
              <p className="mx-auto max-w-lg text-lg leading-relaxed text-warm-500">
                Приходите в студию на занятия по вязанию, макраме, вышивке и откройте для себя новое увлечение —
                спокойно, пошагово и с поддержкой на каждом этапе.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="#courses" className="btn-primary h-11 px-6">
                  Выбрать курс
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="#master-classes" className="btn-secondary h-11 px-6">
                  Мастер-классы
                </Link>
              </div>
              <dl className="grid grid-cols-3 gap-4 border-t border-cream-200/70 pt-8 text-center">
                {stats.map((stat) => {
                  const StatIcon =
                    "icon" in stat && stat.icon ? statIcons[stat.icon] : null;

                  return (
                  <div key={stat.label}>
                    {StatIcon ? (
                      <dt className="flex justify-center">
                        <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                          <StatIcon className="size-6" strokeWidth={1.75} aria-hidden />
                        </span>
                      </dt>
                    ) : "value" in stat && stat.value ? (
                      <dt className="font-heading text-2xl font-bold text-brand-700 sm:text-3xl">
                        {stat.value}
                      </dt>
                    ) : null}
                    <dd
                      className={
                        StatIcon || ("value" in stat && stat.value)
                          ? "mt-1 text-xs leading-snug text-warm-500 sm:text-sm"
                          : "font-heading text-xl font-bold text-brand-700 sm:text-2xl"
                      }
                    >
                      {stat.label}
                    </dd>
                  </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="page-section section-alt">
          <div className="container-main">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-brand-100/60" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5">
                  <Image
                    src="/images/room.jpg"
                    alt="Ольга Лаптева — преподаватель вязания"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="mt-5 text-center lg:text-left">
                  <p className="font-heading text-lg font-semibold text-warm-900">Ольга Лаптева</p>
                  <p className="text-sm text-warm-500">Преподаватель вязания · Семей</p>
                </div>
              </div>
              <div className="space-y-6">
                <SectionHeader
                  align="left"
                  eyebrow="Обо мне"
                  title={
                    <>
                      Передаю знания <span className="text-gradient">детям</span>
                    </>
                  }
                />
                <div className="space-y-4 text-base leading-relaxed text-warm-500">
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
          <div className="container-main">
            <SectionHeader
              eyebrow="Направления"
              title="Творческие направления"
              description="Вязание, макраме, вышивка, бисероплетение и шитьё игрушек — выберите направление и начните с нуля в уютной студии."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <article
                  key={course.id}
                  className={`card-hover flex flex-col bg-gradient-to-br ${course.accent}`}
                >
                  <div className="relative flex flex-1 flex-col gap-3 p-6">
                    <span className="absolute right-5 top-5 text-3xl" aria-hidden="true">
                      {course.emoji}
                    </span>
                    <span className="badge-soft">{course.badge}</span>
                    <h3 className="pr-10 font-heading text-xl font-semibold text-warm-900">
                      {course.title}
                    </h3>
                    <p className="text-base leading-relaxed text-warm-500">{course.description}</p>
                  </div>
                  <div className="border-t border-warm-900/5 bg-white/60 p-4">
                    <Link href={`/courses/${course.id}`} className="btn-ghost h-10 w-full">
                      Подробнее
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Master classes */}
        <section id="master-classes" className="page-section section-alt">
          <div className="container-main">
            <SectionHeader
              align="left"
              eyebrow="Готовые проекты"
              title="Мастер-классы"
              description="Записывайтесь скорее!"
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {masterClasses.map((mc) => (
                <article key={mc.title} className="card-hover">
                  <div
                    className={`flex aspect-[4/3] flex-col items-center bg-gradient-to-br px-4 py-4 ${mc.accent}`}
                  >
                    {"category" in mc && mc.category ? (
                      <span className="badge-soft px-5 py-2 !text-base sm:!text-lg">
                        {mc.category}
                      </span>
                    ) : null}
                    <div className="flex flex-1 flex-col items-center justify-center gap-3">
                      <div className="relative size-32 sm:size-36">
                        <Image
                          src={mc.image}
                          alt={mc.title}
                          fill
                          className="object-contain"
                          sizes="144px"
                        />
                      </div>
                      <p className="text-sm font-medium text-warm-500">Фото скоро</p>
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-lg font-semibold leading-snug">{mc.title}</h3>
                      <span className="badge-solid shrink-0">{mc.badge}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-warm-500">{mc.description}</p>
                    <p className="font-heading text-2xl font-bold text-brand-700">{mc.price}</p>
                    <a href="#signup" className="btn-primary h-10 w-full">
                      Записаться
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="page-section">
          <div className="container-main">
            <SectionHeader
              eyebrow="Отзывы"
              title="Что говорят ученики"
              description="Реальные истории людей, которые научились вязать вместе с Ольгой"
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {reviews.map((review) => (
                <article key={review.name} className="card-soft card-hover p-6">
                  <div className="flex gap-0.5" aria-label="Оценка: 5 из 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-accent-400 text-accent-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-warm-700">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-cream-200/70 pt-4">
                    <div>
                      <p className="font-semibold text-warm-900">{review.name}</p>
                      <p className="text-sm text-warm-500">{review.course}</p>
                    </div>
                    <span className="text-2xl" aria-hidden="true">
                      🧶
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="page-section section-alt">
          <div className="container-main">
            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map((b) => {
                const Icon = benefitIcons[b.icon];
                return (
                  <div
                    key={b.title}
                    className="card-soft flex flex-col items-center p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-100/30"
                  >
                    <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-600 shadow-inner">
                      <Icon className="size-7" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-warm-500">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contacts */}
        <section id="contacts" className="page-section">
          <div className="container-main">
            <SectionHeader
              eyebrow="Связаться"
              title="Контакты"
              description="Позвоните или напишите — отвечу на вопросы и расскажу про текущие скидки."
            />
            <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
              <div className="space-y-3">
                <a href={`tel:${site.phone}`} className="contact-card">
                  <ContactIconFrame>
                    <PhoneContactIcon />
                  </ContactIconFrame>
                  <div>
                    <p className="text-sm text-warm-500">Телефон</p>
                    <p className="font-semibold text-warm-900">{site.phoneDisplay}</p>
                  </div>
                </a>
                <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="contact-card">
                  <ContactIconFrame>
                    <TelegramContactIcon />
                  </ContactIconFrame>
                  <div>
                    <p className="text-sm text-warm-500">Telegram</p>
                    <p className="font-semibold text-warm-900">{site.telegramHandle}</p>
                  </div>
                </a>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-card">
                  <ContactIconFrame>
                    <WhatsAppContactIcon />
                  </ContactIconFrame>
                  <div>
                    <p className="text-sm text-warm-500">WhatsApp</p>
                    <p className="font-semibold text-warm-900">{site.phoneDisplay}</p>
                  </div>
                </a>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="contact-card">
                  <ContactIconFrame>
                    <InstagramContactIcon />
                  </ContactIconFrame>
                  <div>
                    <p className="text-sm text-warm-500">Instagram</p>
                    <p className="font-semibold text-warm-900">{site.instagramHandle}</p>
                  </div>
                </a>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5 lg:aspect-[4/3]">
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
        <section id="signup" className="page-section section-alt">
          <div className="container-main">
            <div className="mx-auto max-w-xl">
              <SectionHeader
                eyebrow="Запись"
                title="Записаться на урок/мастер-класс"
                description="Оставьте заявку — в ближайшее время обязательно свяжусь с вами."
              />
              <div className="card-soft mt-10 p-6 shadow-lg sm:p-8">
                <SignupForm />
              </div>
              <div className="mt-6 flex justify-center">
                <Link href="#top" className="btn-secondary h-11 px-8">
                  <ArrowUp className="size-4" />
                  На главную
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
