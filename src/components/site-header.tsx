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

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function closeMenu(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
  }

  return (
    <>
      <header className={`site-header fixed inset-x-0 top-0 z-50 ${scrolled ? "scrolled" : ""}`}>
        <div className="container-header flex min-h-16 w-full items-center gap-3 py-2 md:gap-4 lg:gap-5">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <SiteLogo
              subtitleClassName="truncate text-[11px] leading-tight text-warm-500 sm:text-xs xl:text-sm"
              titleClassName="font-heading text-base font-semibold tracking-tight text-brand-800 whitespace-nowrap sm:text-lg lg:text-xl"
            />
          </Link>

          <span className="header-divider" aria-hidden />

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-2.5 md:flex lg:gap-x-4 xl:gap-x-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link whitespace-nowrap text-[12px] leading-none text-warm-500 lg:text-[13px] xl:text-sm"
              >
                {t(`nav.${link.href}`)}
              </Link>
            ))}
          </nav>

          <span className="header-divider" aria-hidden />

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
            <LanguageToggle />
            <HeaderAuth />
            <div className="hidden md:block">
              <Link href="/#signup" className="btn-primary h-9 whitespace-nowrap px-4 text-sm">
                {t("cta.signup")}
              </Link>
            </div>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-cream-200 bg-white md:hidden"
              aria-label={open ? t("aria.closeMenu") : t("aria.openMenu")}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

      </header>

      {open ? (
        <>
          <div
            role="presentation"
            className="mobile-nav-backdrop md:hidden"
            aria-hidden
            onPointerDown={closeMenu}
            onClick={closeMenu}
          />
          <nav className="mobile-nav-sheet md:hidden">
            <div className="mobile-nav-list">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setOpen(false)}
                >
                  {t(`nav.${link.href}`)}
                </Link>
              ))}
            </div>
            <div className="mobile-nav-cta">
              <Link
                href="/#signup"
                className="btn-primary h-11 w-full"
                onClick={() => setOpen(false)}
              >
                {t("cta.signup")}
              </Link>
            </div>
          </nav>
        </>
      ) : null}

      <div className="site-header-spacer" aria-hidden />
    </>
  );
}
