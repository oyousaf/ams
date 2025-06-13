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
  const [isLoaded, setIsLoaded] = useState(false);

  const handleKeyDown = useCallback(
    (e) => e.key === "Escape" && onClose(),
    [onClose]
  );

  useEffect(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleWheel = (e) => {
    if (!sliderRef.current) return;
    if (e.deltaY > 0 || e.deltaX > 0) {
      sliderRef.current.slickNext();
    } else if (e.deltaY < 0 || e.deltaX < 0) {
      sliderRef.current.slickPrev();
    }
  };

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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[1000] bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white w-full max-w-screen-md md:max-h-[95vh] rounded-xl tile-glow p-6 shadow-xl overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-rose-400 transition z-50"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <FaTimes />
          </button>

          {/* Image Slider */}
          <div
            onWheel={handleWheel}
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
                      className={`object-cover w-full h-[300px] md:h-[400px] rounded-md transition-opacity duration-300 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ width: "auto", height: "auto" }}
                      loading={i === 0 ? "eager" : "lazy"}
                      placeholder="empty"
                      onLoad={() => setIsLoaded(true)}
                    />
                  </div>
                )
              )}
            </Slider>
          </div>

          {/* Badges & CTA */}
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

          {logo && <div className="flex justify-center mb-4">{logo}</div>}

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            {car.title}
          </h2>

          <Divider />

          <p className="text-center text-zinc-100 mb-6 text-base md:text-lg leading-relaxed">
            {car.description}
          </p>

          <Divider />

          {/* Specs */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-6 text-center font-semibold text-lg md:text-xl mb-6">
            <div>
              <PiEngineFill size={28} className="mx-auto mb-1 text-rose-200" />
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
    </AnimatePresence>
  );
};

export default CarModal;
