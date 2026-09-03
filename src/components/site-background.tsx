export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cream">
      {/* Soft studio wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-100/70 via-cream to-accent-100/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(222,134,168,0.18),transparent_50%),radial-gradient(ellipse_at_85%_20%,rgba(176,125,154,0.14),transparent_45%),radial-gradient(ellipse_at_50%_90%,rgba(248,207,224,0.35),transparent_55%)]" />

      {/* Knit-like mesh */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
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

      {/* Paper grain */}
      <div className="atmosphere-grain absolute inset-0 opacity-[0.35] mix-blend-multiply" />

      {/* Floating light — window glow */}
      <div className="atmosphere-blob atmosphere-blob-a absolute -left-24 top-[8%] size-[28rem] rounded-full bg-brand-200/40 blur-3xl" />
      <div className="atmosphere-blob atmosphere-blob-b absolute -right-20 top-[35%] size-[22rem] rounded-full bg-accent-200/45 blur-3xl" />
      <div className="atmosphere-blob atmosphere-blob-c absolute bottom-[-8%] left-[30%] size-[26rem] rounded-full bg-brand-100/55 blur-3xl" />
    </div>
  );
}
