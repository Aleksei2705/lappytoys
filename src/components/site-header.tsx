"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HeaderAuth } from "@/components/header-auth";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteLogo } from "@/components/site-logo";
import { navLinks } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useI18n();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (target && headerRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header fixed inset-x-0 top-0 z-50 ${scrolled ? "scrolled" : ""}`}
      >
        <div className="container-main flex min-h-16 items-center justify-between gap-3 py-2">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <SiteLogo />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-warm-500 transition-colors hover:text-brand-800"
              >
                {t(`nav.${link.href}`)}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle />
            <HeaderAuth />
            <div className="hidden md:block">
              <Link href="/#signup" className="btn-primary h-9 px-4 text-sm">
                {t("cta.signup")}
              </Link>
            </div>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-cream-200 bg-white md:hidden"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-cream-200 bg-white/95 px-4 py-4 backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-1.5 text-sm text-warm-500 hover:bg-brand-50 hover:text-brand-800"
                  onClick={() => setOpen(false)}
                >
                  {t(`nav.${link.href}`)}
                </Link>
              ))}
              <Link
                href="/#signup"
                className="btn-primary mt-1 h-10"
                onClick={() => setOpen(false)}
              >
                {t("cta.signup")}
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-warm-900/25 md:hidden"
          aria-label="Закрыть меню"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="site-header-spacer" aria-hidden />
    </>
  );
}
