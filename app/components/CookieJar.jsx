"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  useConsent,
  saveConsent,
  CONSENT_OPEN_EVENT,
} from "@/lib/consent";
import { useHasMounted } from "@/lib/useHasMounted";

const categories = [
  {
    key: "maps",
    title: "Google Maps",
    description:
      "Shows our interactive location map. Google may set cookies when it loads.",
  },
  {
    key: "chat",
    title: "AI chat assistant",
    description:
      "Sends your chat messages to Google Gemini so AMS can reply. Please don't share personal details in chat.",
  },
];

// Cookie positions inside the jar, filled bottom-up. The first one is the
// "essentials" cookie and is always there.
const cookieSlots = [
  { cx: 24, cy: 58 },
  { cx: 40, cy: 57 },
  { cx: 32, cy: 45 },
];

function Cookie({ cx, cy }) {
  return (
    <motion.g
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
    >
      <circle cx={cx} cy={cy} r="7.5" fill="#d9a066" stroke="#a16207" strokeWidth="1.2" />
      <circle cx={cx - 2.5} cy={cy - 2} r="1.3" fill="#4a2511" />
      <circle cx={cx + 2.8} cy={cy - 1} r="1.1" fill="#4a2511" />
      <circle cx={cx - 0.5} cy={cy + 3} r="1.2" fill="#4a2511" />
    </motion.g>
  );
}

