"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Clock,
  Heart,
  Users,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SignupForm } from "@/components/signup-form";
import { ReviewsSection } from "@/components/reviews-section";
import { InstagramFeed } from "@/components/instagram-feed";
import { WorksGallery } from "@/components/works-gallery";
import { MasterClassesCarousel } from "@/components/master-classes-carousel";
import { ScheduleSection } from "@/components/schedule-section";
import { FaqSection } from "@/components/faq-section";
import { HeroCopy } from "@/components/hero-copy";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { Reveal } from "@/components/reveal";
import { PriceText } from "@/components/price-text";
import { useI18n } from "@/components/i18n-provider";
import {
  ContactIconFrame,
  InstagramContactIcon,
  Map2GisIcon,
  MapGoogleIcon,
  MapYandexIcon,
  PhoneContactIcon,
  TelegramContactIcon,
} from "@/components/contact-icons";
import { WhatsAppContactCard } from "@/components/whatsapp-contact-card";
import { benefits, courses, site, stats } from "@/data/site";

const benefitIcons = {
  heart: Heart,
  book: BookOpen,
  clock: Clock,
} as const;

const benefitKeys = ["nice", "clear", "personal"] as const;
const aboutKeys = ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"] as const;
const statKeys = ["students", "directions", "group"] as const;

