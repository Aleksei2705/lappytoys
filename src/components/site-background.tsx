export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-cream">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-100/60 via-cream to-accent-100/50" />
    </div>
  );
}
