"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaGasPump,
  FaRegCalendarAlt,
  FaCarSide,
} from "react-icons/fa";
import { PiEngineFill } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { BiSolidTachometer } from "react-icons/bi";
import Divider from "./Divider";
import LoadingSpinner from "../dashboard/LoadingSpinner";

const CarModal = ({ car, logo, onClose }) => {
  const fallbackImage = "/fallback.webp";
  const sliderRef = useRef(null);
  const modalRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const formattedMileage =
    car.mileage >= 1000
      ? `${(car.mileage / 1000).toFixed(0)}k`
      : car.mileage.toLocaleString("en-GB");

  const formattedPrice = car.price.toLocaleString("en-GB");

  const sliderSettings = {
    dots: true,
    infinite: car.imageUrl?.length > 1,
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
    if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
  }, []);

  useEffect(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleKeyDown, handleOutsideClick]);

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[1000] bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={modalRef}
            className="relative bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white w-full max-w-screen-md max-h-full md:max-h-[95vh] rounded-xl tile-glow p-6 shadow-xl overflow-hidden"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(e, info) => {
              if (Math.abs(info.offset.y) > 100) handleClose();
            }}
            initial={{ scale: 0.95, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 80 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={`${car.title} details`}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-50 p-2.5 md:p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition duration-200 ease-in-out text-white"
              onClick={handleClose}
              aria-label="Close Modal"
            >
              <FaTimes className="text-xl md:text-2xl text-white/80" />
            </button>

            {/* Header */}
            <div className="sticky top-0 z-40 rounded-t-xl pb-4 pt-3 mb-4 text-center">
              <div className="flex justify-center items-center flex-col gap-2">
                {logo && <div className="w-12 h-12">{logo}</div>}
                <h2 className="text-xl md:text-2xl font-bold uppercase">
                  {car.title}
                </h2>
              </div>
            </div>

            {/* Image Slider */}
            <div
              onWheel={(e) => {
                if (e.deltaY > 0 || e.deltaX > 0)
                  sliderRef.current?.slickNext();
                else sliderRef.current?.slickPrev();
              }}
              className="rounded-md overflow-hidden mb-6"
            >
              {!isLoaded && (
                <div className="flex justify-center items-center h-[300px] md:h-[400px] bg-black bg-opacity-20">
                  <LoadingSpinner />
                </div>
              )}
              <Slider {...sliderSettings} ref={sliderRef}>
                {(car.imageUrl?.length ? car.imageUrl : [fallbackImage]).map(
                  (url, i) => (
                    <div key={url}>
                      <Image
                        src={url}
                        alt={`${car.title} ${i + 1}`}
                        width={800}
                        height={400}
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
            </div>

            {/* Badges & Price */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center items-center">
              {car.isFeatured && (
                <span className="bg-yellow-400 text-black text-sm px-4 py-1 rounded-full font-semibold uppercase shadow">
                  Featured
                </span>
              )}
              {car.isSold && (
                <span className="bg-red-600 text-white text-sm px-4 py-1 rounded-full font-semibold uppercase shadow">
                  Sold
                </span>
              )}
              <a
                href="tel:07809107655"
                className="bg-rose-500 text-2xl glow-pulse px-4 py-1 rounded-full font-semibold shadow hover:bg-rose-600 transition inline-block"
              >
                £{formattedPrice}
              </a>
            </div>

            <Divider />

            {/* Description */}
            <p className="text-center text-zinc-100 mb-6 text-base md:text-lg leading-relaxed">
              {car.description}
            </p>

            <Divider />

            {/* Specs */}
            <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-6 text-center font-semibold text-lg md:text-xl mb-6">
              <div>
                <PiEngineFill
                  size={28}
                  className="mx-auto mb-1 text-rose-200"
                />
                <p>{car.engineType}</p>
              </div>
              <div>
                <FaGasPump size={28} className="mx-auto mb-1 text-rose-200" />
                <p>{car.engineSize}L</p>
              </div>
              <div>
                <GiGearStickPattern
                  size={28}
                  className="mx-auto mb-1 text-rose-200"
                />
                <p>{car.transmission}</p>
              </div>
              <div>
                <FaCarSide size={28} className="mx-auto mb-1 text-rose-200" />
                <p>{car.carType}</p>
              </div>
              <div>
                <FaRegCalendarAlt
                  size={28}
                  className="mx-auto mb-1 text-rose-200"
                />
                <p>{car.year}</p>
              </div>
              <div>
                <BiSolidTachometer
                  size={28}
                  className="mx-auto mb-1 text-rose-200"
                />
                <p>{formattedMileage} miles</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CarModal;
