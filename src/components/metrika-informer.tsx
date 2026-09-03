"use client";

import { useEffect, useState } from "react";
import { Eye, Users, MousePointerClick } from "lucide-react";
import { site } from "@/data/site";

type InformerData = {
  pageviews: number | null;
  visits: number | null;
  uniques: number | null;
};

declare global {
  interface Window {
    yandex_metrika_json_informer?: InformerData;
  }
}

function formatCount(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function MetrikaInformer() {
  const [data, setData] = useState<InformerData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function applyFromGlobal() {
      const raw = window.yandex_metrika_json_informer;
      if (!raw || cancelled) return false;
      setData({
        pageviews: raw.pageviews ?? null,
        visits: raw.visits ?? null,
        uniques: raw.uniques ?? null,
      });
      setReady(true);
      return true;
    }

    if (applyFromGlobal()) return;

    const script = document.createElement("script");
    script.src = `https://informer.yandex.ru/informer/${site.yandexMetricaId}/json`;
    script.async = true;
    script.onload = () => {
      if (!applyFromGlobal()) setReady(true);
    };
    script.onerror = () => {
      if (!cancelled) setReady(true);
    };
    document.body.appendChild(script);

    const timer = window.setTimeout(() => {
      if (!cancelled && !applyFromGlobal()) setReady(true);
    }, 2000);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      script.remove();
    };
  }, []);

  const hasNumbers =
    data && (data.pageviews != null || data.visits != null || data.uniques != null);

  return (
    <div className="w-full max-w-md rounded-2xl border border-brand-100/80 bg-white/80 p-4 shadow-sm shadow-brand-50/40">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-heading text-sm font-semibold text-brand-800">Посещаемость сегодня</p>
        <a
          href={`https://metrika.yandex.ru/stat/?id=${site.yandexMetricaId}&from=informer`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="text-xs font-medium text-warm-500 transition-colors hover:text-brand-700"
        >
          Яндекс.Метрика
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-brand-50/80 px-2 py-3">
          <Eye className="mx-auto size-4 text-brand-600" aria-hidden />
          <p className="mt-1.5 font-heading text-lg font-bold text-brand-700">
            {ready ? formatCount(data?.pageviews) : "…"}
          </p>
          <p className="text-[11px] leading-tight text-warm-500">просмотры</p>
        </div>
        <div className="rounded-xl bg-brand-50/80 px-2 py-3">
          <MousePointerClick className="mx-auto size-4 text-brand-600" aria-hidden />
          <p className="mt-1.5 font-heading text-lg font-bold text-brand-700">
            {ready ? formatCount(data?.visits) : "…"}
          </p>
          <p className="text-[11px] leading-tight text-warm-500">визиты</p>
        </div>
        <div className="rounded-xl bg-brand-50/80 px-2 py-3">
          <Users className="mx-auto size-4 text-brand-600" aria-hidden />
          <p className="mt-1.5 font-heading text-lg font-bold text-brand-700">
            {ready ? formatCount(data?.uniques) : "…"}
          </p>
          <p className="text-[11px] leading-tight text-warm-500">посетители</p>
        </div>
      </div>

      {ready && !hasNumbers ? (
        <p className="mt-3 text-center text-[11px] leading-relaxed text-warm-500">
          Чтобы появились цифры: Яндекс.Метрика → настройки счётчика → включите «Информер» и
          «Показывать данные информера».
        </p>
      ) : null}

      <div className="mt-3 flex justify-center">
        <a
          href={`https://metrika.yandex.ru/stat/?id=${site.yandexMetricaId}&from=informer`}
          target="_blank"
          rel="nofollow noopener noreferrer"
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
      </div>
    </div>
  );
}
