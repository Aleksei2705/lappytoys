"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { HeaderAuth } from "@/components/header-auth";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteLogo } from "@/components/site-logo";
import { navLinks } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`site-header fixed inset-x-0 top-0 z-50 ${scrolled ? "scrolled" : ""}`}>
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
              aria-label="Открыть меню"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
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
        )}
      </header>
      <div className="site-header-spacer" aria-hidden />
    </>
  );
}
