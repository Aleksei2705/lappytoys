import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { SiteBackground } from "@/components/site-background";
import { site } from "@/data/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — уроки вязания, макраме и рукоделия в Семее`,
    template: `%s — ${site.name}`,
  },
  description:
    "Творческая студия lappy.art в Семее: уроки вязания крючком и спицами, макраме, вышивка, бисероплетение, шитьё игрушек. Занятия с Ольгой — с нуля, спокойно и с поддержкой. Пробный урок и мастер-классы.",
  keywords: [
    "Вязание крючком",
    "Вязание спицами",
    "Амигуруми",
    "Вышивка крестиком",
    "Рукоделие",
    "Мастерклассы",
    "уроки вязания Семей",
    "вязание крючком Семей",
    "вязание спицами Семей",
    "макраме Семей",
    "вышивка Семей",
    "бисероплетение Семей",
    "шитьё игрушек Семей",
    "рукоделие Семей",
    "творческая студия Семей",
    "lappy.art",
    "lappytoys",
    "мастер-класс вязание",
    "уроки рукоделия Казахстан",
    "амигуруми Семей",
  ],
  authors: [{ name: "Ольга Лаптева" }],
  creator: "lappy.art",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: `${site.name} — уроки вязания и рукоделия в Семее`,
    description:
      "Научитесь вязать, плести макраме и создавать игрушки с Ольгой. Занятия в Семее — с нуля и с удовольствием.",
    url: site.url,
    siteName: site.name,
    locale: "ru_KZ",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${site.name} — уроки вязания и рукоделия в Семее`,
    description:
      "Вязание, макраме, вышивка и шитьё игрушек в Семее. Запись на занятия с Ольгой.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  alternateName: "lappy.art",
  description: site.tagline,
  url: site.url,
  telephone: site.phone,
  image: `${site.url}/images/logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressCountry: "KZ",
  },
  areaServed: {
    "@type": "City",
    name: site.city,
  },
  sameAs: [site.instagram, site.telegram],
  priceRange: "₸₸",
  teaches: [
    "Вязание крючком",
    "Вязание спицами",
    "Макраме",
    "Вышивка",
    "Бисероплетение",
    "Шитьё игрушек",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <Script src="/metrica.js" strategy="beforeInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full font-sans">
        <SiteBackground />
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${site.yandexMetricaId}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
