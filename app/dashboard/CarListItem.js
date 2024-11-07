import React, { useState } from "react";
import { IoTrash } from "react-icons/io5";

const CarListItem = ({ car, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const displayImage = imageError
    ? "https://ev-database.org/img/auto/Porsche_Taycan_Turbo_S/Porsche_Taycan_Turbo_S-01@2x.jpg"
    : car.imageUrl;

  const formattedPrice = car.price.toLocaleString("en-GB");
  const formattedMileage = car.mileage.toLocaleString("en-GB");

  return (
    <li className="border border-rose-200 rounded-md p-4 flex flex-col sm:flex-row items-start bg-rose-900 text-gray-200">
      <div className="w-full sm:w-1/3 mr-4 mb-4 sm:mb-0">
        <img
          src={displayImage}
          alt={car.title || "Car image"}
          width={500}
          height={500}
          className="rounded-md object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="w-full sm:w-2/3 mb-4 sm:mb-0">
        <h3 className="font-bold text-white text-2xl mb-2">{car.title}</h3>
        <p className="text-gray-300 mb-2 md:text-xl">{car.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-white md:text-lg">
          <p>
            Price:{" "}
            <span className="font-semibold md:text-xl text-rose-300">
              £{formattedPrice}
            </span>
          </p>
          <p>
            Engine Type:{" "}
            <span className="font-semibold md:text-xl text-rose-300">
              {car.engineType}
            </span>
          </p>
          <p>
            Engine Size:{" "}
            <span className="font-semibold md:text-xl text-rose-300">
              {car.engineSize}L
            </span>
          </p>
          <p>
            Transmission:{" "}
            <span className="font-semibold md:text-xl text-rose-300">
              {car.transmission}
            </span>
          </p>
          <p>
            Mileage:{" "}
            <span className="font-semibold md:text-xl text-rose-300">
              {formattedMileage} miles
            </span>
          </p>
        </div>
      </div>
      <button
        className="self-center sm:self-start mt-4 sm:mt-0 text-red-300 hover:text-red-500 transition-colors"
        onClick={() => onDelete(car.$id, car.title)}
        aria-label={`Delete ${car.title}`}
      >
        <IoTrash size={30} />
      </button>
    </li>
  );
};

export default CarListItem;
