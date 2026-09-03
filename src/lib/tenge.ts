const TENGE = "₸";
const FALLBACK = "тг";
const MISSING_PROBE = "\uFFFE";

function drawGlyph(
  ctx: CanvasRenderingContext2D,
  char: string,
  font: string,
): Uint8ClampedArray {
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = "#000000";
  ctx.font = font;
  ctx.textBaseline = "top";
  ctx.fillText(char, 8, 8);
  return ctx.getImageData(0, 0, 64, 64).data;
}

function samePixels(a: Uint8ClampedArray, b: Uint8ClampedArray): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/** True if the browser draws a real tenge glyph, not a missing-character box. */
export function canRenderTenge(font = "32px sans-serif"): boolean {
  if (typeof document === "undefined") return true;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return true;

    const tenge = drawGlyph(ctx, TENGE, font);
    const missing = drawGlyph(ctx, MISSING_PROBE, font);
    return !samePixels(tenge, missing);
  } catch {
    return true;
  }
}

export function withCurrencyFallback(text: string, useTenge: boolean): string {
  return useTenge ? text : text.replaceAll(TENGE, FALLBACK);
}
