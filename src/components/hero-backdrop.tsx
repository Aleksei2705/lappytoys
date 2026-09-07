"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type HeroBackdropProps = {
  src: string;
};

/** Full-bleed hero background with soft cursor parallax (desktop, motion OK). */
export function HeroBackdrop({ src }: HeroBackdropProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const layer = layerRef.current;
    if (!layer) return;

    if (reduce || !finePointer) {
      layer.style.transform = "translate3d(0,0,0) scale(1.08)";
      return;
    }

    function onMove(event: MouseEvent) {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      // Move opposite to cursor for depth
      target.current = { x: nx * -22, y: ny * -14 };
    }

    function tick() {
      current.current.x += (target.current.x - current.current.x) * 0.07;
      current.current.y += (target.current.y - current.current.y) * 0.07;
      if (layer) {
        layer.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) scale(1.14)`;
      }
      frame.current = window.requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    frame.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-warm-900">
      <div
        ref={layerRef}
        className="hero-parallax-layer absolute -inset-[8%] will-change-transform"
        style={{ transform: "translate3d(0,0,0) scale(1.14)" }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-warm-900/75 via-warm-900/35 to-warm-900/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-warm-900/85 via-warm-900/25 to-warm-900/30" />
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light">
        <div className="hero-shimmer absolute inset-0" />
      </div>
    </div>
  );
}
