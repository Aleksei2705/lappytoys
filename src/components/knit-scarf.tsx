"use client";

import { useEffect, useRef } from "react";

const CRAFTS = [
  "/images/craft-scarf.png?v=1",
  "/images/craft-amigurumi.png?v=1",
  "/images/craft-embroidery.png?v=1",
  "/images/craft-macrame.png?v=1",
  "/images/craft-crochet-toy.png?v=1",
  "/images/craft-beads.png?v=1",
  "/images/craft-hat.png?v=1",
  "/images/craft-amigurumi-bunny.png?v=1",
  "/images/craft-crochet-bag.png?v=1",
  "/images/craft-embroidery-bird.png?v=1",
  "/images/craft-mittens.png?v=1",
  "/images/craft-macrame-hanger.png?v=1",
  "/images/craft-beads-bracelet.png?v=1",
  "/images/craft-sweater.png?v=1",
  "/images/craft-amigurumi-cat.png?v=1",
  "/images/craft-granny-blanket.png?v=1",
  "/images/craft-embroidery-leaves.png?v=1",
  "/images/craft-socks.png?v=1",
  "/images/craft-macrame-bag.png?v=1",
  "/images/craft-beads-pendant.png?v=1",
  "/images/craft-amigurumi-fox.png?v=1",
  "/images/craft-booties.png?v=1",
  "/images/craft-crochet-flower.png?v=1",
  "/images/craft-headband.png?v=1",
];