const statIcons = {
  users: Users,
} as const;

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div id="top">
      <SiteHeader />
      <main>
        {/* Hero — full-bleed photo + cursor parallax */}
        <section className="relative flex min-h-[calc(100svh-4rem-env(safe-area-inset-top,0px))] flex-col justify-end overflow-hidden">
          <HeroBackdrop src="/images/hero-knit.jpg" />

          <div className="container-main relative z-10 w-full pb-10 pt-16 sm:pb-14 sm:pt-20 md:pb-16">
            <HeroCopy />
          </div>
        </section>

        {/* Stats — below first viewport */}
        <section className="border-b border-brand-100/70 bg-cream py-8 sm:py-10">
          <div className="container-main">
            <Reveal>
              <dl className="grid grid-cols-3 gap-4 text-center">
                {stats.map((stat, i) => {
                  const StatIcon =
                    "icon" in stat && stat.icon ? statIcons[stat.icon] : null;
                  const label = t(`stat.${statKeys[i]}`);

                  return (
                    <div key={statKeys[i]} className="transition-transform duration-300 hover:-translate-y-1">
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
                        {label}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* About */}
        <section id="about" className="page-section section-alt section-stitch">
          <div className="container-main">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal>
                <div className="relative">
                  <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-brand-100/60" />
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5">
                    <Image
                      src="/images/room.jpg"
                      alt={t("about.photoAlt")}
                      fill
                      className="object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="mt-5 text-center lg:text-left">
                    <p className="font-heading text-lg font-semibold text-warm-900">Ольга Лаптева</p>
                    <p className="text-sm text-warm-500">{t("about.role")}</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delayMs={120}>
                <div className="space-y-6">
                  <SectionHeader
                    align="left"
                    eyebrow={t("about.eyebrow")}
                    title={
                      <>
                        {t("about.title.before")}{" "}
                        <span className="text-gradient">{t("about.title.accent")}</span>
                      </>
                    }
                  />
                  <div className="space-y-4 text-base leading-relaxed text-warm-500">
                    {aboutKeys.map((key) => (
                      <p key={key}>{t(`about.${key}`)}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="page-section section-stitch">
          <div className="container-main">
            <Reveal>
              <SectionHeader
                eyebrow={t("courses.eyebrow")}
                title={t("courses.title")}
                description={t("courses.desc")}
              />
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <Reveal key={course.id} delayMs={(i % 3) * 80}>
                  <article
                    className={`card-hover flex h-full flex-col bg-gradient-to-br ${course.accent}`}
                  >
                    <div className="relative flex flex-1 flex-col justify-start gap-2 px-5 pb-5 pt-2">
                      <span className="absolute right-4 top-2 text-3xl" aria-hidden="true">
                        {course.emoji}
                      </span>
                      <span className="badge-soft">
                        <PriceText>{t(`course.${course.id}.badge`)}</PriceText>
                      </span>
                      <h3 className="pr-10 font-heading text-xl font-semibold text-warm-900">
                        {t(`course.${course.id}.title`)}
                      </h3>
                      <p className="text-base leading-relaxed text-warm-500">
                        {t(`course.${course.id}.desc`)}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3 text-sm font-medium text-brand-800">
                        <PriceText>{course.price}</PriceText>
                        <span className="text-warm-500">{t(`course.${course.id}.duration`)}</span>
                      </div>
                    </div>
                    <div className="border-t border-warm-900/5 bg-white/60 p-4">
                      <Link href={`/courses/${course.id}/`} className="btn-ghost h-10 w-full">
                        {t("cta.details")}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Master classes */}
        <Reveal>
          <MasterClassesCarousel />
        </Reveal>

        <Reveal>
          <ScheduleSection />
        </Reveal>

        <Reveal>
          <WorksGallery />
        </Reveal>

        <Reveal>
          <InstagramFeed />
        </Reveal>

        <Reveal>
          <ReviewsSection />
        </Reveal>

        {/* Benefits */}
        <section className="page-section section-alt">
          <div className="container-main">
            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map((b, i) => {
                const Icon = benefitIcons[b.icon];
                const key = benefitKeys[i];
                return (
                  <Reveal key={key} delayMs={i * 90}>
                    <div className="card-soft flex flex-col items-center px-6 pb-6 pt-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-100/30">
                      <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-600 shadow-inner">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="font-heading text-xl font-semibold">{t(`benefit.${key}.title`)}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-warm-500">
                        {t(`benefit.${key}.desc`)}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <Reveal>
          <FaqSection />
        </Reveal>

        {/* Contacts */}
        <section id="contacts" className="page-section section-stitch">
          <div className="container-main">
            <Reveal>
              <SectionHeader
                eyebrow={t("contacts.eyebrow")}
                title={t("contacts.title")}
                description={t("contacts.desc")}
              />
            </Reveal>
            <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
              <Reveal>
                <div className="space-y-3">
                  <a href={`tel:${site.phone}`} className="contact-card">
                    <ContactIconFrame>
                      <PhoneContactIcon />
                    </ContactIconFrame>
                    <div>
                      <p className="text-sm text-warm-500">{t("contacts.phone")}</p>
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
                  <WhatsAppContactCard />
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
              </Reveal>
              <Reveal delayMs={100}>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={site.map2gis}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary h-10 gap-1.5 px-1 text-xs sm:px-2 sm:text-sm"
                    >
                      <Map2GisIcon />
                      2ГИС
                    </a>
                    <a
                      href={site.mapGoogle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary h-10 gap-1.5 px-1 text-xs sm:px-2 sm:text-sm"
                    >
                      <MapGoogleIcon />
                      Google
                    </a>
                    <a
                      href={site.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary h-10 gap-1.5 px-1 text-xs sm:px-2 sm:text-sm"
                    >
                      <MapYandexIcon />
                      Яндекс
                    </a>
                  </div>
                  <div className="relative aspect-video overflow-hidden rounded-3xl shadow-xl ring-1 ring-warm-900/5 lg:aspect-[4/3]">
                    <iframe
                      title={t("contacts.map")}
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
                    className="block w-full overflow-hidden whitespace-nowrap text-center font-heading font-semibold leading-none text-brand-700 transition-colors hover:text-brand-800"
                    style={{ fontSize: "clamp(0.72rem, 3.4vw, 1.25rem)" }}
                  >
                    {t("contacts.address")}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Signup */}
        <section id="signup" className="page-section section-alt">
          <div className="container-main">
            <Reveal className="mx-auto max-w-xl">
              <SectionHeader
                eyebrow={t("signup.eyebrow")}
                title={t("signup.title")}
                description={t("signup.desc")}
              />
              <div className="card-soft mt-10 px-5 pb-5 pt-3 shadow-lg sm:px-7 sm:pb-7 sm:pt-3.5">
                <SignupForm />
              </div>
              <div className="mt-6 flex justify-center">
                <Link href="#top" className="btn-secondary h-11 px-8">
                  <ArrowUp className="size-4" />
                  {t("signup.home")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
