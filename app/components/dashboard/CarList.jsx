"use client";

import React, { memo } from "react";
import { AnimatePresence } from "framer-motion";
import CarListItem from "./CarListItem";

function CarList({ cars, setCars, setModalOpen }) {
  if (!Array.isArray(cars) || cars.length === 0) {
    return (
      <div className="w-full h-full grid place-items-center text-rose-200">
        No cars found
      </div>
    );
  }

  return (
    <div
      className="w-full mx-auto space-y-4 p-4 overflow-y-auto max-h-[70vh]
      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <ul className="space-y-4">
          {cars.map((car) => (
            <CarListItem
              key={car.id}
              car={car}
              setCars={setCars}
              setModalOpen={setModalOpen}
            />
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
}

export default memo(CarList);
