"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export function BackButton() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push("/#courses");
        }
      }}
      className="btn-secondary h-12 px-8 text-base"
    >
      <ArrowLeft className="size-4" />
      {t("cta.back")}
    </button>
  );
}
