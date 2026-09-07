import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PrivacyPageContent } from "@/components/privacy-page-content";
import { site } from "@/data/site";

export const metadata = {
  title: "Политика обработки персональных данных",
  description: `Как ${site.name} обрабатывает контактные данные заявок и отзывов.`,
};

export default function PrivacyPage() {
  return (
    <div>
      <SiteHeader />
      <main className="page-section">
        <PrivacyPageContent />
      </main>
      <SiteFooter />
    </div>
  );
}
