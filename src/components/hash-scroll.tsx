"use client";

import Link from "next/link";
import { useEffect, type ComponentProps } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "lappy-scroll";

export function hashId(href: string) {
  const index = href.indexOf("#");
  return index >= 0 ? href.slice(index + 1) : "";
}

export function rememberHash(href: string) {
  const id = hashId(href);
  if (!id) return;
  sessionStorage.setItem(STORAGE_KEY, id);
}

export function scrollToId(id: string) {
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView();
  return true;
}

function targetId() {
  return window.location.hash.replace(/^#/, "") || sessionStorage.getItem(STORAGE_KEY) || "";
}

function scrollToHash() {
  const id = targetId();
  if (!id) return true;
  if (!scrollToId(id)) return false;
  sessionStorage.removeItem(STORAGE_KEY);
  if (window.location.hash.replace(/^#/, "") !== id) {
    window.history.replaceState(null, "", `/#${id}`);
  }
  return true;
}

/** Next.js Link often scrolls to the top on `/#section` and drops the hash. */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let tries = 0;
    let timer = 0;

    function attempt() {
      if (scrollToHash() || tries++ > 24) return;
      timer = window.setTimeout(attempt, 50);
    }

    const frame = window.requestAnimationFrame(attempt);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
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
        if (pathname !== "/" || !id) return;
        event.preventDefault();
        window.history.pushState(null, "", `/#${id}`);
        scrollToId(id);
      }}
    />
  );
}
