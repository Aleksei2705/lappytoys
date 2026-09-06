import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/data/site";

export const metadata = {
  title: "Политика обработки персональных данных",
  description: `Как ${site.name} обрабатывает контактные данные заявок и отзывов.`,
};

export default function PrivacyPage() {
  return (
    <div>
      <SiteHeader />
      <main className="page-section">
        <div className="container-main mx-auto max-w-3xl">
          <p className="eyebrow">Документы</p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-warm-900 sm:text-4xl">
            Политика обработки персональных данных
          </h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-warm-600">
            <p>
              Настоящая политика описывает, как творческая студия lappy.art ({site.address}) обрабатывает
              персональные данные посетителей сайта {site.url}.
            </p>
            <h2 className="font-heading text-xl font-semibold text-warm-900">Какие данные собираем</h2>
            <p>
              При записи на занятие: имя, телефон, выбранное направление, желаемая дата и текст сообщения.
              При отзыве: имя из профиля (Google/email), текст отзыва, курс и оценка.
            </p>
            <h2 className="font-heading text-xl font-semibold text-warm-900">Зачем</h2>
            <p>
              Чтобы связаться с вами по заявке, подтвердить запись, ответить на вопросы и опубликовать отзыв
              на сайте (после модерации).
            </p>
            <h2 className="font-heading text-xl font-semibold text-warm-900">Куда передаём</h2>
            <p>
              Заявка открывается в WhatsApp для отправки преподавателю. Отзывы хранятся в базе Supabase.
              Уведомления о новых отзывах могут приходить на email и/или в Telegram администратора.
            </p>
            <h2 className="font-heading text-xl font-semibold text-warm-900">Срок и права</h2>
            <p>
              Данные хранятся, пока нужны для записи и публикации отзыва. Чтобы уточнить, исправить или
              удалить данные, напишите на {site.notifyEmail} или в Telegram {site.telegramHandle}.
            </p>
            <h2 className="font-heading text-xl font-semibold text-warm-900">Согласие</h2>
            <p>
              Отправляя форму на сайте, вы соглашаетесь на обработку указанных контактных данных для связи
              и организации занятий.
            </p>
          </div>
          <Link href="/#signup" className="btn-secondary mt-10 inline-flex h-11 px-6">
            Вернуться к записи
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
