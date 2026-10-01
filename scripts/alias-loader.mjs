import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { resolve as resolvePath, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = resolvePath(dirname(fileURLToPath(import.meta.url)), "../src");

/** Resolves the "@/..." tsconfig alias to src/*.ts for standalone Node scripts. */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = resolvePath(srcDir, specifier.slice(2));
    const file = [`${base}.ts`, `${base}.tsx`].find((candidate) => existsSync(candidate));
    if (file) return nextResolve(pathToFileURL(file).href, context);
  }
  return nextResolve(specifier, context);
}
