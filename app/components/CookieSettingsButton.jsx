"use client";

import { openConsentSettings } from "@/lib/consent";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="surface-primary rounded-full px-6 py-3 text-base font-semibold text-white transition hover:shadow-[0_0_25px_rgba(244,63,94,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
    >
      Open cookie settings
    </button>
  );
}
