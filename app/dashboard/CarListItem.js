"use client";

import React, { useState, memo } from "react";
import { IoTrash } from "react-icons/io5";

const FALLBACK_IMAGE = "/fallback.webp";

const CarImage = ({ src, title, onError }) => (
  <figure className="w-full sm:w-1/3 mr-4 mb-4 sm:mb-0">
    <img
      src={src}
      alt={title}
      width={500}
      height={500}
      className="rounded-md object-cover"
      onError={onError}
      loading="lazy"
    />
    <figcaption className="sr-only">Image of {title}</figcaption>
  </figure>
);

const Detail = ({ label, value }) => (
  <p>
    {label}:{" "}
    <span className="font-semibold md:text-xl text-rose-300">{value}</span>
  </p>
);

const CarDetails = ({ car }) => {
  const {
    title,
    description,
    price,
    engineType,
    engineSize,
    transmission,
    mileage,
    year,
    carType,
  } = car;

  return (
    <div className="w-full sm:w-2/3 mb-4 sm:mb-0">
      <h3 className="font-bold text-white text-2xl mb-2">{title}</h3>
      <p className="text-gray-300 mb-2 md:text-xl">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-white md:text-lg">
        <Detail label="Price" value={`£${price?.toLocaleString("en-GB")}`} />
        <Detail label="Engine Type" value={engineType} />
        <Detail label="Engine Size" value={`${engineSize}L`} />
        <Detail label="Transmission" value={transmission} />
        <Detail
          label="Mileage"
          value={`${mileage?.toLocaleString("en-GB")} miles`}
        />
        <Detail label="Year" value={year} />
        <Detail label="Type" value={carType} />
      </div>
    </div>
  );
};

const CarListItem = ({ car, onDelete }) => {
  const [hasError, setHasError] = useState(false);

  const imageUrl = hasError ? FALLBACK_IMAGE : car.imageUrl;

  return (
    <li className="border border-rose-200 rounded-md p-4 mb-3 flex flex-col sm:flex-row items-start bg-rose-900 text-gray-200">
      <CarImage
        src={imageUrl}
        title={car.title}
        onError={() => setHasError(true)}
      />
      <CarDetails car={car} />
      <button
        type="button"
        className="self-center sm:self-start mt-4 sm:mt-0 text-red-300 hover:text-red-500 transition-colors cursor-pointer"
        onClick={() => onDelete(car.$id, car.title, car.imageFileIds)}
        aria-label={`Delete ${car.title}`}
      >
        <IoTrash size={30} />
      </button>
    </li>
  );
};

export default memo(CarListItem);
