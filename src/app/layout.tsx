import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { SiteBackground } from "@/components/site-background";
import { I18nProvider } from "@/components/i18n-provider";
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
    default: `${site.name} — творчество, уроки вязания и рукоделия в Семее`,
    template: `%s — ${site.name}`,
  },
  description:
    "Творчество в Семее: творческая студия lappy.art — уроки вязания крючком и спицами, макраме, вышивка, бисероплетение, шитьё игрушек. Занятия с Ольгой с нуля, пробный урок и мастер-классы.",
  keywords: [
    "творчество",
    "творчество Семей",
    "творчество для детей Семей",
    "творчество для взрослых Семей",
    "творческие занятия Семей",
    "творческая студия Семей",
    "творческий кружок Семей",
    "куда пойти на творчество Семей",
    "занятия творчеством Семей",
    "рукоделие и творчество",
    "хобби творчество Семей",
    "handmade Семей",
    "handmade Kazakhstan",
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
    "мастер-класс рукоделие Семей",
    "кружок рукоделия Семей",
    "lappy.art",
    "lappytoys",
    "мастер-класс вязание",
    "уроки рукоделия Казахстан",
    "амигуруми Семей",
    "творчество Казахстан",
    "творческая студия Казахстан",
  ],
  authors: [{ name: "Ольга Лаптева" }],
  creator: "lappy.art",
  category: "Творчество и рукоделие",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/images/logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon-32.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: `${site.name} — творчество и рукоделие в Семее`,
    description:
      "Творческие занятия в Семее: вязание, макраме, вышивка и игрушки своими руками. Студия lappy.art — с нуля и с удовольствием.",
    url: site.url,
    siteName: site.name,
    locale: "ru_KZ",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: `${site.name} — творчество в Семее`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${site.name} — творчество и рукоделие в Семее`,
    description:
      "Творческие занятия: вязание, макраме, вышивка и шитьё игрушек в Семее. Запись к Ольге.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EducationalOrganization"],
  name: site.name,
  alternateName: ["lappy.art", "lappytoys", "Творческая студия lappy.art"],
  description:
    "Творческая студия в Семее: творчество и рукоделие — вязание, макраме, вышивка, бисероплетение, шитьё игрушек. Занятия с нуля для детей и взрослых.",
  url: site.url,
  telephone: site.phone,
  image: `${site.url}/images/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Шугаева 4, каб. 304",
    addressLocality: site.city,
    addressCountry: "KZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.412858,
    longitude: 80.259144,
  },
  hasMap: site.mapLink,
  areaServed: {
    "@type": "City",
    name: site.city,
  },
  sameAs: [site.instagram, site.telegram],
  priceRange: "$$",
  category: "Творчество и рукоделие",
  keywords:
    "творчество, рукоделие, вязание, макраме, вышивка, бисероплетение, амигуруми, Семей",
  knowsAbout: [
    "Творчество",
    "Творческие занятия",
    "Рукоделие",
    "Вязание крючком",
    "Вязание спицами",
    "Макраме",
    "Вышивка",
    "Бисероплетение",
    "Шитьё игрушек",
    "Амигуруми",
    "Мастер-классы",
  ],
  teaches: [
    "Творчество",
    "Вязание крючком",
    "Вязание спицами",
    "Макраме",
    "Вышивка",
    "Бисероплетение",
    "Шитьё игрушек",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Творческие курсы и мастер-классы",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Творчество и рукоделие в Семее",
        itemListElement: [
          { "@type": "Course", name: "Вязание крючком", url: `${site.url}/courses/crochet/` },
          { "@type": "Course", name: "Вязание спицами", url: `${site.url}/courses/needles/` },
          { "@type": "Course", name: "Макраме", url: `${site.url}/courses/macrame/` },
          { "@type": "Course", name: "Вышивка", url: `${site.url}/courses/embroidery/` },
          { "@type": "Course", name: "Бисероплетение", url: `${site.url}/courses/beadwork/` },
          { "@type": "Course", name: "Пробный урок", url: `${site.url}/courses/trial/` },
        ],
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${playfair.variable} h-full antialiased`}
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
        <I18nProvider>
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
        </I18nProvider>
      </body>
    </html>
  );
}
