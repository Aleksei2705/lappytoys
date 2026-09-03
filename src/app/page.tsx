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
  Users,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SignupForm } from "@/components/signup-form";
import { ReviewsSection } from "@/components/reviews-section";
import { WorksGallery } from "@/components/works-gallery";
import { MasterClassesCarousel } from "@/components/master-classes-carousel";
import { PriceText } from "@/components/price-text";
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
        {/* Hero — macrame photo behind content until About */}
        <section className="relative flex min-h-[calc(100svh-4rem-env(safe-area-inset-top,0px))] flex-col justify-start overflow-hidden pt-3 sm:pt-5 md:justify-center md:pt-0">
          <div className="absolute inset-0 bg-cream">
            <Image
              src="/images/hero-bg.jpg"
              alt=""
              fill
              priority
              className="object-contain object-center"
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-cream/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-cream/65 via-transparent to-cream/75" />
          </div>
          <div className="glow-brand -right-24 -top-24 size-96 opacity-40" />
          <div className="glow-accent -bottom-32 -left-24 size-80 opacity-40" />

          <div className="container-main relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center py-4 text-center sm:py-8 md:flex-none md:py-12">
            <div className="badge-soft shrink-0 inline-flex gap-2 px-4 py-2 md:mb-10">
              <Sparkles className="size-4" />
              Создаём руками вместе
            </div>

            <div className="flex w-full flex-1 flex-col items-center justify-center space-y-6 py-4 sm:space-y-8 md:flex-none md:py-0">
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
            </div>

            <dl className="mt-auto mb-3 grid w-full shrink-0 grid-cols-3 gap-4 border-t border-cream-200/70 pt-5 text-center sm:mb-4 sm:pt-6 md:mt-8 md:mb-0 md:pt-8">
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
        </section>

        {/* About */}
        <section id="about" className="page-section section-alt section-stitch">
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
                      Мой <span className="text-gradient">творческий путь</span>
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
        <section id="courses" className="page-section section-stitch">
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
                  <div className="relative flex flex-1 flex-col justify-start gap-2 px-5 pb-5 pt-2">
                    <span className="absolute right-4 top-2 text-3xl" aria-hidden="true">
                      {course.emoji}
                    </span>
                    <span className="badge-soft">
                      <PriceText>{course.badge}</PriceText>
                    </span>
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
        <MasterClassesCarousel />

        <WorksGallery />

        <ReviewsSection />

        {/* Benefits */}
        <section className="page-section section-alt">
          <div className="container-main">
            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map((b) => {
                const Icon = benefitIcons[b.icon];
                return (
                  <div
                    key={b.title}
                    className="card-soft flex flex-col items-center px-6 pb-6 pt-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-100/30"
                  >
                    <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-600 shadow-inner">
                      <Icon className="size-6" />
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
        <section id="contacts" className="page-section section-stitch">
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
              <div className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5 lg:aspect-[4/3]">
                  <iframe
                    title="Карта: творческая студия lappy.art"
                    src={site.mapEmbedUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href={site.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center font-heading text-sm font-semibold leading-relaxed text-brand-700 transition-colors hover:text-brand-800 sm:text-base"
                >
                  {site.address}
                </a>
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
              <div className="card-soft mt-10 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5">
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
