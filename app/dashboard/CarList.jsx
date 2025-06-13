// app/dashboard/CarList.jsx

"use client";

import React, { memo } from "react";
import CarListItem from "./CarListItem";

const CarList = ({ cars, setCars, fetchCars }) => (
  <div className="max-w-7xl mx-auto space-y-4 p-4 overflow-y-auto max-h-[70vh] pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    <ul>
      {cars.map((car) => (
        <CarListItem
          key={car.$id}
          car={car}
          setCars={setCars}
          fetchCars={fetchCars}
        />
      ))}
    </ul>
  </div>
);

export default memo(CarList);
