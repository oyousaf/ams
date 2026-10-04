"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useReducedMotion } from "motion/react";
import {
  FaTimes,
  FaGasPump,
  FaRegCalendarAlt,
  FaCarSide,
  FaShareAlt,
  FaPlay,
  FaPause,
  FaArrowRight,
} from "react-icons/fa";
import { PiEngineFill } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { BiSolidTachometer } from "react-icons/bi";
import Divider from "./Divider";
import { resolveImages } from "@/lib/resolveImage";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { formatPrice } from "@/lib/carMeta";

const AUTOPLAY_MS = 5000;

const overlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.96, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 32 },
  },
  exit: { opacity: 0, scale: 0.94, y: 60 },
};

function preload(src) {
  if (!src) return;
  const img = new window.Image();
  img.src = src;
  img.decode?.().catch(() => {});
}

export default function CarModal({ car, logo, onClose }) {
  const dialogRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const images = useMemo(() => {
    return resolveImages(car.imageUrls);
  }, [car.imageUrls]);

  // Autoplay is allowed (there's always a visible pause control - WCAG 2.2.2)
  // but never starts on its own for people who've asked for reduced motion.
  const [autoplay] = useState(() =>
    Autoplay({
      delay: AUTOPLAY_MS,
      playOnInit: !prefersReducedMotion,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: images.length > 1,
      align: "center",
      containScroll: "trimSnaps",
    },
    [autoplay],
  );

  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused] = useState(Boolean(prefersReducedMotion));

  const userInteracted = useRef(false);

  const pauseAutoplay = useCallback(() => {
    userInteracted.current = true;
    autoplay.stop();
    setPaused(true);
  }, [autoplay]);

  const resumeAutoplay = useCallback(() => {
    autoplay.play();
    autoplay.reset();
    setProgressKey((k) => k + 1);
    setPaused(false);
  }, [autoplay]);

  useEffect(() => {
    if (!emblaApi) return;

    const sync = () => {
      setActive(emblaApi.selectedScrollSnap());
      setProgressKey((k) => k + 1);

      if (userInteracted.current) {
        autoplay.reset();
        userInteracted.current = false;
      }
    };

    sync();

    emblaApi.on("select", sync);
    emblaApi.on("reInit", sync);
    emblaApi.on("pointerDown", pauseAutoplay);

    return () => {
      emblaApi.off("select", sync);
      emblaApi.off("reInit", sync);
      emblaApi.off("pointerDown", pauseAutoplay);
    };
  }, [emblaApi, pauseAutoplay, autoplay]);

  // Warm only the neighbouring photos rather than the whole set at once.
  useEffect(() => {
    if (images.length < 2) return;
    preload(images[(active + 1) % images.length]);
    preload(images[(active - 1 + images.length) % images.length]);
  }, [active, images]);

  const close = useCallback(() => onClose?.(), [onClose]);

  useBodyScrollLock(true);

  // Native modal dialog: focus is moved inside, trapped, and everything
  // behind it becomes inert. Focus goes back to the card when it closes
  // (after the exit animation, when AnimatePresence unmounts us).
  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    if (!dialog.open) dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  const mileage = Number(car.mileage) || 0;

  const formattedMileage =
    mileage >= 1000
      ? `${(mileage / 1000).toFixed(0)}K`
      : mileage.toLocaleString("en-GB");

  const price = formatPrice(car.price);

  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = new URL(car.href, location.origin).toString();
    try {
      if (!navigator.share) throw new Error("Web Share unavailable");
      await navigator.share({
        title: car.title,
        text: `Check out this ${car.title} for ${price}`,
        url,
      });
    } catch (err) {
      if (err?.name === "AbortError") return; // user dismissed the share sheet
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const specs = [
    { label: "Fuel", value: car.engineType, Icon: PiEngineFill },
    { label: "Engine size", value: car.engineSize ? `${car.engineSize}L` : null, Icon: FaGasPump },
    { label: "Gearbox", value: car.transmission, Icon: GiGearStickPattern },
    { label: "Body type", value: car.carType, Icon: FaCarSide },
    { label: "Year", value: car.year || null, Icon: FaRegCalendarAlt },
    { label: "Mileage", value: `${formattedMileage} miles`, Icon: BiSolidTachometer },
  ];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="car-modal-title"
      onCancel={(e) => {
        // Esc: let AnimatePresence play the exit animation, then unmount closes it.
        e.preventDefault();
        close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") emblaApi?.scrollNext();
        if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 text-white backdrop:bg-transparent"
    >
      <motion.div
        className="flex h-full w-full items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        variants={overlay}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <motion.div
          className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl
           bg-linear-to-br from-rose-900 via-rose-800 to-rose-950 text-white shadow-xl"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            autoFocus
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-3 transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            <FaTimes aria-hidden="true" />
          </button>

          <div className="sticky top-0 z-40 bg-linear-to-b from-rose-950/90 to-transparent backdrop-blur px-6 pt-4 pb-4 text-center">
            {logo && (
              <div className="mx-auto mb-2 h-12 w-12" aria-hidden="true">
                {logo}
              </div>
            )}
            <h2
              id="car-modal-title"
              className="text-xl md:text-2xl font-bold uppercase tracking-wide text-rose-100"
            >
              {car.title}
            </h2>
            <p className="mt-1 text-lg font-semibold text-rose-200">
              {car.isSold ? "Sold" : price}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide px-6 pb-6">
            {/* carousel */}
            <section
              className="mb-6"
              aria-roledescription="carousel"
              aria-label={`${car.title} photos`}
            >
              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`Photo ${i + 1} of ${images.length}`}
                      aria-hidden={i !== active}
                      className="relative flex-[0_0_100%] h-72 md:h-105"
                    >
                      <Image
                        src={src}
                        alt={`${car.title}, photo ${i + 1}`}
                        fill
                        priority={i === 0}
                        sizes="(max-width:768px) 100vw, 800px"
                        className="rounded-md object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="flex gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
                    {images.map((_, i) => {
                      const isActive = i === active;

                      return (
                        <button
                          key={i}
                          type="button"
                          aria-label={`Show photo ${i + 1} of ${images.length}`}
                          aria-current={isActive ? "true" : undefined}
                          onClick={() => {
                            userInteracted.current = true;
                            emblaApi?.scrollTo(i);
                            pauseAutoplay();
                          }}
                          className={`relative h-2.5 overflow-hidden rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200
                            ${isActive ? "w-6" : "w-2.5"}`}
                        >
                          <span
                            className={`absolute inset-0 rounded-full
                              ${isActive ? "bg-rose-300/30" : "bg-rose-300/40"}`}
                          />

                          {isActive && !paused && (
                            <span
                              key={`${i}-${progressKey}`}
                              className="absolute inset-0 origin-left rounded-full bg-rose-400 animate-progress"
                              style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={paused ? resumeAutoplay : pauseAutoplay}
                    aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                    className="rounded-full bg-white/10 p-2 text-rose-200 transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                  >
                    {paused ? (
                      <FaPlay className="text-sm" aria-hidden="true" />
                    ) : (
                      <FaPause className="text-sm" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </section>

            <Divider />

            <p className="mb-6 text-center text-zinc-200">{car.description}</p>

            <Divider />

            <dl className="mb-6 grid grid-cols-3 gap-6 text-center text-lg text-zinc-200">
              {specs.map(({ label, value, Icon }) => (
                <div key={label}>
                  <dt>
                    <Icon className="mx-auto mb-1 text-rose-300" aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </dt>
                  <dd>{value ?? "-"}</dd>
                </div>
              ))}
            </dl>

            <Divider />

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {/* Plain <a>: a full page load avoids the modal's scroll-lock
                  restore fighting the new page's scroll position. */}
              <a
                href={car.href}
                className="flex items-center gap-2 rounded-full bg-rose-400/25 px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-rose-400/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                Full details
                <FaArrowRight aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={share}
                className="flex items-center gap-2 rounded-full bg-rose-400/15 px-6 py-2 text-rose-100 transition-colors duration-200 hover:bg-rose-400/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
              >
                <FaShareAlt aria-hidden="true" />
                <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </dialog>
  );
}
