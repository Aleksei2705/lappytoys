import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { SiteBackground } from "@/components/site-background";
import { HashScroll } from "@/components/hash-scroll";
import { Metrika } from "@/components/metrika";
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
    "Творчество в Семее: творческая студия Lappy Art — уроки вязания крючком и спицами, макраме, вышивка, бисероплетение, шитьё игрушек. Занятия с Ольгой с нуля, пробный урок и мастер-классы.",
  keywords: [
    "творчество Семей",
    "творческая студия Семей",
    "уроки вязания Семей",
    "вязание крючком Семей",
    "вязание спицами Семей",
    "макраме Семей",
    "вышивка Семей",
    "бисероплетение Семей",
    "шитьё игрушек Семей",
    "рукоделие Семей",
    "Lappy Art",
    "lappy.art",
  ],
  authors: [{ name: "Ольга Лаптева" }],
  creator: "Lappy Art",
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
      "Творческие занятия в Семее: вязание, макраме, вышивка и игрушки своими руками. Студия Lappy Art — с нуля и с удовольствием.",
    url: site.url,
    siteName: site.name,
    locale: "ru_KZ",
    type: "website",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: `${site.name} — творчество в Семее`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — творчество и рукоделие в Семее`,
    description:
      "Творческие занятия: вязание, макраме, вышивка и шитьё игрушек в Семее. Запись к Ольге.",
    images: [site.ogImage],
  },
  verification: {
    yandex: site.yandexVerification,
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
  alternateName: ["Lappy Art", "lappy.art", "lappytoys", "Творческая студия Lappy Art"],
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
    latitude: 50.412826,
    longitude: 80.259372,
  },
  hasMap: site.mapLink,
  areaServed: {
    "@type": "City",
    name: site.city,
  },
  sameAs: [site.instagram, site.tiktok, site.telegram, site.telegramGroup],
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if((document.scripts[j].src||"").indexOf("/metrika/tag.js")!==-1){return;}}
k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;
k.onerror=function(){k.src="https://mc.yandex.com/metrika/tag.js"};
if(a&&a.parentNode){a.parentNode.insertBefore(k,a);}else{document.head.appendChild(k);}})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${site.yandexMetricaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full font-sans">
        <SiteBackground />
        <I18nProvider>
          <HashScroll />
          <Metrika />
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
