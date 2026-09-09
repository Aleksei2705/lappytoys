"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

const PREVIEW_COUNT = 3;
const aboutKeys = ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"] as const;

export function AboutCopy() {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const visibleKeys = expanded ? aboutKeys : aboutKeys.slice(0, PREVIEW_COUNT);

  return (
    <div className="flex flex-col items-center space-y-4 text-base leading-relaxed text-warm-500">
      {visibleKeys.map((key) => (
        <p key={key} className="w-full">
          {t(`about.${key}`)}
        </p>
      ))}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="btn-secondary mx-auto h-11 px-6"
        aria-expanded={expanded}
      >
        {expanded ? (
          <>
            <ChevronUp className="size-4" />
            {t("cta.hide")}
          </>
        ) : (
          <>
            <ChevronDown className="size-4" />
            {t("cta.readMore")}
          </>
        )}
      </button>
    </div>
  );
}
