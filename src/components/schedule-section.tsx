"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { useI18n } from "@/components/i18n-provider";
import { scheduleSlots } from "@/data/site";

const weekdayKey: Record<string, string> = {
  "slot-1": "weekday.tue",
  "slot-2": "weekday.thu",
  "slot-3": "weekday.sat",
  "slot-4": "weekday.sun",
};

const noteKey: Record<string, string> = {
  "slot-1": "schedule.note.individual",
  "slot-2": "schedule.note.individual",
  "slot-3": "schedule.note.group",
  "slot-4": "schedule.note.group",
};

export function ScheduleSection() {
  const { t } = useI18n();

  return (
    <section id="schedule" className="page-section section-alt">
      <div className="container-main">
        <SectionHeader
          eyebrow={t("schedule.eyebrow")}
          title={t("schedule.title")}
          description={t("schedule.desc")}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scheduleSlots.map((slot) => (
            <article
              key={slot.id}
              className="card-soft flex flex-col px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-brand-700">
                <CalendarDays className="size-4 shrink-0" />
                <p className="text-sm font-semibold">{t(weekdayKey[slot.id])}</p>
              </div>
              <p className="mt-2 font-heading text-lg font-semibold text-warm-900">{slot.time}</p>
              <p className="mt-1 text-sm font-medium text-warm-800">{t("schedule.studio")}</p>
              <p className="mt-1 text-xs text-warm-500">{t(noteKey[slot.id])}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/#signup" className="btn-primary h-11 px-6">
            {t("cta.schedule")}
          </Link>
        </div>
      </div>
    </section>
  );
}
