export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/room.jpg)" }}
      />
      <div className="absolute inset-0 bg-[#fdf8f9]/78" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-200/35 via-transparent to-accent-200/30" />
    </div>
  );
}
