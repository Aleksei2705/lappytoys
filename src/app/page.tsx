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
  Users,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
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
              description="Успейте приобрести готовые мастер-классы и не забудьте про скидку!"
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
                    <a
                      href={site.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary h-10 w-full"
                    >
                      Заказать
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
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Телефон</p>
                    <p className="font-semibold text-warm-900">{site.phoneDisplay}</p>
                  </div>
                </a>
                <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 text-sky-700">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Telegram</p>
                    <p className="font-semibold text-warm-900">{site.telegramHandle}</p>
                  </div>
                </a>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-50 text-green-700">
                    <WhatsAppIcon />
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">WhatsApp</p>
                    <p className="font-semibold text-warm-900">{site.phoneDisplay}</p>
                  </div>
                </a>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700">
                    <InstagramIcon />
                  </div>
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
                title="Записаться на урок"
                description="Оставьте заявку — в ближайшее время обязательно свяжусь с вами."
              />
              <div className="card-soft mt-10 p-6 shadow-lg sm:p-8">
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
