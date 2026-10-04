import Link from "next/link";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/carMeta";

export const metadata = {
  title: "Privacy & Cookies",
  description:
    "How Ace Motor Sales collects, uses and protects your personal information, and the cookies and third-party services our website uses.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "4 October 2026";
const EMAIL = "acemotorslimited@hotmail.com";

function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="space-y-4">
      <h2 id={`${id}-heading`} className="text-2xl font-bold text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

const link = "font-semibold text-rose-300 underline underline-offset-2 hover:text-rose-200";

export default function PrivacyPage() {
  return (
    <div className="px-4 pb-8 pt-36 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-12 text-lg leading-relaxed text-white/85">
        <header className="space-y-3">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
            Your data, plainly explained
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Privacy &amp; Cookies
          </h1>
          <p className="text-base text-white/70">Last updated {LAST_UPDATED}</p>
        </header>

        <Section id="who-we-are" title="Who we are">
          <p>
            This website is run by Ace Motor Sales, 4 Westgate, Heckmondwike,
            West Yorkshire, WF16 0EH. We are the data controller for personal
            information collected through this site. You can contact us about
            privacy at{" "}
            <a href={`mailto:${EMAIL}`} className={link}>
              {EMAIL}
            </a>{" "}
            or on{" "}
            <a href={`tel:${PHONE_E164}`} className={link}>
              {PHONE_DISPLAY}
            </a>
            .
          </p>
        </Section>

        <Section id="enquiries" title="Enquiry form">
          <p>
            When you send an enquiry we collect your name, email address, phone
            number and message. We use them only to reply to you and, if you go
            on to buy, to handle that sale. Our lawful basis is taking steps at
            your request before entering into a contract, and our legitimate
            interest in answering customer questions.
          </p>
          <p>
            Messages are delivered to our inbox by EmailJS, an email delivery
            service. We don&apos;t use your details for marketing unless you
            ask us to, and we don&apos;t sell them to anyone.
          </p>
        </Section>

        <Section id="ai-chat" title="AI chat assistant">
          <p>
            Our chat assistant, AMS, is powered by Google&apos;s Gemini AI. It
            only starts once you agree. What you type, along with the earlier
            messages in that conversation, is sent to Google to generate a
            reply. We don&apos;t store chat conversations on our own systems.
          </p>
          <p>
            Please don&apos;t share personal details such as your address,
            registration number or bank information in the chat. AMS gives
            general guidance only and can make mistakes, so always confirm
            anything important with our team.
          </p>
        </Section>

        <Section id="cookies" title="Cookies and similar technologies">
          <p>We keep these to a minimum:</p>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              <strong className="text-white">Essentials (always on).</strong>{" "}
              Your cookie choices are saved in your browser&apos;s local storage
              so we don&apos;t ask again. Staff who sign in to our stock
              dashboard get a sign-in cookie.
            </li>
            <li>
              <strong className="text-white">Visitor statistics.</strong> We use
              Vercel Web Analytics and Speed Insights to count visits and check
              page speed. They don&apos;t use cookies and don&apos;t identify
              you.
            </li>
            <li>
              <strong className="text-white">Google Maps (optional).</strong>{" "}
              Our interactive map only loads if you allow it. Google may then
              set its own cookies, covered by{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                Google&apos;s privacy policy
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </li>
            <li>
              <strong className="text-white">AI chat (optional).</strong> See
              the section above.
            </li>
          </ul>
          <p>You can change your choices at any time.</p>
          <CookieSettingsButton />
        </Section>

        <Section id="sharing" title="Who we share information with">
          <p>
            Only the service providers that run this website for us: Vercel
            (hosting and anonymous statistics), EmailJS (enquiry delivery) and
            Google (maps and the AI assistant, if you turn them on). Some of
            these providers may process data outside the UK under recognised
            safeguards such as the UK International Data Transfer Agreement.
          </p>
        </Section>

        <Section id="retention" title="How long we keep it">
          <p>
            We keep enquiries for as long as we need them to deal with your
            request. If you buy a car from us, we keep sale records for as long
            as the law requires, such as for tax and consumer-rights purposes.
          </p>
        </Section>

        <Section id="rights" title="Your rights">
          <p>
            Under UK data protection law you can ask for a copy of your
            information, ask us to correct or delete it, or object to how we
            use it. Contact us using the details above. If you&apos;re unhappy
            with how we handle your data, you can complain to the{" "}
            <a
              href="https://ico.org.uk/make-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              Information Commissioner&apos;s Office
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </Section>

        <p className="text-base">
          <Link href="/" className={link}>
            Back to the homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
