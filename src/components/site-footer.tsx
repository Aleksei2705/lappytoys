import Link from "next/link";
import { ArrowUp, MessageCircle } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { navLinks, site } from "@/data/site";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-100/80 bg-white/50 py-14 backdrop-blur-md">
      <div className="container-main">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="inline-flex min-w-0 items-center gap-2.5 sm:gap-3">
              <SiteLogo />
            </Link>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-warm-500">{site.tagline}</p>
            <a
              href={`tel:${site.phone}`}
              className="mt-4 inline-block font-semibold text-brand-700 transition-colors hover:text-brand-800"
            >
              {site.phoneDisplay}
            </a>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={site.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex size-11 items-center justify-center rounded-full border border-cream-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50"
              >
                <MessageCircle className="size-5 text-sky-600" />
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex size-11 items-center justify-center rounded-full border border-cream-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50"
              >
                <WhatsAppIcon />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-11 items-center justify-center rounded-full border border-cream-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          <nav className="grid grid-cols-2 items-start gap-x-10 gap-y-3 sm:grid-cols-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-warm-500 transition-colors hover:text-brand-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/#top"
            className="flex size-11 items-center justify-center self-start rounded-full border border-cream-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-50"
            aria-label="Наверх"
          >
            <ArrowUp className="size-4 text-brand-700" />
          </Link>
        </div>

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-cream-200 to-transparent" />

        <p className="text-center text-sm text-warm-500">
          © {new Date().getFullYear()} {site.name}. Семей, Казахстан.
        </p>
      </div>
    </footer>
  );
}
