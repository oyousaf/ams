"use client";

import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
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
import LoadingSpinner from "../dashboard/LoadingSpinner";

/* -------------------------------------------------
   MOTION
-------------------------------------------------- */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { scale: 0.96, opacity: 0, y: 40 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 32 },
  },
  exit: { scale: 0.94, opacity: 0, y: 60, transition: { duration: 0.22 } },
};

const FALLBACK_IMAGE = "/fallback.webp";
const AUTOPLAY_MS = 5000;

/* -------------------------------------------------
   COMPONENT
-------------------------------------------------- */
export default function CarModal({ car, logo, onClose }) {
  const modalRef = useRef(null);

  const images = useMemo(
    () => (car.imageUrl?.length ? car.imageUrl : [FALLBACK_IMAGE]),
    [car.imageUrl],
  );

  /* -----------------------------
     Embla setup
  ------------------------------ */
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 }, [
    autoplay.current,
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  /* -----------------------------
     Progress sync (perfect)
  ------------------------------ */
  const startProgress = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    startRef.current = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / AUTOPLAY_MS);
      setProgress(t);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
      startProgress();
    };

    emblaApi.on("select", onSelect);
    startProgress();

    return () => {
      emblaApi.off("select", onSelect);
      cancelAnimationFrame(rafRef.current);
    };
  }, [emblaApi, startProgress]);

  /* -----------------------------
     Keyboard
  ------------------------------ */
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

  /* -----------------------------
     Derived
  ------------------------------ */
  const formattedMileage =
    car.mileage >= 1000
      ? `${(car.mileage / 1000).toFixed(0)}K`
      : car.mileage.toLocaleString("en-GB");

  const formattedPrice = car.price.toLocaleString("en-GB");

  /* -----------------------------
     Parallax
  ------------------------------ */
  const dragY = useMotionValue(0);
  const imageParallaxY = useTransform(dragY, [-200, 0, 200], [-8, 0, 8]);

  /* -----------------------------
     Share
  ------------------------------ */
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: car.title,
          text: `Check out this ${car.title} for £${formattedPrice}`,
          url,
        });
        return;
      }
    } catch {}
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* -------------------------------------------------
     RENDER
  -------------------------------------------------- */
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-1000 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          ref={modalRef}
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
          dragElastic={0.08}
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
            <div
              className="mb-6"
              onMouseEnter={() => autoplay.current.stop()}
              onMouseLeave={() => autoplay.current.play()}
            >
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {images.map((url, i) => (
                    <div
                      key={i}
                      className="relative flex-[0_0_100%] h-70 md:h-105"
                    >
                      <motion.div style={{ y: imageParallaxY }}>
                        <Image
                          src={url}
                          alt={`${car.title} ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 800px"
                          className="object-cover rounded-md"
                          priority={i === 0}
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pills */}
              <div className="mt-4 flex justify-center gap-2">
                {images.map((_, i) => {
                  const active = i === activeIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => emblaApi?.scrollTo(i)}
                      className="relative h-3 w-10 focus:outline-none"
                    >
                      <span
                        className="absolute left-1/2 top-1/2 h-0.75 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          width: active ? 40 : 16,
                          background: "rgba(251,113,133,0.35)",
                          transition: "width 300ms ease",
                        }}
                      />
                      {active && (
                        <span
                          className="absolute left-1/2 top-1/2 h-0.75 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
                          style={{ width: 40 }}
                        >
                          <span
                            className="block h-full bg-rose-400"
                            style={{
                              transformOrigin: "left",
                              transform: `scaleX(${progress})`,
                              transition: "transform 60ms linear",
                            }}
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <Divider />

            <p className="mb-6 text-center leading-relaxed">
              {car.description}
            </p>

            <Divider />

            {/* Specs */}
            <div className="grid grid-cols-3 gap-6 text-center text-lg mb-6">
              <div>
                <PiEngineFill className="mx-auto mb-1" />
                {car.engineType}
              </div>
              <div>
                <FaGasPump className="mx-auto mb-1" />
                {car.engineSize}L
              </div>
              <div>
                <GiGearStickPattern className="mx-auto mb-1" />
                {car.transmission}
              </div>
              <div>
                <FaCarSide className="mx-auto mb-1" />
                {car.carType}
              </div>
              <div>
                <FaRegCalendarAlt className="mx-auto mb-1" />
                {car.year}
              </div>
              <div>
                <BiSolidTachometer className="mx-auto mb-1" />
                {formattedMileage} miles
              </div>
            </div>

            <Divider />

            <button
              onClick={handleShare}
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
