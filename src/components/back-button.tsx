"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

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
      Назад
    </button>
  );
}
