import React, { useState } from "react";
import { IoTrash } from "react-icons/io5";

const fallbackImage =
  "https://cdn.elferspot.com/wp-content/uploads/2021/12/269712451_4431790080281806_5749846471891286432_n-Kopie.jpeg";

const CarImage = ({ imageUrl, title = "Car image", setImageError }) => (
  <figure className="w-full sm:w-1/3 mr-4 mb-4 sm:mb-0">
    <img
      src={imageUrl}
      alt={title}
      width={500}
      height={500}
      className="rounded-md object-cover"
      onError={() => setImageError(true)}
    />
    <figcaption className="sr-only">
      {title ? `Image of ${title}` : "Car image"}
    </figcaption>
  </figure>
);

const Detail = ({ label, value }) => (
  <p>
    {label}:{" "}
    <span className="font-semibold md:text-xl text-rose-300">{value}</span>
  </p>
);

const CarDetails = ({ car }) => (
  <div className="w-full sm:w-2/3 mb-4 sm:mb-0">
    <h3 className="font-bold text-white text-2xl mb-2">{car.title}</h3>
    <p className="text-gray-300 mb-2 md:text-xl">{car.description}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-white md:text-lg">
      <Detail label="Price" value={`£${car.price.toLocaleString("en-GB")}`} />
      <Detail label="Engine Type" value={car.engineType} />
      <Detail label="Engine Size" value={`${car.engineSize}L`} />
      <Detail label="Transmission" value={car.transmission} />
      <Detail
        label="Mileage"
        value={`${car.mileage.toLocaleString("en-GB")} miles`}
      />
      <Detail label="Year" value={car.year} />
      <Detail label="Type" value={car.carType} />
    </div>
  </div>
);

const CarListItem = ({ car, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const displayImage = imageError ? fallbackImage : car.imageUrl;

  return (
    <li className="border border-rose-200 rounded-md p-4 mb-3 flex flex-col sm:flex-row items-start bg-rose-900 text-gray-200">
      <CarImage
        imageUrl={displayImage}
        title={car.title}
        setImageError={setImageError}
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

export default CarListItem;
