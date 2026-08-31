"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks, site } from "@/data/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-stone-200/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="max-w-[10rem] font-heading text-base font-semibold leading-tight tracking-tight text-rose-700 sm:max-w-none sm:text-lg md:text-xl"
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-stone-500 transition-colors hover:text-stone-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#signup"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-rose-700 px-3 text-sm font-medium text-white transition-colors hover:bg-rose-800"
          >
            Записаться
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-stone-200 bg-white md:hidden"
          aria-label="Открыть меню"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-stone-600"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#signup"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-rose-700 px-3 text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Записаться
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
