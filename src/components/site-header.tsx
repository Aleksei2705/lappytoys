"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type SyntheticEvent } from "react";
import { usePathname } from "next/navigation";
import { HeaderAuth } from "@/components/header-auth";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteLogo } from "@/components/site-logo";
import { navLinks } from "@/data/site";
import { useI18n } from "@/components/i18n-provider";
import { hashId, lockHomeHash, rememberHash, scrollToId } from "@/components/hash-scroll";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lockY = useRef(0);
  const pendingHash = useRef<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const [moreLeft, setMoreLeft] = useState(false);
  const [moreRight, setMoreRight] = useState(true);
  const { t, locale } = useI18n();
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
    const nav = navRef.current;
    if (!nav) return;

    let velocity = 0;
    let hovering = false;
    let frame = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function maxScroll() {
      return Math.max(0, nav.scrollWidth - nav.clientWidth);
    }

    function updateMore() {
      const overflow = maxScroll();
      setMoreLeft(overflow > 8 && nav.scrollLeft > 8);
      setMoreRight(overflow > 8 && nav.scrollLeft < overflow - 8);
    }

    function setVelocityFromX(clientX: number) {
      const overflow = maxScroll();
      if (overflow <= 0) {
        velocity = 0;
        return;
      }
      const rect = nav.getBoundingClientRect();
      const x = (clientX - rect.left) / Math.max(1, rect.width);
      const edge = 0.34;
      if (x < edge) {
        const t = (edge - x) / edge;
        velocity = -18 * t * t;
      } else if (x > 1 - edge) {
        const t = (x - (1 - edge)) / edge;
        velocity = 18 * t * t;
      } else {
        velocity = 0;
      }
    }

    function tick() {
      frame = 0;
      if (!hovering || velocity === 0) return;
      const overflow = maxScroll();
      if (overflow > 0) {
        const next = nav.scrollLeft + (reduceMotion ? velocity * 3 : velocity);
        nav.scrollLeft = Math.min(overflow, Math.max(0, next));
        updateMore();
      }
      frame = window.requestAnimationFrame(tick);
    }

    function startTick() {
      if (!frame) frame = window.requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType && event.pointerType !== "mouse") return;
      hovering = true;
      setVelocityFromX(event.clientX);
      startTick();
    }

    function onPointerLeave() {
      hovering = false;
      velocity = 0;
    }

    function onWheel(event: WheelEvent) {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      hovering = false;
      velocity = 0;
      nav.scrollLeft = Math.min(maxScroll(), Math.max(0, nav.scrollLeft + event.deltaY));
      updateMore();
      event.preventDefault();
    }

    const observer = new ResizeObserver(updateMore);
    observer.observe(nav);
    nav.addEventListener("pointermove", onPointerMove);
    nav.addEventListener("pointerleave", onPointerLeave);
    nav.addEventListener("wheel", onWheel, { passive: false });
    nav.addEventListener("scroll", updateMore, { passive: true });
    window.addEventListener("resize", updateMore);
    updateMore();
    const later = window.requestAnimationFrame(updateMore);
    return () => {
      hovering = false;
      window.cancelAnimationFrame(later);
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      nav.removeEventListener("pointermove", onPointerMove);
      nav.removeEventListener("pointerleave", onPointerLeave);
      nav.removeEventListener("wheel", onWheel);
      nav.removeEventListener("scroll", updateMore);
      window.removeEventListener("resize", updateMore);
    };
  }, [locale]);

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
          scrollToId(hash);
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
    const id = hashId(href);
    setOpen(false);
    if (!id) return;
    rememberHash(href);
    if (!onHome) {
      lockHomeHash();
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", `/#${id}`);
    if (open) {
      pendingHash.current = id;
      return;
    }
    scrollToId(id);
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

          <div
            className={`site-header-nav-wrap hidden flex-1 lg:block${moreLeft ? " has-more-left" : ""}${moreRight ? " has-more-right" : ""}`}
          >
            <nav
              ref={navRef}
              className="site-header-nav"
              aria-label={t("aria.menu")}
            >
              <div className="site-header-nav-inner">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    scroll={false}
                    className="nav-link shrink-0 whitespace-nowrap text-[13px] leading-none text-warm-500"
                    onClick={(event) => onSectionClick(event, link.href)}
                  >
                    {t(`nav.${link.href}`)}
                  </Link>
                ))}
              </div>
            </nav>
            <span className="site-header-nav-more site-header-nav-more-left" aria-hidden>
              <span className="site-header-nav-more-btn">
                <ChevronLeft className="size-3.5" />
              </span>
            </span>
            <span className="site-header-nav-more site-header-nav-more-right" aria-hidden>
              <span className="site-header-nav-more-btn">
                <ChevronRight className="size-3.5" />
              </span>
            </span>
          </div>

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
