"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { socialLinks } from "../constants";
import EnquiryForm from "./EnquiryForm";
import { useConsent, grantConsent, openConsentSettings } from "@/lib/consent";
import { useHasMounted } from "@/lib/useHasMounted";
import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/carMeta";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d631.5462629097879!2d-1.6783367301941519!3d53.70835050988343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bdf983824d755%3A0x1ccbf3963f34d05a!2sAce%20Motor%20Sales!5e0!3m2!1sen!2suk!4v1729510614154!5m2!1sen!2suk";

// Opening Google Maps in a new tab needs no consent - nothing loads on our page.
const MAP_LINK_URL =
  "https://www.google.com/maps/search/?api=1&query=Ace+Motor+Sales+4+Westgate+Heckmondwike+WF16+0EH";

const mapBox = "w-full h-100 md:h-112.5 rounded-xl";

// The Google embed sets third-party cookies, so it only loads once the visitor
// has allowed it (from the cookie jar, or the button on this placeholder).
function LocationMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const mounted = useHasMounted();
  const consent = useConsent();

  if (!mounted || !inView) {
    return <div ref={ref} className={`${mapBox} bg-black/20 animate-pulse`} />;
  }

  if (consent?.maps) {
    return (
      <iframe
        title="Map showing Ace Motor Sales at 4 Westgate, Heckmondwike"
        src={MAP_EMBED_URL}
        className={`${mapBox} shadow-lg`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ border: 0 }}
        allowFullScreen
      />
    );
  }

  return (
    <div
      className={`${mapBox} flex flex-col items-center justify-center gap-5 border border-white/10 bg-black/25 p-8 text-center`}
    >
      <span className="surface-primary grid h-16 w-16 place-items-center rounded-full">
        <FaMapMarkerAlt className="text-2xl text-white" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xl font-semibold text-white">Find us on Westgate</p>
        <p className="mt-1 text-white/80">4 Westgate, Heckmondwike, WF16 0EH</p>
      </div>
      <p className="max-w-xs text-sm text-white/70">
        The interactive map is provided by Google, which sets its own cookies.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => grantConsent("maps")}
          className="rounded-full bg-linear-to-r from-rose-600 to-rose-500 px-5 py-2.5 font-semibold text-white shadow-lg transition-shadow hover:shadow-[0_0_25px_rgba(244,63,94,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          Show interactive map
        </button>
        <a
          href={MAP_LINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/25 bg-white/5 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Open in Google Maps
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

const Footer = () => {
  return (
    <footer id="contact" className="py-28 px-4 lg:px-8 text-white relative">
      <div className="space-y-20">
        {/* Heading */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
            Let&apos;s Get You Moving
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Get in Touch
          </h2>
        </motion.div>

        {/* Main Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            max-w-7xl mx-auto rounded-2xl p-6 md:p-10
            surface-primary shadow-2xl
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <LocationMap />
            </motion.div>

            {/* Enquiry */}
            <div className="flex justify-center">
              <EnquiryForm />
            </div>
          </div>
        </motion.div>

        {/* Footer Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="
            max-w-4xl mx-auto rounded-xl px-6 py-8
            surface-primary
            text-center space-y-4
          "
        >
          <p className="text-2xl font-semibold">Ace Motor Sales</p>

          <address className="not-italic text-white/85">
            4 Westgate, Heckmondwike, West Yorkshire, WF16 0EH
          </address>

          <p className="text-white/80">
            Keys in the ignition from 9am to 8pm, every day. Cruise on in
            anytime.
          </p>

          <a
            href={`tel:${PHONE_E164}`}
            aria-label={`Call Ace Motor Sales on ${PHONE_DISPLAY}`}
            className="
              inline-block text-3xl font-bold
              text-rose-300 hover:text-rose-200 transition
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-rose-300/50
            "
          >
            {PHONE_DISPLAY}
          </a>

          <div className="flex justify-center gap-5 pt-3">
            {socialLinks.map(({ id, href, icon, name, external }) => (
              <motion.a
                key={id}
                href={href}
                {...(external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                aria-label={external ? `${name} (opens in a new tab)` : name}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="rounded text-2xl text-white/80 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                {icon}
              </motion.a>
            ))}
          </div>

          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-sm text-white/75"
          >
            <Link
              href="/privacy"
              className="underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 rounded"
            >
              Privacy policy
            </Link>
            <button
              type="button"
              onClick={openConsentSettings}
              className="underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 rounded"
            >
              Cookie settings
            </button>
            <span>&copy; {new Date().getFullYear()} Ace Motor Sales</span>
          </nav>
        </motion.div>

        {/* Signature */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-lg md:text-xl leading-tight text-white/70 text-center">
          <span>Built with</span>

          <motion.span
            aria-hidden
            className="inline-block leading-none"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
          >
            💚
          </motion.span>

          <span>
            by{" "}
            <a
              href="https://legxcysol.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/80 hover:text-white transition"
            >
              Legxcy Solutions
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
