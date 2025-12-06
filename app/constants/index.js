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
    title: "Certified Quality",
    description:
      "Each car is thoroughly inspected and certified to ensure lasting performance and total peace of mind.",
  },
  {
    icon: FaHandshake,
    title: "Superb Service",
    description:
      "From first call to final delivery, we provide reliable UK-wide service with honesty, care, and convenience.",
  },
  {
    icon: FaShieldAlt,
    title: "Flexibility",
    description:
      "Reserve your next car for £99, explore flexible financing, sell your current vehicle with zero hassle, or opt for part exchange — whatever suits you best.",
  },
  {
    icon: FaHistory,
    title: `Established ${yearsEstablished} Years`,
    description: `Trusted since ${establishedYear}, we’ve built a legacy on transparency, care, and standout service.`,
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
    name: "Hamza N",
    feedback:
      "I part-exchanged my previous car for a stunning German whip from Faisal. The process was smooth and hassle-free. I’d definitely recommend anyone looking to buy or part-exchange their car to visit here — excellent customer service! I’m already looking forward to coming back in the future!",
  },
  {
    name: "S A",
    feedback:
      "Thrilled with my car I brought from these guys. Good prices and top service. Recommend to all.",
  },
  {
    name: "Hamzah H",
    feedback:
      "Thank you to Ace Motor Sales for providing me with a beautiful motor. I am over the moon! First time I bought a car without physically seeing the car beforehand. However, Fes made it a very swift experience and made me feel very reassured all the way through the process. He did a live video call with me and arranged everything over the phone and got the car delivered to me on the day I requested. Very impressed with the vehicle and the service. I will definitely be back in the future and will be recommending this company to my friends and family 👌",
  },
  {
    name: "Samuel R",
    feedback:
      "I went to see a car at AMS and everything was perfect. There wasn't a single problem with the car. The boss gave me a great price too. My family and I were very happy with the car, and the whole process was very simple. I highly recommend AMS because they have a lot of good cars at great prices. This was my first time buying a car in the UK, and I’m a very happy customer. Big shoutout to these guys! 👏🏿",
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
  alfaromeo: <SiAlfaromeo className="w-[3rem] h-[3rem]" />,
  astonmartin: <SiAstonmartin className="w-[3rem] h-[3rem]" />,
  audi: <SiAudi className="w-[3rem] h-[3rem]" />,
  bentley: <SiBentley className="w-[3rem] h-[3rem]" />,
  bmw: <SiBmw className="w-[3rem] h-[3rem]" />,
  bugatti: <SiBugatti className="w-[3rem] h-[3rem]" />,
  citroen: <SiCitroen className="w-[3rem] h-[3rem]" />,
  chevrolet: <SiChevrolet className="w-[3rem] h-[3rem]" />,
  chrysler: <SiChrysler className="w-[3rem] h-[3rem]" />,
  dacia: <SiDacia className="w-[3rem] h-[3rem]" />,
  dsautomobiles: <SiDsautomobiles className="w-[3rem] h-[3rem]" />,
  ferrari: <SiFerrari className="w-[3rem] h-[3rem]" />,
  fiat: <SiFiat className="w-[3rem] h-[3rem]" />,
  ford: <SiFord className="w-[3rem] h-[3rem]" />,
  honda: <SiHonda className="w-[3rem] h-[3rem]" />,
  hyundai: <SiHyundai className="w-[3rem] h-[3rem]" />,
  jaguar: <SiJaguar className="w-[3rem] h-[3rem]" />,
  jeep: <SiJeep className="w-[3rem] h-[3rem]" />,
  kia: <SiKia className="w-[3rem] h-[3rem]" />,
  lamborghini: <SiLamborghini className="w-[3rem] h-[3rem]" />,
  landrover: <SiLandrover className="w-[3rem] h-[3rem]" />,
  rangerover: <SiLandrover className="w-[3rem] h-[3rem]" />,
  maserati: <SiMaserati className="w-[3rem] h-[3rem]" />,
  mazda: <SiMazda className="w-[3rem] h-[3rem]" />,
  mclaren: <SiMclaren className="w-[3rem] h-[3rem]" />,
  mercedes: <SiMercedes className="w-[3rem] h-[3rem]" />,
  mini: <SiMini className="w-[3rem] h-[3rem]" />,
  mitsubishi: <SiMitsubishi className="w-[3rem] h-[3rem]" />,
  nissan: <SiNissan className="w-[3rem] h-[3rem]" />,
  opel: <SiOpel className="w-[3rem] h-[3rem]" />,
  peugeot: <SiPeugeot className="w-[3rem] h-[3rem]" />,
  porsche: <SiPorsche className="w-[3rem] h-[3rem]" />,
  renault: <SiRenault className="w-[3rem] h-[3rem]" />,
  rollsroyce: <SiRollsroyce className="w-[3rem] h-[3rem]" />,
  seat: <SiSeat className="w-[3rem] h-[3rem]" />,
  skoda: <SiSkoda className="w-[3rem] h-[3rem]" />,
  smart: <SiSmart className="w-[3rem] h-[3rem]" />,
  subaru: <SiSubaru className="w-[3rem] h-[3rem]" />,
  suzuki: <SiSuzuki className="w-[3rem] h-[3rem]" />,
  tesla: <SiTesla className="w-[3rem] h-[3rem]" />,
  toyota: <SiToyota className="w-[3rem] h-[3rem]" />,
  volkswagen: <SiVolkswagen className="w-[3rem] h-[3rem]" />,
  vw: <SiVolkswagen className="w-[3rem] h-[3rem]" />,
  volvo: <SiVolvo className="w-[3rem] h-[3rem]" />,
  vauxhall: <SiVauxhall className="w-[3rem] h-[3rem]" />,
};

export const carMakes = Object.keys(carLogos);
