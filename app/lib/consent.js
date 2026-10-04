"use client";

import { useSyncExternalStore } from "react";

// Privacy choices for the optional third-party features:
//   maps - the embedded Google Map (Google sets its own cookies)
//   chat - the AI assistant (messages are sent to Google Gemini)
// Stored in localStorage, never sent to our server. Bump STORAGE_KEY's version
// if the categories change so everyone is asked again.
const STORAGE_KEY = "ams-consent-v1";
const OPEN_EVENT = "ams:open-consent";

const listeners = new Set();
let cached; // undefined = not read yet, null = no decision made

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function getSnapshot() {
  if (cached === undefined) cached = read();
  return cached;
}

function subscribe(listener) {
  listeners.add(listener);

  // Keep other open tabs in sync.
  const onStorage = (e) => {
    if (e.key !== STORAGE_KEY) return;
    cached = read();
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function saveConsent({ maps, chat }) {
  cached = {
    maps: Boolean(maps),
    chat: Boolean(chat),
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // Private mode / blocked storage: the choice still applies to this page view.
  }
  listeners.forEach((listener) => listener());
}

// Grants a single category without touching the others (e.g. "Show map").
export function grantConsent(category) {
  const current = getSnapshot() ?? { maps: false, chat: false };
  saveConsent({ ...current, [category]: true });
}

// null until the visitor has chosen (and always null during SSR/hydration).
export function useConsent() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export const CONSENT_OPEN_EVENT = OPEN_EVENT;
