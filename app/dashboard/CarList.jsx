"use client";

import React, { memo } from "react";
import { AnimatePresence } from "framer-motion";
import CarListItem from "./CarListItem";

function CarList({ cars, setCars, fetchCars, setModalOpen }) {
  return (
    <div
      className="w-full mx-auto space-y-4 p-4 pr-2 overflow-y-auto max-h-[70vh] [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <ul className="space-y-4">
        <AnimatePresence mode="popLayout">
          {cars.map((car) => (
            <CarListItem
              key={car.$id}
              car={car}
              setCars={setCars}
              fetchCars={fetchCars}
              setModalOpen={setModalOpen}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default memo(CarList);
