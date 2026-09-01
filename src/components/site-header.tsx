"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <div className="container-main flex min-h-16 items-center justify-between py-2">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Image
              src="/images/logo.png"
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 object-contain sm:size-12"
              priority
            />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="font-heading text-base font-semibold tracking-tight text-brand-800 sm:text-xl">
                lappy.art
              </span>
              <span className="text-[11px] text-warm-500 sm:text-sm">Творческая студия</span>
            </span>
          </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-warm-500 transition-colors hover:text-brand-800"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/#signup" className="btn-primary h-9 px-4 text-sm">
            Записаться
          </Link>
        </nav>

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
                {link.label}
              </Link>
            ))}
            <Link
              href="/#signup"
              className="btn-primary mt-1 h-10"
              onClick={() => setOpen(false)}
            >
              Записаться
            </Link>
          </div>
        </nav>
      )}
      </header>
      <div className="site-header-spacer" aria-hidden />
    </>
  );
}
