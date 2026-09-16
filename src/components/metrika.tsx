"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const METRIKA_ID = Number(site.yandexMetricaId);

export function Metrika() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (typeof window.ym === "function") return;
    const timer = window.setTimeout(() => {
      if (typeof window.ym === "function") return;
      if (document.querySelector("script[data-metrika-loader]")) return;
      const script = document.createElement("script");
      script.src = "/metrica.js";
      script.dataset.metrikaLoader = "1";
      document.head.appendChild(script);
    }, 400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (typeof window.ym !== "function") return;
    window.ym(METRIKA_ID, "hit", window.location.href, {
      title: document.title,
      referer: document.referrer,
    });
  }, [pathname]);

  return null;
}

