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
  hidden: { scale: 0.96, opacity: 0, y: 40 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 32 },
  },
  exit: { scale: 0.94, opacity: 0, y: 60, transition: { duration: 0.22 } },
};

const CarModal = ({ car, logo, onClose }) => {
  const fallbackImage = "/fallback.webp";
  const sliderRef = useRef(null);
  const modalRef = useRef(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

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
    beforeChange: (_, next) => setActiveSlide(next),
  };

  const handleClose = () => setIsVisible(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") handleClose();
    if (e.key === "ArrowRight") sliderRef.current?.slickNext();
    if (e.key === "ArrowLeft") sliderRef.current?.slickPrev();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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

  const dragY = useMotionValue(0);
  const imageParallaxY = useTransform(dragY, [-200, 0, 200], [-8, 0, 8]);

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
            className="relative w-full max-w-screen-md max-h-[92vh] rounded-xl bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white shadow-xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="y"
            style={{ y: dragY }}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-3"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <div className="sticky top-0 z-40 bg-gradient-to-b from-rose-950/90 to-transparent backdrop-blur-sm px-6 pt-4 pb-4 text-center">
              {logo && <div className="mx-auto mb-2 h-12 w-12">{logo}</div>}
              <h4 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                {car.title}
              </h4>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-6 pb-6 max-h-[calc(92vh-120px)]">
              {/* Slider */}
              <div className="mb-6">
                {!isLoaded && (
                  <div className="flex h-[280px] items-center justify-center bg-black/20">
                    <LoadingSpinner />
                  </div>
                )}
                <motion.div style={{ y: imageParallaxY }}>
                  <Slider ref={sliderRef} {...sliderSettings}>
                    {(car.imageUrl?.length
                      ? car.imageUrl
                      : [fallbackImage]
                    ).map((url, i) => {
                      const isActive = i === activeSlide;
                      return (
                        <div
                          key={`${url}-${i}`}
                          className="relative h-[280px] md:h-[420px]"
                          inert={!isActive}
                          aria-hidden={!isActive}
                          tabIndex={isActive ? 0 : -1}
                        >
                          <Image
                            src={url}
                            alt={`${car.title} ${i + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 800px"
                            className={`object-cover rounded-md transition-opacity ${
                              isLoaded ? "opacity-100" : "opacity-0"
                            }`}
                            loading={i === 0 ? "eager" : "lazy"}
                            onLoad={() => setIsLoaded(true)}
                          />
                        </div>
                      );
                    })}
                  </Slider>
                </motion.div>
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
      )}
    </AnimatePresence>
  );
};

export default CarModal;
