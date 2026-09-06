declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

const METRIKA_ID = 112086282;

/** Yandex Metrika goal — create the same name in Metrika → Goals. */
export function trackGoal(name: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined" || typeof window.ym !== "function") return;
  try {
    if (params) {
      window.ym(METRIKA_ID, "reachGoal", name, params);
    } else {
      window.ym(METRIKA_ID, "reachGoal", name);
    }
  } catch {
    // ignore
  }
}
