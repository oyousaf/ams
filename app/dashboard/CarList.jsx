"use client";

import React, { memo } from "react";
import { AnimatePresence } from "framer-motion";
import CarListItem from "./CarListItem";

function CarList({ cars, setCars, fetchCars }) {
  return (
    /* 🔹 Scroll container (must be min-h-0 inside flex parents) */
    <div
      className="
        relative
        z-0
        flex-1
        min-h-0
        overflow-y-auto
        pr-2
        max-w-7xl
        mx-auto
        space-y-4
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
      "
    >
      <ul className="space-y-4">
        <AnimatePresence mode="popLayout">
          {cars.map((car) => (
            <CarListItem
              key={car.$id}
              car={car}
              setCars={setCars}
              fetchCars={fetchCars}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default memo(CarList);
