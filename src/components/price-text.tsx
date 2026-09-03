"use client";

type PriceTextProps = {
  children: string;
  className?: string;
  as?: "span" | "p";
};

/** Always shows "тг" — the ₸ glyph is missing on many Android fonts. */
export function PriceText({ children, className, as: Tag = "span" }: PriceTextProps) {
  const text = children.replaceAll("₸", "тг");
  return <Tag className={className}>{text}</Tag>;
}
