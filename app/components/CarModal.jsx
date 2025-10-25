"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
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

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { scale: 0.95, opacity: 0, y: 50 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 30 },
  },
  exit: {
    scale: 0.92,
    opacity: 0,
    y: 80,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

const badgesContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, when: "beforeChildren" } },
};

const badgeItem = {
  hidden: { opacity: 0, y: 6, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 24 },
  },
};

const specsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};

const specItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 28 },
  },
};

const CarModal = ({ car, logo, onClose }) => {
  const fallbackImage = "/fallback.webp";
  const sliderRef = useRef(null);
  const modalRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const formattedMileage =
    car.mileage >= 1000
      ? `${(car.mileage / 1000).toFixed(0)}K`
      : car.mileage.toLocaleString("en-GB");

  const formattedPrice = car.price.toLocaleString("en-GB");

  const sliderSettings = {
    dots: true,
    infinite: (car.imageUrl?.length || 0) > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    swipe: true,
  };

  const handleClose = () => setIsVisible(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") handleClose();
    if (e.key === "ArrowRight") sliderRef.current?.slickNext();
    if (e.key === "ArrowLeft") sliderRef.current?.slickPrev();
  }, []);

  const handleOutsideClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleKeyDown, handleOutsideClick]);

  // --- Share / Copy link handler ---
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: car.title,
      text: `Check out this ${car.title} for £${formattedPrice}`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // fall through to clipboard if share cancelled/failed
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no clipboard access; silently ignore
    }
  };

  // --- Drag motion + parallax ---
  const dragY = useMotionValue(0);
  const imageParallaxY = useTransform(dragY, [-200, 0, 200], [-8, 0, 8]);

  // Drag-to-dismiss threshold helper (declared before use)
  const shouldDismiss = (offsetY, velocityY) =>
    Math.abs(offsetY) > 100 || Math.abs(velocityY) > 800;

  // Pause slider while dragging; resume after
  const onDragStart = () => {
    sliderRef.current?.slickPause();
  };
  const onDragEnd = (_, info) => {
    if (shouldDismiss(info.offset.y, info.velocity.y)) handleClose();
    else sliderRef.current?.slickPlay();
  };

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="presentation"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            ref={modalRef}
            className="relative bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white w-full max-w-screen-md max-h-full md:max-h-[95vh] rounded-xl tile-glow p-6 shadow-xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={`${car.title} details`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="y"
            style={{ y: dragY }}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 z-50 p-2.5 md:p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white"
              onClick={handleClose}
              aria-label="Close Modal"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <FaTimes className="text-xl md:text-2xl text-white/80" />
            </motion.button>

            {/* Header */}
            <motion.div
              className="sticky top-0 z-40 rounded-t-xl pb-4 pt-3 mb-4 text-center"
              variants={sectionVariants}
            >
              <div className="flex justify-center items-center flex-col gap-2">
                {logo && <div className="w-12 h-12">{logo}</div>}
                <h4 className="text-xl md:text-2xl font-bold uppercase">
                  {car.title}
                </h4>
              </div>
            </motion.div>

            {/* Image Slider with parallax wrapper */}
            <motion.div
              className="rounded-md overflow-hidden mb-6 will-change-transform"
              variants={sectionVariants}
              style={{ y: imageParallaxY }}
            >
              {!isLoaded && (
                <div className="flex justify-center items-center h-[300px] md:h-[400px] bg-black/20">
                  <LoadingSpinner />
                </div>
              )}
              <Slider {...sliderSettings} ref={sliderRef}>
                {(car.imageUrl?.length ? car.imageUrl : [fallbackImage]).map(
                  (url, i) => (
                    <div key={`${url}-${i}`}>
                      <Image
                        src={url}
                        alt={`${car.title} ${i + 1}`}
                        width={800}
                        height={500}
                        className={`object-cover w-full h-[300px] md:h-[500px] rounded-md transition-opacity duration-300 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        loading={i === 0 ? "eager" : "lazy"}
                        onLoad={() => setIsLoaded(true)}
                      />
                    </div>
                  )
                )}
              </Slider>
            </motion.div>

            {/* Badges, Price & Share */}
            <motion.div
              className="flex flex-wrap gap-3 mb-6 justify-center items-center"
              variants={badgesContainer}
              initial="hidden"
              animate="visible"
              layout
            >
              {car.isFeatured && (
                <motion.span
                  variants={badgeItem}
                  className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-yellow-400 text-black shadow-sm ring-1 ring-black/10"
                >
                  Featured
                </motion.span>
              )}

              {car.isSold && (
                <motion.span
                  variants={badgeItem}
                  className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-zinc-800 text-white shadow-sm ring-1 ring-white/10"
                >
                  Sold
                </motion.span>
              )}

              {/* Price pill */}
              {!car.isSold ? (
                <motion.a
                  variants={badgeItem}
                  href="tel:07809107655"
                  aria-label={`Call to enquire about this car, price £${formattedPrice}`}
                  className="inline-flex items-center px-6 py-2 rounded-full font-bold text-white text-2xl shadow-lg ring-1 ring-white/10 bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-500/90 hover:to-rose-600/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                >
                  £{formattedPrice}
                </motion.a>
              ) : (
                <motion.span
                  variants={badgeItem}
                  className="inline-flex items-center px-6 py-2 rounded-full font-bold text-2xl text-zinc-300 bg-zinc-800/70 ring-1 ring-white/10 line-through"
                >
                  £{formattedPrice}
                </motion.span>
              )}

              {/* Share / Copy pill */}
              <motion.button
                variants={badgeItem}
                type="button"
                onClick={handleShare}
                aria-label="Share this car"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white text-base shadow ring-1 ring-white/10 bg-white/5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
              >
                <FaShareAlt className="opacity-90" />
                {copied ? "Link copied" : "Share"}
              </motion.button>
            </motion.div>

            <Divider />

            {/* Description */}
            <motion.p
              className="text-center text-zinc-100 mb-6 text-base md:text-lg leading-relaxed"
              variants={sectionVariants}
            >
              {car.description}
            </motion.p>

            <Divider />

            {/* Specs */}
            <motion.div
              className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-6 text-center font-semibold text-lg md:text-xl mb-6"
              variants={specsContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={specItem}>
                <PiEngineFill
                  size={28}
                  className="mx-auto mb-1 text-rose-200"
                />
                <p>{car.engineType}</p>
              </motion.div>

              <motion.div variants={specItem}>
                <FaGasPump size={28} className="mx-auto mb-1 text-rose-200" />
                <p>{car.engineSize}L</p>
              </motion.div>

              <motion.div variants={specItem}>
                <GiGearStickPattern
                  size={28}
                  className="mx-auto mb-1 text-rose-200"
                />
                <p>{car.transmission}</p>
              </motion.div>

              <motion.div variants={specItem}>
                <FaCarSide size={28} className="mx-auto mb-1 text-rose-200" />
                <p>{car.carType}</p>
              </motion.div>

              <motion.div variants={specItem}>
                <FaRegCalendarAlt
                  size={28}
                  className="mx-auto mb-1 text-rose-200"
                />
                <p>{car.year}</p>
              </motion.div>

              <motion.div variants={specItem}>
                <BiSolidTachometer
                  size={28}
                  className="mx-auto mb-1 text-rose-200"
                />
                <p>{formattedMileage} miles</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CarModal;
