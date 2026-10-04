"use client";

import { useState } from "react";
import Image from "next/image";

// Simple, motion-free gallery for the car detail page: one large photo plus
// labelled thumbnail buttons. No autoplay, so nothing moves on its own.
export default function CarGallery({ images, title, isSold }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-black/30 shadow-xl">
        <Image
          src={images[active]}
          alt={`${title}, photo ${active + 1} of ${images.length}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className={`object-cover ${isSold ? "opacity-60" : ""}`}
        />
        {isSold && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-rose-950/50 text-5xl font-extrabold tracking-widest text-rose-100">
            SOLD
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6" aria-label="Photos">
          {images.map((src, i) => (
            <li key={src + i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-current={i === active ? "true" : undefined}
                className={`relative block aspect-4/3 w-full overflow-hidden rounded-lg ring-2 transition focus-visible:outline-none focus-visible:ring-rose-300 ${
                  i === active
                    ? "ring-rose-400"
                    : "ring-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 25vw, 120px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