export function KnitScarf() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const rawCtx = node.getContext("2d", { alpha: true });
    if (!rawCtx) return;
    const canvas: HTMLCanvasElement = node;
    const ctx: CanvasRenderingContext2D = rawCtx;

    const needleSprite = new Image();
    needleSprite.src = "/images/knit-needle.png?v=2";
    let needleReady = false;
    needleSprite
      .decode()
      .then(() => {
        needleReady = true;
      })
      .catch(() => {
        needleReady = needleSprite.naturalWidth > 0;
      });

    const craftImgs = CRAFTS.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    let craftsReady = 0;
    craftImgs.forEach((img) => {
      img
        .decode()
        .then(() => {
          craftsReady += 1;
        })
        .catch(() => {
          if (img.naturalWidth > 0) craftsReady += 1;
        });
    });

    let dpr = 1;
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    let last = performance.now();
    let travel = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function hypot(x: number, y: number) {
      return Math.sqrt(x * x + y * y);
    }

    function workPoint() {
      if (width < 768) return { x: 18, y: 6 };
      return { x: 78, y: 54 };
    }

    function drawNeedle(tipX: number, tipY: number, nearX: number, nearY: number) {
      const dx = nearX - tipX;
      const dy = nearY - tipY;
      const len = hypot(dx, dy) || 1;
      const angle = Math.atan2(dy, dx);
      if (!needleReady) return;
      const aspect = needleSprite.naturalHeight / needleSprite.naturalWidth;
      const h = Math.max(9, len * aspect * 1.05);
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(angle);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(needleSprite, 0, -h / 2, len, h);
      ctx.restore();
    }

    function withYarn(widthY: number, draw: () => void) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(110, 62, 72, 0.45)";
      ctx.lineWidth = widthY + 2;
      draw();
      ctx.stroke();
      ctx.strokeStyle = "#c48b8f";
      ctx.lineWidth = widthY;
      draw();
      ctx.stroke();
      ctx.strokeStyle = "rgba(236, 214, 214, 0.65)";
      ctx.lineWidth = Math.max(0.8, widthY * 0.28);
      draw();
      ctx.stroke();
    }

    function drawHeldLoops(
      tipX: number,
      tipY: number,
      nearX: number,
      nearY: number,
      pump: number,
      pass: "back" | "front",
    ) {
      const dx = nearX - tipX;
      const dy = nearY - tipY;
      for (let i = 0; i < 5; i++) {
        const u = 0.04 + i * 0.05;
        const x = tipX + dx * u;
        const y = tipY + dy * u;
        const rx = 3.6 + (4 - i) * 0.18;
        const ry = 5.8 + pump * 0.7;
        const rot = Math.atan2(dy, dx) + Math.PI * 0.5;
        withYarn(1.4, () => {
          ctx.beginPath();
          if (pass === "back") ctx.ellipse(x, y, rx, ry, rot, Math.PI, 0, true);
          else ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI, false);
        });
      }
    }

    function craftLayout() {
      const itemH = width < 768 ? 31 : 43;
      const gap = width < 768 ? 14 : 20;
      const items = craftImgs.map((img) => {
        const nw = img.naturalWidth || 1;
        const nh = img.naturalHeight || 1;
        const h = itemH;
        const w = (nw / nh) * h;
        return { img, w, h };
      });
      const loopW = items.reduce((sum, it) => sum + it.w + gap, 0);
      return { items, gap, loopW, itemH };
    }

    function drawCrafts(oy: number) {
      if (craftsReady < craftImgs.length) return;
      const { items, gap, loopW, itemH } = craftLayout();
      if (loopW <= 0) return;

      const firstW = items[0]?.w ?? 0;
      const destX = 0;
      const destY = width < 768 ? 2 : Math.max(8, oy - itemH * 0.72);
      const destW = width;
      const shift = ((travel % loopW) + loopW) % loopW;
      const fadeW = width < 768 ? 96 : 120;

      ctx.save();
      ctx.beginPath();
      ctx.rect(destX, destY - 6, destW, itemH + 12);
      ctx.clip();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      let x = destX - firstW + shift - loopW;
      while (x < destX + destW) {
        for (const item of items) {
          const shown = x + item.w - destX;
          if (shown > 0 && x < destX + destW) {
            const t = Math.min(1, Math.max(0, shown / Math.max(90, item.w * 2)));
            const fade = t * t * (3 - 2 * t);
            ctx.globalAlpha = fade;
            ctx.drawImage(item.img, x, destY, item.w, item.h);
            ctx.globalAlpha = 1;
          }
          x += item.w + gap;
        }
      }

      const veil = ctx.createLinearGradient(destX, 0, destX + fadeW, 0);
      veil.addColorStop(0, "rgba(0,0,0,0)");
      veil.addColorStop(0.4, "rgba(0,0,0,0.2)");
      veil.addColorStop(0.75, "rgba(0,0,0,0.7)");
      veil.addColorStop(1, "rgba(0,0,0,1)");
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = veil;
      ctx.fillRect(destX, destY - 6, destW, itemH + 12);
      ctx.restore();
    }

    function tick(now: number) {
      if (!running) return;
      const dt = Math.min(32, now - last);
      last = now;
      if (craftsReady >= craftImgs.length) {
        travel += dt * 0.016;
      }

      ctx.clearRect(0, 0, width, height);
      const { x, y } = workPoint();
      const pump = Math.sin((now / 420) * Math.PI);
      const mobile = width < 768;
      const n1x = x - (mobile ? 16 : 30) - pump * (mobile ? 2 : 3);
      const n1y = y + (mobile ? 28 : 46) + pump * (mobile ? 1.6 : 2.5);
      const n2x = x + (mobile ? 7 : 9) + pump * (mobile ? 2 : 3);
      const n2y = y + (mobile ? 34 : 54) - pump * (mobile ? 1.4 : 2);

      ctx.save();
      ctx.globalAlpha = 0.94;
      drawCrafts(y);
      drawHeldLoops(x, y, n2x, n2y, pump, "back");
      drawNeedle(x, y, n1x, n1y);
      drawNeedle(x, y, n2x, n2y);
      drawHeldLoops(x, y, n2x, n2y, pump, "front");
      ctx.restore();

      frame = window.requestAnimationFrame(tick);
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      running = true;
      last = performance.now();
      frame = window.requestAnimationFrame(tick);
    }

    function onMotionChange() {
      if (!motion.matches) return;
      running = false;
      window.cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, width, height);
    }

    resize();
    frame = window.requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotionChange);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  );
}
