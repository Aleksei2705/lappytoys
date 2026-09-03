"use client";

import { useEffect, useState } from "react";
import { canRenderTenge, withCurrencyFallback } from "@/lib/tenge";

type PriceTextProps = {
  children: string;
  className?: string;
  as?: "span" | "p";
};

export function PriceText({ children, className, as: Tag = "span" }: PriceTextProps) {
  const [text, setText] = useState(children);

  useEffect(() => {
    const font = getComputedStyle(document.body).fontFamily || "sans-serif";
    const ok = canRenderTenge(`32px ${font}`);
    setText(withCurrencyFallback(children, ok));
  }, [children]);

  return <Tag className={className}>{text}</Tag>;
}
