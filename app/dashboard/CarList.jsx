import React, { memo } from "react";
import CarListItem from "./CarListItem";

const CarList = ({ cars, setCars, fetchCars }) => (
  <div className="max-w-7xl mx-auto space-y-4 p-4">
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
