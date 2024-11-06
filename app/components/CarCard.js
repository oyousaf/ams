import React, { useMemo } from "react";
import Slider from "react-slick";
import Image from "next/image"; // Import next/image
import { FaGasPump } from "react-icons/fa6";
import { PiEngineFill } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { BiSolidTachometer } from "react-icons/bi";

const CarCard = React.memo(({ car, logo }) => {
  const defaultImageUrl = "https://ev-database.org/img/auto/Porsche_Taycan_Turbo_S/Porsche_Taycan_Turbo_S-01@2x.jpg";

  const settings = useMemo(() => ({
    dots: false,
    arrows: false,
    infinite: car.imageUrl?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  }), [car.imageUrl]);

  const formattedMileage = useMemo(() => car.mileage.toLocaleString("en-GB"), [car.mileage]);
  const formattedPrice = useMemo(() => car.price.toLocaleString("en-GB"), [car.price]);

  return (
    <li className="rounded-md p-4 flex flex-col items-start bg-rose-800 text-gray-200">
      <div className="w-full mb-4 text-center">
        <Slider {...settings}>
          {car.imageUrl?.length > 0 ? (
            car.imageUrl.map((url, index) => (
              <div key={url}>
                <Image
                  src={url}
                  alt={`${car.title} ${index + 1}`}
                  width={500}
                  height={192}
                  className="rounded-md object-cover"
                  priority={index === 0}
                />
              </div>
            ))
          ) : (
            <Image
              src={defaultImageUrl}
              alt={car.title}
              width={500}
              height={192}
              className="rounded-md object-cover"
              priority
            />
          )}
        </Slider>

        <div className="w-full mb-4 mt-4 flex justify-center">{logo}</div>
        <h3 className="font-bold text-white text-2xl mb-2">{car.title}</h3>
        <p className="text-gray-300 mb-4 md:text-xl">{car.description}</p>
        <div className="grid grid-cols-1 gap-y-1 text-white md:text-lg mt-8">
          <div className="flex justify-between mb-4">
            <div className="flex flex-col items-center mx-auto">
              <PiEngineFill size={40} className="mb-2" />
              <span className="font-bold text-xl text-rose-300">
                {car.engineType}
              </span>
            </div>
            <div className="flex flex-col items-center mx-auto">
              <FaGasPump size={40} className="mb-2" />
              <span className="font-bold text-xl text-rose-300">
                {car.engineSize}L
              </span>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="flex flex-col items-center mx-auto">
              <GiGearStickPattern size={40} className="mb-2" />
              <span className="font-bold text-xl text-rose-300">
                {car.transmission}
              </span>
            </div>
            <div className="flex flex-col items-center mx-auto">
              <BiSolidTachometer size={40} className="mb-2" />
              <span className="font-bold text-xl text-rose-300">
                {formattedMileage} Miles
              </span>
            </div>
          </div>
          <p className="font-bold text-2xl text-white text-center pt-2">
            £{formattedPrice}
          </p>
        </div>
      </div>
    </li>
  );
});

export default CarCard;
