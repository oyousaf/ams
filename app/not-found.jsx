import Link from "next/link";
import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/carMeta";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-lg space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-400">
          404 · Wrong turn
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          This page has left the forecourt
        </h1>
        <p className="text-lg text-white/80">
          The page or car you&apos;re looking for may have been sold or moved.
          Have a look at what&apos;s in stock now.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/#cars"
            className="surface-primary rounded-full px-7 py-3.5 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            View our cars
          </Link>
          <a
            href={`tel:${PHONE_E164}`}
            className="rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </main>
  );
}
