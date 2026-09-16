"use client";

import { useEffect, useRef, useState } from "react";

const LOOK = "/images/watch-cat-look.png?v=5";
const STEP = "/images/watch-cat-turn.png?v=5";
const BAT = "/images/watch-cat-tail.png?v=5";
const BLINK = "/images/watch-cat-blink.png?v=5";

type Pose = "look" | "step" | "bat" | "blink";

function srcFor(pose: Pose) {
  if (pose === "step") return STEP;
  if (pose === "bat") return BAT;
  if (pose === "blink") return BLINK;
  return LOOK;
}

export function WatchCat() {
  const [pose, setPose] = useState<Pose>("look");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [LOOK, STEP, BAT, BLINK].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let frame = 0;
    let running = true;
    let current: Pose = "look";
    let stepFlip = 0;
    let nextStep = 280;
    let blinkUntil = 0;
    let nextBlink = 1200;
    let batUntil = 0;
    let nextBat = 900;
    let hopUntil = 0;

    function show(next: Pose) {
      if (next === current) return;
      current = next;
      setPose(next);
    }

    function tick(now: number) {
      if (!running) return;

      if (now >= nextStep) {
        stepFlip = 1 - stepFlip;
        nextStep = now + 220 + Math.random() * 160;
      }
      if (now >= nextBlink) {
        blinkUntil = now + 120;
        nextBlink = now + 1800 + Math.random() * 2200;
      }
      if (now >= nextBat) {
        batUntil = now + 280 + Math.random() * 180;
        hopUntil = now + 340;
        nextBat = now + 1400 + Math.random() * 1600;
      }

      if (now < blinkUntil) show("blink");
      else if (now < batUntil) show("bat");
      else show(stepFlip ? "step" : "look");

      const follow = Math.sin(now / 1600) * 2.2;
      const hop = now < hopUntil ? Math.sin(((hopUntil - now) / 340) * Math.PI) * 5 : 0;
      const node = wrapRef.current;
      if (node) {
        node.style.transform = `translateY(${-hop}px) rotate(${follow}deg)`;
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    const onVis = () => {
      running = !document.hidden;
      if (running) frame = window.requestAnimationFrame(tick);
      else window.cancelAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="watch-cat relative mb-0 origin-bottom shrink-0 will-change-transform"
    >
      <img
        src={srcFor(pose)}
        alt=""
        draggable={false}
        className="pointer-events-none relative z-[1] h-[6.8rem] w-auto select-none object-contain object-bottom sm:h-[9.2rem] lg:h-[11.5rem]"
      />
      <span className="pointer-events-none absolute bottom-[2%] left-1/2 z-0 h-[12%] w-[72%] -translate-x-1/2 rounded-[100%] bg-warm-900/30 blur-md" />
    </div>
  );
}
