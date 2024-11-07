import React from "react";
import CarListItem from "./CarListItem";

const CarList = ({ cars, onDelete }) => (
  <ul className="space-y-4 p-4 rounded-md">
    {cars.map((car) => (
      <CarListItem key={car.$id} car={car} onDelete={onDelete} />
    ))}
  </ul>
);

export default CarList;
