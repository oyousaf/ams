import { FaChevronDown } from "react-icons/fa";
import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/carMeta";

// Server-rendered on purpose: plain HTML answers that search engines and AI
// answer engines can read. Only state what the business actually offers -
// update these whenever terms change.
const faqs = [
  {
    q: "Can I reserve a car before viewing it?",
    a: "Yes. A £99 deposit reserves any car on the forecourt while you arrange a viewing, test drive or finance.",
  },
  {
    q: "Do you deliver outside West Yorkshire?",
    a: "Yes, we deliver nationwide across the UK. Ask us for a delivery quote when you enquire.",
  },
  {
    q: "Are your cars inspected before sale?",
    a: "Every vehicle is inspected and prepared before it goes on sale, and our cars are sold with a warranty for extra peace of mind.",
  },
  {
    q: "Do you offer finance or take part-exchanges?",
    a: "Yes. We can help with finance options, take your current car in part-exchange, or buy it from you outright.",
  },
  {
    q: "When can I visit?",
    a: "We're at 4 Westgate, Heckmondwike, WF16 0EH, open 9am to 8pm every day. Viewings and test drives are by arrangement, so give us a call first.",
  },
];

export default function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="px-4 pb-8 pt-8 sm:px-6 md:px-8"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
          Good To Know
        </span>
        <h2
          id="faq-heading"
          className="text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-2xl border border-white/10 bg-white/4 transition-colors open:border-rose-500/40 open:bg-white/6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left text-lg font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 [&::-webkit-details-marker]:hidden">
              {q}
              <FaChevronDown
                aria-hidden="true"
                className="shrink-0 text-sm text-rose-300 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <p className="px-6 pb-5 text-base leading-relaxed text-white/80">
              {a}
            </p>
          </details>
        ))}

        <p className="pt-4 text-center text-white/75">
          Something else?{" "}
          <a
            href={`tel:${PHONE_E164}`}
            className="font-semibold text-rose-300 underline underline-offset-4 hover:text-rose-200"
          >
            Call {PHONE_DISPLAY}
          </a>{" "}
          or{" "}
          <a
            href="#contact"
            className="font-semibold text-rose-300 underline underline-offset-4 hover:text-rose-200"
          >
            send us a message
          </a>
          .
        </p>
      </div>
    </section>
  );
}
