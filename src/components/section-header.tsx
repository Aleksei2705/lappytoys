type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl";

  return (
    <div className={`${alignClass} ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-warm-900 sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-relaxed text-warm-500">{description}</p>}
    </div>
  );
}
