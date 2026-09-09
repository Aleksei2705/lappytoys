"use client";

import Link from "next/link";
import { useLayoutEffect, type ComponentProps } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "lappy-scroll";
const LOCK_CLASS = "lappy-hash-lock";

export function hashId(href: string) {
  const index = href.indexOf("#");
  return index >= 0 ? href.slice(index + 1) : "";
}

export function rememberHash(href: string) {
  const id = hashId(href);
  if (!id) return;
  sessionStorage.setItem(STORAGE_KEY, id);
}

export function lockHomeHash() {
  document.documentElement.classList.add(LOCK_CLASS);
}

export function unlockHomeHash() {
  document.documentElement.classList.remove(LOCK_CLASS);
}

export function scrollToId(id: string) {
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "auto", block: "start" });
  return true;
}

function targetId() {
  return window.location.hash.replace(/^#/, "") || sessionStorage.getItem(STORAGE_KEY) || "";
}

/** Next.js paints `/` at the top before the hash; hide that frame and jump to the section first. */
export function HashScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const id = targetId();
    if (!id) {
      unlockHomeHash();
      return;
    }

    lockHomeHash();
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    let tries = 0;
    let timer = 0;
    let raf = 0;
    let frames = 0;
    let finished = false;

    function apply() {
      return scrollToId(id);
    }

    function finish() {
      if (finished) return;
      finished = true;
      sessionStorage.removeItem(STORAGE_KEY);
      if (window.location.hash.replace(/^#/, "") !== id) {
        window.history.replaceState(null, "", `/#${id}`);
      }
      unlockHomeHash();
      window.history.scrollRestoration = previousRestoration;
    }

    function hold() {
      apply();
      frames += 1;
      if (frames < 10) {
        raf = window.requestAnimationFrame(hold);
        return;
      }
      finish();
    }

    function start() {
      if (apply()) {
        hold();
        return;
      }
      tries += 1;
      if (tries > 30) {
        finish();
        return;
      }
      timer = window.setTimeout(start, 16);
    }

    start();
    window.addEventListener("hashchange", apply);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", apply);
      if (!finished) {
        unlockHomeHash();
        window.history.scrollRestoration = previousRestoration;
      }
    };
  }, [pathname]);

  return null;
}

type HomeHashLinkProps = Omit<ComponentProps<typeof Link>, "href" | "scroll"> & {
  href: `/${string}` | `#${string}`;
};

export function HomeHashLink({ href, onClick, ...props }: HomeHashLinkProps) {
  const pathname = usePathname();
  const path = href.startsWith("#") ? `/${href}` : href;

  return (
    <Link
      {...props}
      href={path}
      scroll={false}
      onClick={(event) => {
        rememberHash(path);
        onClick?.(event);
        if (event.defaultPrevented) return;
        const id = hashId(path);
        if (!id) return;
        if (pathname !== "/") {
          lockHomeHash();
          return;
        }
        event.preventDefault();
        window.history.pushState(null, "", `/#${id}`);
        scrollToId(id);
      }}
    />
  );
}
