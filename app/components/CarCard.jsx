import React, { useMemo } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { FaGasPump, FaRegCalendarAlt, FaCarSide } from "react-icons/fa";
import { PiEngineFill } from "react-icons/pi";
import { GiGearStickPattern } from "react-icons/gi";
import { BiSolidTachometer } from "react-icons/bi";

const CarCard = React.memo(({ car, logo }) => {
  const fallbackImage =
    "https://cdn.elferspot.com/wp-content/uploads/2021/12/269712451_4431790080281806_5749846471891286432_n-Kopie.jpeg";

  const settings = useMemo(
    () => ({
      dots: false,
      arrows: false,
      infinite: car.imageUrl?.length > 1,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
    }),
    [car.imageUrl]
  );

  const formattedMileage = useMemo(() => {
    return car.mileage >= 1000
      ? `${(car.mileage / 1000).toFixed(0)}k`
      : car.mileage.toLocaleString("en-GB");
  }, [car.mileage]);

  const formattedPrice = useMemo(
    () => car.price.toLocaleString("en-GB"),
    [car.price]
  );

  return (
    <li className="rounded-xl p-4 flex flex-col bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white transition-all duration-300 shadow-md hover:tile-glow">
      <Slider {...settings}>
        {car.imageUrl?.length > 0 ? (
          car.imageUrl.map((url, i) => (
            <div key={url}>
              <Image
                src={url}
                alt={`${car.title} ${i + 1}`}
                width={500}
                height={192}
                className="rounded-md object-cover"
                priority={i === 0}
              />
            </div>
          ))
        ) : (
          <Image
            src={fallbackImage}
            alt={car.title}
            width={500}
            height={192}
            className="rounded-md object-cover"
            priority
          />
        )}
      </Slider>

      {logo && <div className="w-full my-4 flex justify-center">{logo}</div>}

      <h3 className="font-bold text-white text-2xl md:text-3xl mb-2 text-center">
        {car.title}
      </h3>

      <p className="text-zinc-100 mb-4 text-center">{car.description}</p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-center font-semibold text-lg md:text-xl mb-6">
        <div>
          <PiEngineFill size={28} className="mx-auto mb-1 text-rose-200" />
          <p className="text-white">{car.engineType}</p>
        </div>
        <div>
          <FaGasPump size={28} className="mx-auto mb-1 text-rose-200" />
          <p className="text-white">{car.engineSize}L</p>
        </div>
        <div>
          <GiGearStickPattern
            size={28}
            className="mx-auto mb-1 text-rose-200"
          />
          <p className="text-white">{car.transmission}</p>
        </div>
        <div>
          <FaCarSide size={28} className="mx-auto mb-1 text-rose-200" />
          <p className="text-white">{car.carType}</p>
        </div>
        <div>
          <FaRegCalendarAlt size={28} className="mx-auto mb-1 text-rose-200" />
          <p className="text-white">{car.year}</p>
        </div>
        <div>
          <BiSolidTachometer size={28} className="mx-auto mb-1 text-rose-200" />
          <p className="text-white">{formattedMileage} miles</p>
        </div>
      </div>

      <p className="text-center text-3xl font-bold text-white hover:text-rose-300 transition">
        <a href="tel:07809107655">£{formattedPrice}</a>
      </p>
    </li>
  );
});

CarCard.displayName = "CarCard";
export default CarCard;
