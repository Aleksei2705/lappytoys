import { site } from "@/data/site";

export function MetrikaInformer() {
  return (
    <a
      href={`https://metrika.yandex.ru/stat/?id=${site.yandexMetricaId}&from=informer`}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="opacity-80 transition-opacity hover:opacity-100"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://informer.yandex.ru/informer/${site.yandexMetricaId}/3_1_FFFFFFFF_EFEFEFFF_0_pageviews`}
        width={88}
        height={31}
        alt="Яндекс.Метрика"
        title="Яндекс.Метрика: данные за сегодня"
        className="ym-advanced-informer border-0"
        data-cid={site.yandexMetricaId}
        data-lang="ru"
      />
    </a>
  );
}
