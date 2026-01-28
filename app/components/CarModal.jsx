"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
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
   Motion
--------------------------------------------- */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { scale: 0.96, opacity: 0, y: 40 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 32 },
  },
  exit: { scale: 0.94, opacity: 0, y: 60 },
};

const FALLBACK_IMAGE = "/fallback.webp";
const AUTOPLAY_MS = 5000;

/* ---------------------------------------------
   Component
--------------------------------------------- */
export default function CarModal({ car, logo, onClose }) {
  const images = useMemo(
    () => (car.imageUrl?.length ? car.imageUrl : [FALLBACK_IMAGE]),
    [car.imageUrl],
  );

  /* Embla */
  const autoplay = useRef(
    Autoplay({ delay: AUTOPLAY_MS, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: images.length > 1 },
    [autoplay.current],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  /* Autoplay progress (time-based, stable) */
  useEffect(() => {
    if (!emblaApi) return;

    let raf;
    let start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      setProgress(Math.min(0.999, elapsed / AUTOPLAY_MS));
      raf = requestAnimationFrame(tick);
    };

    const reset = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
      start = performance.now();
      setProgress(0);
    };

    emblaApi.on("select", reset);
    emblaApi.on("pointerDown", reset);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      emblaApi.off("select", reset);
      emblaApi.off("pointerDown", reset);
    };
  }, [emblaApi]);

  /* Keyboard */
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

  /* Parallax */
  const dragY = useMotionValue(0);
  const imageParallaxY = useTransform(dragY, [-200, 0, 200], [-8, 0, 8]);

  /* Share */
  const [copied, setCopied] = useState(false);
  const formattedMileage =
    car.mileage >= 1000
      ? `${(car.mileage / 1000).toFixed(0)}K`
      : car.mileage.toLocaleString("en-GB");
  const formattedPrice = car.price.toLocaleString("en-GB");

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
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${car.title} details`}
          className="relative w-full max-w-3xl max-h-[92vh] rounded-xl bg-linear-to-br from-rose-900 via-rose-800 to-rose-950 text-white shadow-xl overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          drag="y"
          style={{ y: dragY }}
          dragConstraints={{ top: 0, bottom: 0 }}
        >
          {/* Close */}
          <button
            onClick={close}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-3"
          >
            <FaTimes />
          </button>

          {/* Header */}
          <div className="sticky top-0 z-40 bg-linear-to-b from-rose-950/90 to-transparent backdrop-blur-sm px-6 pt-4 pb-4 text-center">
            {logo && <div className="mx-auto mb-2 h-12 w-12">{logo}</div>}
            <h4 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
              {car.title}
            </h4>
          </div>

          {/* Content */}
          <div className="overflow-y-auto px-6 pb-6 max-h-[calc(92vh-120px)]">
            {/* Carousel */}
            <div className="mb-6">
              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative flex-[0_0_100%] h-70 md:h-105"
                    >
                      <motion.div style={{ y: imageParallaxY }}>
                        <Image
                          src={src}
                          alt={`${car.title} ${i + 1}`}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 768px) 100vw, 800px"
                          className="object-cover rounded-md"
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pill rail */}
              <div className="mt-4 flex justify-center">
                <div className="flex gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
                  {images.map((_, i) => {
                    const active = i === activeIndex;
                    return (
                      <button
                        key={i}
                        onClick={() => emblaApi?.scrollTo(i)}
                        className="relative h-2.5 w-6 focus:outline-none"
                      >
                        {/* Base */}
                        <span
                          className="absolute inset-0 rounded-full bg-rose-300/30 transition-all"
                          style={{ width: active ? 28 : 10 }}
                        />
                        {/* Progress */}
                        {active && (
                          <span className="absolute inset-0 overflow-hidden rounded-full">
                            <span
                              className="block h-full bg-rose-400"
                              style={{
                                transform: `scaleX(${progress})`,
                                transformOrigin: "left",
                              }}
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Divider />

            <p className="mb-6 text-center">{car.description}</p>

            <Divider />

            {/* Specs */}
            <div className="grid grid-cols-3 gap-6 text-center text-lg mb-6">
              <div><PiEngineFill className="mx-auto mb-1" />{car.engineType}</div>
              <div><FaGasPump className="mx-auto mb-1" />{car.engineSize}L</div>
              <div><GiGearStickPattern className="mx-auto mb-1" />{car.transmission}</div>
              <div><FaCarSide className="mx-auto mb-1" />{car.carType}</div>
              <div><FaRegCalendarAlt className="mx-auto mb-1" />{car.year}</div>
              <div><BiSolidTachometer className="mx-auto mb-1" />{formattedMileage} miles</div>
            </div>

            <Divider />

            <button
              onClick={share}
              className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-white/10 px-6 py-2"
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
