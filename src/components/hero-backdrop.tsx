"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type HeroBackdropProps = {
  src: string;
};

const SCALE = 1.12;

/** Full-bleed hero: cursor parallax on desktop, slow drift on mobile. */
export function HeroBackdrop({ src }: HeroBackdropProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const active = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduce || !finePointer || !desktop) return;

    function apply() {
      if (!layerRef.current) return;
      layerRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) scale(${SCALE})`;
    }

    function tick() {
      current.current.x += (target.current.x - current.current.x) * 0.07;
      current.current.y += (target.current.y - current.current.y) * 0.07;
      apply();

      const dx = Math.abs(target.current.x - current.current.x);
      const dy = Math.abs(target.current.y - current.current.y);
      if (dx > 0.05 || dy > 0.05) {
        frame.current = window.requestAnimationFrame(tick);
      } else {
        active.current = false;
        frame.current = 0;
      }
    }

    function onMove(event: MouseEvent) {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      target.current = { x: nx * -18, y: ny * -12 };

      if (!active.current) {
        active.current = true;
        frame.current = window.requestAnimationFrame(tick);
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame.current) window.cancelAnimationFrame(frame.current);
      active.current = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-cream">
      <div
        ref={layerRef}
        className="hero-parallax-layer absolute -inset-[8%] bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
      >
        {/* Same frame as CSS bg — keeps LCP/priority without a visible swap */}
        <Image
          src={src}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-0"
          sizes="100vw"
          quality={85}
        />
      </div>
      {/* Soft light wash — keeps knit visible, text readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream/90 via-cream/25 to-brand-50/20" />
      <div className="pointer-events-none absolute inset-0 bg-white/15" />
      <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light">
        <div className="hero-shimmer absolute inset-0" />
      </div>
    </div>
  );
}
