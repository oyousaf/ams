"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaGasPump,
  FaRegCalendarAlt,
  FaCarSide,
  FaShareAlt,
} from "react-icons/fa";
import { PiEngineFill } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { BiSolidTachometer } from "react-icons/bi";
import Divider from "./Divider";

/* ---------------------------------------------
   Constants
--------------------------------------------- */
const FALLBACK_IMAGE = "/fallback.webp";
const AUTOPLAY_MS = 5000;

/* ---------------------------------------------
   Motion
--------------------------------------------- */
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

export default function CarModal({ car, logo, onClose }) {
  const images = useMemo(
    () => (car.imageUrl?.length ? car.imageUrl : [FALLBACK_IMAGE]),
    [car.imageUrl],
  );

  /* ---------------------------------------------
     Pre-decode images
  --------------------------------------------- */
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      img.decode?.().catch(() => {});
    });
  }, [images]);

  /* ---------------------------------------------
     Embla
  --------------------------------------------- */
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: images.length > 1,
      containScroll: "trimSnaps",
      dragFree: false,
      align: "center",
    },
    [autoplay.current],
  );

  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  /* ---------------------------------------------
     Progress sync
  --------------------------------------------- */
  useEffect(() => {
    if (!emblaApi) return;

    const sync = () => {
      setActive(emblaApi.selectedScrollSnap());
      setProgressKey((k) => k + 1);
    };

    sync();
    emblaApi.on("select", sync);
    emblaApi.on("pointerDown", sync);
    emblaApi.on("reInit", sync);

    return () => {
      emblaApi.off("select", sync);
      emblaApi.off("pointerDown", sync);
      emblaApi.off("reInit", sync);
    };
  }, [emblaApi]);

  /* ---------------------------------------------
     Close + keyboard
  --------------------------------------------- */
  const close = useCallback(() => onClose?.(), [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKey);
    };
  }, [emblaApi, close]);

  /* ---------------------------------------------
     Formatting
  --------------------------------------------- */
  const formattedMileage =
    car.mileage >= 1000
      ? `${(car.mileage / 1000).toFixed(0)}K`
      : car.mileage.toLocaleString("en-GB");

  const formattedPrice = car.price.toLocaleString("en-GB");

  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.share?.({
        title: car.title,
        text: `Check out this ${car.title} for £${formattedPrice}`,
        url: location.href,
      });
    } catch {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        variants={overlay}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          role="dialog"
          aria-modal
          className="relative w-full max-w-3xl max-h-[92vh] rounded-xl bg-linear-to-br from-rose-900 via-rose-800 to-rose-950 text-white shadow-xl overflow-hidden"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-3"
          >
            <FaTimes />
          </button>

          {/* Header */}
          <div className="sticky top-0 z-40 bg-linear-to-b from-rose-950/90 to-transparent backdrop-blur px-6 pt-4 pb-4 text-center">
            {logo && <div className="mx-auto mb-2 h-12 w-12">{logo}</div>}
            <h4 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-rose-200">
              {car.title}
            </h4>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-6 pb-6 max-h-[calc(92vh-120px)]">
            {/* Carousel */}
            <div className="mb-6">
              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative flex-[0_0_100%] h-72 md:h-105"
                    >
                      <div className="relative h-full will-change-transform">
                        <Image
                          src={src}
                          alt={`${car.title} ${i + 1}`}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 768px) 100vw, 800px"
                          className="object-cover rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots + CSS progress */}
              <div className="mt-4 flex justify-center">
                <div className="flex gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
                  {images.map((_, i) => {
                    const isActive = i === active;
                    return (
                      <button
                        key={i}
                        onClick={() => emblaApi?.scrollTo(i)}
                        className="relative h-2.5 w-6"
                      >
                        <span className="absolute inset-0 rounded-full bg-rose-300/30" />
                        {isActive && (
                          <span
                            key={progressKey}
                            className="absolute inset-0 origin-left rounded-full bg-rose-400 animate-progress"
                            style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Divider />

            <p className="mb-6 text-center text-zinc-200">{car.description}</p>

            <Divider />

            <div className="grid grid-cols-3 gap-6 text-center text-lg mb-6 text-zinc-200">
              <div>
                <PiEngineFill className="mx-auto mb-1 text-rose-300" />
                {car.engineType}
              </div>
              <div>
                <FaGasPump className="mx-auto mb-1 text-rose-300" />
                {car.engineSize}L
              </div>
              <div>
                <GiGearStickPattern className="mx-auto mb-1 text-rose-300" />
                {car.transmission}
              </div>
              <div>
                <FaCarSide className="mx-auto mb-1 text-rose-300" />
                {car.carType}
              </div>
              <div>
                <FaRegCalendarAlt className="mx-auto mb-1 text-rose-300" />
                {car.year}
              </div>
              <div>
                <BiSolidTachometer className="mx-auto mb-1 text-rose-300" />
                {formattedMileage} miles
              </div>
            </div>

            <Divider />

            <button
              onClick={share}
              className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-rose-400/15 px-6 py-2 text-rose-100 hover:bg-rose-400/25"
            >
              <FaShareAlt />
              {copied ? "Link copied" : "Share"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
