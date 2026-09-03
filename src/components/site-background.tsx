import Image from "next/image";

export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cream">
      <Image
        src="/images/home-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover object-[38%_48%] scale-105"
        sizes="100vw"
        quality={85}
      />

      {/* Soft veil so text stays readable */}
      <div className="absolute inset-0 bg-cream/70" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/75 via-cream/45 to-accent-100/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(253,248,249,0.55),transparent_55%),radial-gradient(ellipse_at_80%_90%,rgba(252,231,239,0.4),transparent_50%)]" />

      {/* Light knit mesh */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="knit-mesh" width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M4 14c3-5 7-5 10 0s7 5 10 0M4 14c3 5 7 5 10 0s7-5 10 0"
              fill="none"
              stroke="#c45c85"
              strokeWidth="0.7"
              strokeLinecap="round"
              opacity="0.45"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#knit-mesh)" />
      </svg>

      <div className="atmosphere-grain absolute inset-0 opacity-[0.2] mix-blend-multiply" />
    </div>
  );
}
