"use client";

import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/carMeta";

export default function Error({ retry }) {
  return (
    <div className="grid min-h-[70dvh] place-items-center px-6 pt-32 text-center">
      <div role="alert" className="max-w-lg space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Something went wrong
        </h1>
        <p className="text-lg text-white/80">
          Sorry, this page didn&apos;t load properly. Please try again, or call
          us on{" "}
          <a
            href={`tel:${PHONE_E164}`}
            className="font-semibold text-rose-300 underline underline-offset-4"
          >
            {PHONE_DISPLAY}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="surface-primary rounded-full px-7 py-3.5 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
