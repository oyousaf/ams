export const navLinks = [
  { id: 1, href: "hero", name: "Home" },
  { id: 2, href: "about", name: "About" },
  { id: 3, href: "cars", name: "Cars" },
  { id: 4, href: "reviews", name: "Reviews" },
  { id: 5, href: "contact", name: "Contact" },
];

import { FaCar, FaHandshake, FaHistory, FaShieldAlt } from "react-icons/fa";

const currentYear = new Date().getFullYear();
const establishedYear = 2022;
const yearsEstablished = currentYear - establishedYear;

export const aboutTiles = [
  {
    icon: FaCar,
    title: "Assured Quality",
    description:
      "Every vehicle undergoes a rigorous inspection to ensure lasting reliability, consistent performance, and complete peace of mind.",
  },
  {
    icon: FaHandshake,
    title: "Superb Service",
    description:
      "From initial enquiry through to final delivery, we deliver a transparent and dependable used-car buying experience nationwide.",
  },
  {
    icon: FaShieldAlt,
    title: "Flexibility",
    description:
      "Reserve your next car for £99, choose flexible finance options, sell your current vehicle with ease, or take advantage of part-exchange.",
  },
  {
    icon: FaHistory,
    title: `Established ${yearsEstablished} Years`,
    description: `Trusted since ${establishedYear}, we have built our reputation on transparency, integrity, and consistently high standards.`,
  },
];

import { FaInstagram, FaFacebook, FaPhone } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

export const socialLinks = [
  {
    id: 1,
    href: "https://www.facebook.com/acemotorsales1",
    icon: (
      <FaFacebook className="text-4xl md:text-3xl hover:text-rose-600 transition-all ease-in-out duration-300" />
    ),
    name: "Facebook",
  },
  {
    id: 2,
    href: "https://www.instagram.com/acemotorsltd",
    icon: (
      <FaInstagram className="text-4xl md:text-3xl hover:text-rose-600 transition-all ease-in-out duration-300" />
    ),
    name: "Instagram",
  },
  {
    id: 3,
    href: "mailto:acemotorslimited@hotmail.com",
    icon: (
      <IoMail className="text-4xl md:text-3xl hover:text-rose-600 transition-all ease-in-out duration-300" />
    ),
    name: "Email",
  },
  {
    id: 4,
    href: "tel:07809107655",
    icon: (
      <FaPhone className="text-4xl md:text-3xl hover:text-rose-600 transition-all ease-in-out duration-300" />
    ),
    name: "Phone",
  },
];

export const gallery = [
  "/forecourt1.webp",
  "/forecourt2.webp",
  "/forecourt3.webp",
  "/forecourt4.webp",
  "/forecourt5.webp",
  "/forecourt6.webp",
];

export const reviews = [
  {
    name: "John F",
    feedback: `Just bought a car from Ace Motor Sales. They have outstanding customer service and a fantastic, friendly, no-hassle sale policy. I highly recommend this company to anyone looking to change or buy a vehicle.`,
  },
  {
    name: "Eva K",
    feedback: `Bought an Audi A1 from this garage and would 1000% buy again. Unfortunately, I did not like the car as much as I would've hoped but that was no one’s fault but my own. The team at ACE were so professional and made the whole process very easy! Thank you :)`,
  },
  {
    name: "Ariana R",
    feedback:
      "Had my car delivered to me yesterday evening, very impressed with the car. It was just as described to me over the phone. A very friendly gentleman. I will definitely recommend this business to friends & family.",
  },
  {
    name: "Saeed A",
    feedback:
      "Top quality cars & service. Had my car 3 months now and have no complaints whatsoever. I had one issue within the warranty period and it got rectified without hesitation by the guys at Ace Motor Sales. Highly recommend!",
  },
  {
    name: "Mohammad R",
    feedback:
      "Bought my car 5 months ago now and I honestly couldn’t ask for much more! Brilliant service. Reasonable prices. Lovely variety of stock.",
  },
  {
    name: "Daniel L",
    feedback:
      "Bought a Mini Cooper a few weeks ago. Amazing service from start to finish. Was very transparent with everything and gave a 5* service. Will definitely buy from Ace Motor Sales again. Daniel and Rebekah.",
  },
  {
    name: "Kieran M",
    feedback:
      "Hands down the best used car dealer I've ever had the pleasure of dealing with. From start to finish the service provided was nothing short of amazing, any questions were answered promptly and nothing was too much of a hassle for Faisal. He really does go above and beyond for his customers, I would have no problem recommending buying a car for him, top class service!",
  },
  {
    name: "Omar 🍉",
    feedback: `It was a pleasure dealing with AMS! They offered excellent service from start to finish, were attentive to all my needs, and provide a fantastic selection of quality vehicles. Fez was professional, friendly, and knowledgeable. Highly recommend!`,
  },
];

