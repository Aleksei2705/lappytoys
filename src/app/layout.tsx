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
  title: `${site.name} — уроки вязания тет-а-тет с Ольгой`,
  description:
    "Уроки вязания крючком и спицами в Семее. Индивидуальные занятия, мастер-классы, пробный урок. Запись, Казахстан.",
  keywords: [
    "уроки вязания",
    "вязание крючком",
    "вязание спицами",
    "мастер-класс",
    "Семей",
  ],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: `${site.name} — уроки вязания тет-а-тет`,
    description: "Научитесь вязать спокойно и с удовольствием с преподавателем Ольгой.",
    locale: "ru_KZ",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
