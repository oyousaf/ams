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
  FaPlay,
} from "react-icons/fa";
import { PiEngineFill } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { BiSolidTachometer } from "react-icons/bi";
import Divider from "./Divider";
import { resolveImages } from "@/lib/resolveImage";

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

export default function CarModal({ car, logo, onClose }) {
  const images = useMemo(() => {
    return resolveImages(car.imageUrls);
  }, [car.imageUrls]);

  /* preload */
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      img.decode?.().catch(() => {});
    });
  }, [images]);

  const autoplayRef = useRef(
    Autoplay({
      delay: AUTOPLAY_MS,
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
    [autoplayRef.current],
  );

  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused] = useState(false);

  const userInteracted = useRef(false);

  const pauseAutoplay = useCallback(() => {
    userInteracted.current = true;
    autoplayRef.current.stop();
    setPaused(true);
  }, []);

  const resumeAutoplay = useCallback(() => {
    autoplayRef.current.play();
    autoplayRef.current.reset();
    setProgressKey((k) => k + 1);
    setPaused(false);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const sync = () => {
      setActive(emblaApi.selectedScrollSnap());
      setProgressKey((k) => k + 1);

      if (userInteracted.current) {
        autoplayRef.current.reset();
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
  }, [emblaApi, pauseAutoplay]);

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

  const mileage = Number(car.mileage) || 0;
  const price = Number(car.price) || 0;

  const formattedMileage =
    mileage >= 1000
      ? `${(mileage / 1000).toFixed(0)}K`
      : mileage.toLocaleString("en-GB");

  const formattedPrice = price ? price.toLocaleString("en-GB") : "POA";

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
          aria-modal="true"
          className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl
           bg-linear-to-br from-rose-900 via-rose-800 to-rose-950 text-white shadow-xl"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-3 hover:bg-white/20"
          >
            <FaTimes />
          </button>

          <div className="sticky top-0 z-40 bg-linear-to-b from-rose-950/90 to-transparent backdrop-blur px-6 pt-4 pb-4 text-center">
            {logo && <div className="mx-auto mb-2 h-12 w-12">{logo}</div>}
            <h4 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-rose-200">
              {car.title}
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-6">
            {/* carousel */}
            <div className="mb-6">
              <div
                ref={emblaRef}
                className="overflow-hidden"
                onClick={pauseAutoplay}
              >
                <div className="flex">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative flex-[0_0_100%] h-72 md:h-105"
                    >
                      <Image
                        src={src}
                        alt={`${car.title} ${i + 1}`}
                        fill
                        priority={i === 0}
                        sizes="(max-width:768px) 100vw, 800px"
                        className="rounded-md object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* dots */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="flex gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
                  {images.map((_, i) => {
                    const isActive = i === active;

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          userInteracted.current = true;
                          emblaApi?.scrollTo(i);
                          pauseAutoplay();
                        }}
                        className={`relative h-2.5 overflow-hidden transition-all
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

                {paused && (
                  <button
                    onClick={resumeAutoplay}
                    className="rounded-full bg-white/10 p-2 text-rose-200 hover:bg-white/20"
                  >
                    <FaPlay className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            <Divider />

            <p className="mb-6 text-center text-zinc-200">{car.description}</p>

            <Divider />

            <div className="mb-6 grid grid-cols-3 gap-6 text-center text-lg text-zinc-200">
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
