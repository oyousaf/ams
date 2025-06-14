"use client";

import React, { memo } from "react";
import CarListItem from "./CarListItem";
import { motion, AnimatePresence } from "framer-motion";

const CarList = ({ cars, setCars, fetchCars }) => (
  <div className="max-w-7xl mx-auto space-y-4 p-4 overflow-y-auto max-h-[70vh] pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    <ul className="space-y-4">
      <AnimatePresence mode="popLayout">
        {cars.map((car) => (
          <motion.li
            key={car.$id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <CarListItem car={car} setCars={setCars} fetchCars={fetchCars} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  </div>
);

export default memo(CarList);
