"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { socialLinks } from "../constants/index";
import EnquiryForm from "./EnquiryForm";

const ContactInfo = () => (
  <motion.div
    className="flex flex-col items-center mt-20 text-center space-y-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <h4 className="text-2xl font-semibold">
      © {new Date().getFullYear()} Ace Motor Sales
    </h4>
    <p className="text-lg">4 Westgate, Heckmondwike, WF16 0EH</p>
    <p className="text-lg">Available daily from 9am to 8pm</p>
    <motion.div whileHover={{ rotate: [0, -5, 5, -5, 5, 0], transition: { repeat: Infinity, duration: 0.4 } }}>
      <Link href="tel:07809107655" className="text-2xl font-bold hover:text-rose-600 transition duration-300">
        07809107655
      </Link>
    </motion.div>
  </motion.div>
);

const SocialIcons = () => (
  <div className="flex space-x-6 mt-6 justify-center">
    {socialLinks.map(({ id, href, icon }) => (
      <motion.a
        key={id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-rose-600 transition-colors duration-300"
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.a>
    ))}
  </div>
);

const Footer = () => (
  <footer className="py-8" id="contact">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">Get in Touch</h2>
    <div className="flex flex-col md:flex-row justify-center px-4 lg:px-8 space-y-8 md:space-y-0">
      <div className="md:w-1/2">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d631.5462629097879!2d-1.6783367301941519!3d53.70835050988343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bdf983824d755%3A0x1ccbf3963f34d05a!2sAce%20Motor%20Sales!5e0!3m2!1sen!2suk!4v1729510614154!5m2!1sen!2suk"
          width="100%"
          height="450"
          style={{ border: 0, borderRadius: 5 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="md:w-1/2 flex flex-col items-center md:ml-6 space-y-6">
        <EnquiryForm />
      </div>
    </div>
    <ContactInfo />
    <SocialIcons />
  </footer>
);

export default Footer;
