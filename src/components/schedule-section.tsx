import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { scheduleSlots } from "@/data/site";

export function ScheduleSection() {
  return (
    <section id="schedule" className="page-section section-alt">
      <div className="container-main">
        <SectionHeader
          eyebrow="Расписание"
          title="Ближайшие окна для записи"
          description="Ориентировочные дни и время — точную дату подтвердим при записи. Расписание можно обновить под текущую неделю."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scheduleSlots.map((slot) => (
            <article
              key={slot.id}
              className="card-soft flex flex-col px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-brand-700">
                <CalendarDays className="size-4 shrink-0" />
                <p className="text-sm font-semibold">{slot.weekday}</p>
              </div>
              <p className="mt-2 font-heading text-lg font-semibold text-warm-900">{slot.time}</p>
              <p className="mt-1 text-sm font-medium text-warm-800">{slot.title}</p>
              <p className="mt-1 text-xs text-warm-500">{slot.note}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/#signup" className="btn-primary h-11 px-6">
            Записаться на удобное время
          </Link>
        </div>
      </div>
    </section>
  );
}
