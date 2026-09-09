"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type SyntheticEvent } from "react";
import { usePathname } from "next/navigation";
import { HeaderAuth } from "@/components/header-auth";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteLogo } from "@/components/site-logo";
import { navLinks } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";

function sectionId(href: string) {
  const index = href.indexOf("#");
  return index >= 0 ? href.slice(index + 1) : "";
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lockY = useRef(0);
  const pendingHash = useRef<string | null>(null);
  const { t } = useI18n();
  const onHome = pathname === "/";

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

    const { body } = document;
    lockY.current = window.scrollY;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${lockY.current}px`;
    body.style.width = "100%";
    document.addEventListener("keydown", onKey);

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      document.removeEventListener("keydown", onKey);

      const hash = pendingHash.current;
      pendingHash.current = null;
      if (hash) {
        window.requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView();
        });
        return;
      }
      window.scrollTo(0, lockY.current);
    };
  }, [open]);

  function closeMenu(event: SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
  }

  function onSectionClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const id = sectionId(href);
    setOpen(false);
    if (!id || !onHome) return;

    event.preventDefault();
    window.history.pushState(null, "", `/#${id}`);
    if (open) {
      pendingHash.current = id;
      return;
    }
    document.getElementById(id)?.scrollIntoView();
  }

  return (
    <>
      <header className={`site-header fixed inset-x-0 top-0 z-50 ${scrolled ? "scrolled" : ""}`}>
        <div className="container-header flex min-h-16 w-full items-center gap-3 py-2 lg:gap-4">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
            <SiteLogo
              subtitleClassName="hidden truncate text-[11px] leading-tight text-warm-500 sm:block sm:text-xs 2xl:text-sm lg:hidden 2xl:block"
              titleClassName="font-heading text-base font-semibold tracking-tight text-brand-800 whitespace-nowrap sm:text-lg"
            />
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-3 lg:flex xl:gap-x-5 2xl:gap-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                scroll={false}
                className="nav-link whitespace-nowrap text-[13px] leading-none text-warm-500 xl:text-sm"
                onClick={(event) => onSectionClick(event, link.href)}
              >
                {t(`nav.${link.href}`)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5 lg:ml-0">
            <LanguageToggle />
            <HeaderAuth />
            <div className="hidden lg:block">
              <Link
                href="/#signup"
                scroll={false}
                className="btn-primary h-9 whitespace-nowrap px-3 text-sm xl:px-4"
                onClick={(event) => onSectionClick(event, "/#signup")}
              >
                {t("cta.signup")}
              </Link>
            </div>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-cream-200 bg-white lg:hidden"
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
            className="mobile-nav-backdrop lg:hidden"
            aria-hidden
            onPointerDown={closeMenu}
            onClick={closeMenu}
          />
          <nav className="mobile-nav-sheet lg:hidden">
            <div className="mobile-nav-list">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  scroll={false}
                  className="mobile-nav-link"
                  onClick={(event) => onSectionClick(event, link.href)}
                >
                  {t(`nav.${link.href}`)}
                </Link>
              ))}
            </div>
            <div className="mobile-nav-cta">
              <Link
                href="/#signup"
                scroll={false}
                className="btn-primary h-11 w-full"
                onClick={(event) => onSectionClick(event, "/#signup")}
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
