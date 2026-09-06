"use client";

import { trackGoal } from "@/lib/metrika";
import { site } from "@/data/site";
import { ContactIconFrame, WhatsAppContactIcon } from "@/components/contact-icons";

export function WhatsAppContactCard() {
  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="contact-card"
      onClick={() => trackGoal("contact_whatsapp")}
    >
      <ContactIconFrame>
        <WhatsAppContactIcon />
      </ContactIconFrame>
      <div>
        <p className="text-sm text-warm-500">WhatsApp</p>
        <p className="font-semibold text-warm-900">{site.phoneDisplay}</p>
      </div>
    </a>
  );
}