import {
  SiAlfaromeo,
  SiAstonmartin,
  SiAudi,
  SiBentley,
  SiBmw,
  SiBugatti,
  SiCitroen,
  SiChevrolet,
  SiChrysler,
  SiDacia,
  SiDsautomobiles,
  SiFerrari,
  SiFiat,
  SiFord,
  SiHonda,
  SiHyundai,
  SiJaguar,
  SiJeep,
  SiKia,
  SiLamborghini,
  SiLandrover,
  SiMaserati,
  SiMazda,
  SiMclaren,
  SiMercedes,
  SiMini,
  SiMitsubishi,
  SiNissan,
  SiOpel,
  SiPeugeot,
  SiPorsche,
  SiRenault,
  SiRollsroyce,
  SiSeat,
  SiSkoda,
  SiSmart,
  SiSubaru,
  SiSuzuki,
  SiTesla,
  SiToyota,
  SiVolkswagen,
  SiVolvo,
  SiVauxhall,
} from "react-icons/si";

export const carLogos = {
  alfaromeo: <SiAlfaromeo className="w-12 h-12" />,
  astonmartin: <SiAstonmartin className="w-12 h-12" />,
  audi: <SiAudi className="w-12 h-12" />,
  bentley: <SiBentley className="w-12 h-12" />,
  bmw: <SiBmw className="w-12 h-12" />,
  bugatti: <SiBugatti className="w-12 h-12" />,
  citroen: <SiCitroen className="w-12 h-12" />,
  chevrolet: <SiChevrolet className="w-12 h-12" />,
  chrysler: <SiChrysler className="w-12 h-12" />,
  dacia: <SiDacia className="w-12 h-12" />,
  dsautomobiles: <SiDsautomobiles className="w-12 h-12" />,
  ferrari: <SiFerrari className="w-12 h-12" />,
  fiat: <SiFiat className="w-12 h-12" />,
  ford: <SiFord className="w-12 h-12" />,
  honda: <SiHonda className="w-12 h-12" />,
  hyundai: <SiHyundai className="w-12 h-12" />,
  jaguar: <SiJaguar className="w-12 h-12" />,
  jeep: <SiJeep className="w-12 h-12" />,
  kia: <SiKia className="w-12 h-12" />,
  lamborghini: <SiLamborghini className="w-12 h-12" />,
  landrover: <SiLandrover className="w-12 h-12" />,
  rangerover: <SiLandrover className="w-12 h-12" />,
  maserati: <SiMaserati className="w-12 h-12" />,
  mazda: <SiMazda className="w-12 h-12" />,
  mclaren: <SiMclaren className="w-12 h-12" />,
  mercedes: <SiMercedes className="w-12 h-12" />,
  mini: <SiMini className="w-12 h-12" />,
  mitsubishi: <SiMitsubishi className="w-12 h-12" />,
  nissan: <SiNissan className="w-12 h-12" />,
  opel: <SiOpel className="w-12 h-12" />,
  peugeot: <SiPeugeot className="w-12 h-12" />,
  porsche: <SiPorsche className="w-12 h-12" />,
  renault: <SiRenault className="w-12 h-12" />,
  rollsroyce: <SiRollsroyce className="w-12 h-12" />,
  seat: <SiSeat className="w-12 h-12" />,
  skoda: <SiSkoda className="w-12 h-12" />,
  smart: <SiSmart className="w-12 h-12" />,
  subaru: <SiSubaru className="w-12 h-12" />,
  suzuki: <SiSuzuki className="w-12 h-12" />,
  tesla: <SiTesla className="w-12 h-12" />,
  toyota: <SiToyota className="w-12 h-12" />,
  volkswagen: <SiVolkswagen className="w-12 h-12" />,
  vw: <SiVolkswagen className="w-12 h-12" />,
  volvo: <SiVolvo className="w-12 h-12" />,
  vauxhall: <SiVauxhall className="w-12 h-12" />,
};

export const carMakes = Object.keys(carLogos);