function JarIllustration({ count, lidOpen }) {
  return (
    <svg
      viewBox="0 0 64 76"
      className="h-20 w-16 shrink-0 overflow-visible drop-shadow-[0_6px_18px_rgba(244,63,94,0.35)]"
      aria-hidden="true"
    >
      {/* Lid hinges on its left edge */}
      <motion.g
        style={{ originX: 0, originY: 1 }}
        animate={{ rotate: lidOpen ? -24 : 0, y: lidOpen ? -3 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
      >
        <rect x="8" y="9" width="48" height="9" rx="3.5" fill="#be123c" />
        <rect x="26" y="4" width="12" height="6" rx="2.5" fill="#9f1239" />
        <rect x="8" y="15" width="48" height="3" rx="1.5" fill="#881337" />
      </motion.g>

      {/* Glass */}
      <path
        d="M12 20 h40 a4 4 0 0 1 4 4 v42 a8 8 0 0 1 -8 8 h-32 a8 8 0 0 1 -8 -8 v-42 a4 4 0 0 1 4 -4 z"
        fill="rgba(255,255,255,0.07)"
        stroke="#fda4af"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      />

      <AnimatePresence>
        {cookieSlots.slice(0, count).map((slot) => (
          <Cookie key={`${slot.cx}-${slot.cy}`} {...slot} />
        ))}
      </AnimatePresence>

      {/* Label + glass shine */}
      <rect x="20" y="27" width="24" height="9" rx="2" fill="#fff1f2" fillOpacity="0.9" />
      <text
        x="32"
        y="34"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="800"
        fill="#9f1239"
        fontFamily="inherit"
      >
        AMS
      </text>
      <path
        d="M15 26 v34"
        stroke="#fff"
        strokeOpacity="0.25"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Switch({ checked, onChange, labelId, descriptionId }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
        checked
          ? "border-rose-400 bg-rose-600"
          : "border-white/25 bg-white/10"
      }`}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 h-5.5 w-5.5 rounded-full bg-white shadow"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export default function CookieJar() {
  const mounted = useHasMounted();
  const consent = useConsent();
  const baseId = useId();

  const [reopened, setReopened] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({ maps: false, chat: false });
  const headingRef = useRef(null);
  const openerRef = useRef(null);

  const visible = mounted && (consent === null || reopened);

  /* "Cookie settings" links anywhere on the site reopen the jar */
  useEffect(() => {
    const onOpen = () => {
      openerRef.current = document.activeElement;
      setDraft({
        maps: Boolean(consent?.maps),
        chat: Boolean(consent?.chat),
      });
      setExpanded(true);
      setReopened(true);
      // Wait a frame for the panel to render, then move focus into it.
      requestAnimationFrame(() => headingRef.current?.focus());
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, [consent]);

  const finish = (choice) => {
    saveConsent(choice);
    setReopened(false);
    setExpanded(false);
    const opener = openerRef.current;
    openerRef.current = null;
    opener?.focus?.();
  };

  /* Escape only dismisses once a choice already exists */
  useEffect(() => {
    if (!visible || consent === null) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setReopened(false);
      setExpanded(false);
      openerRef.current?.focus?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, consent]);

  const cookieCount = expanded
    ? 1 + Number(draft.maps) + Number(draft.chat)
    : 1 + Number(Boolean(consent?.maps)) + Number(Boolean(consent?.chat));

  const headingId = `${baseId}-heading`;

  const buttonBase =
    "whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900";
  const secondary = `${buttonBase} border border-white/20 text-white hover:bg-white/10`;
  const primary = `${buttonBase} surface-primary text-white hover:shadow-[0_0_25px_rgba(244,63,94,0.45)]`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          role="dialog"
          aria-modal="false"
          aria-labelledby={headingId}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-4 bottom-4 z-80 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-900/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-120"
        >
          <div className="flex gap-4">
            <JarIllustration count={cookieCount} lidOpen={expanded} />

            <div className="min-w-0">
              <h2
                id={headingId}
                ref={headingRef}
                tabIndex={-1}
                className="text-lg font-bold tracking-tight focus:outline-none"
              >
                The cookie jar
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-white/80">
                We keep ours nearly empty. Our visitor stats are anonymous and
                cookie-free. The optional extras use Google, so they stay off
                until you say so.{" "}
                <Link
                  href="/privacy#cookies"
                  className="font-semibold text-rose-300 underline underline-offset-2 hover:text-rose-200"
                >
                  Privacy policy
                </Link>
              </p>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-4 space-y-2 overflow-hidden"
              >
                <li className="flex items-start justify-between gap-4 rounded-2xl bg-white/5 p-3">
                  <div>
                    <p className="text-sm font-semibold">Essentials</p>
                    <p className="text-xs leading-relaxed text-white/75">
                      Remembers the choices you make here. Always on.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/85">
                    Always on
                  </span>
                </li>

                {categories.map(({ key, title, description }) => (
                  <li
                    key={key}
                    className="flex items-start justify-between gap-4 rounded-2xl bg-white/5 p-3"
                  >
                    <div>
                      <p id={`${baseId}-${key}`} className="text-sm font-semibold">
                        {title}
                      </p>
                      <p
                        id={`${baseId}-${key}-desc`}
                        className="text-xs leading-relaxed text-white/75"
                      >
                        {description}
                      </p>
                    </div>
                    <Switch
                      checked={draft[key]}
                      onChange={(value) =>
                        setDraft((prev) => ({ ...prev, [key]: value }))
                      }
                      labelId={`${baseId}-${key}`}
                      descriptionId={`${baseId}-${key}-desc`}
                    />
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* Accept and reject are equally prominent (ICO guidance) */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              className={secondary}
              onClick={() => finish({ maps: false, chat: false })}
            >
              Essentials only
            </button>

            {expanded ? (
              <button
                type="button"
                className={secondary}
                onClick={() => finish(draft)}
              >
                Save choices
              </button>
            ) : (
              <button
                type="button"
                className={secondary}
                onClick={() => {
                  setDraft({
                    maps: Boolean(consent?.maps),
                    chat: Boolean(consent?.chat),
                  });
                  setExpanded(true);
                }}
              >
                Choose
              </button>
            )}

            <button
              type="button"
              className={`${primary} col-span-2 sm:col-span-1`}
              onClick={() => finish({ maps: true, chat: true })}
            >
              Accept all
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
