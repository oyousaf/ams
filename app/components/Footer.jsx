"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { socialLinks } from "../constants/index";
import EnquiryForm from "./EnquiryForm";
import { useInView } from "react-intersection-observer";

const Footer = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <footer id="contact" className="py-24 text-white px-4 lg:px-8 space-y-16">
      {/* Heading */}
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Get in Touch
      </motion.h2>

      {/* Map + Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
        {/* Map */}
        <motion.div
          ref={ref}
          className="w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {inView ? (
            <iframe
              title="Ace Motor Sales Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d631.5462629097879!2d-1.6783367301941519!3d53.70835050988343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bdf983824d755%3A0x1ccbf3963f34d05a!2sAce%20Motor%20Sales!5e0!3m2!1sen!2suk!4v1729510614154!5m2!1sen!2suk"
              className="w-full h-[400px] md:h-[450px] rounded-lg shadow-lg"
              loading="lazy"
              style={{ border: 0 }}
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="w-full h-[400px] md:h-[450px] rounded-lg bg-black/20 animate-pulse" />
          )}
        </motion.div>

        {/* Enquiry Form */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EnquiryForm />
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.div
        className="text-center space-y-3 text-lg md:text-xl mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-semibold">
          © {new Date().getFullYear()} Ace Motor Sales
        </h3>
        <p>4 Westgate, Heckmondwike, WF16 0EH</p>
        <p>Keys in the ignition from 9am to 8pm — cruise on in anytime!</p>
        <Link
          href="tel:07809107655"
          className="text-2xl font-bold ringing-phone transition"
        >
          07809107655
        </Link>
      </motion.div>

      {/* Socials */}
      <div className="flex justify-center space-x-6 mt-8">
        {socialLinks.map(({ id, href, icon, name }) => (
          <motion.a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="text-2xl hover:text-rose-500"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.a>
        ))}
      </div>

      {/* Signature */}
      <div className="text-xl flex justify-center items-center gap-1 pt-8">
        Built with{" "}
        <motion.span
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="inline-block"
        >
          💚
        </motion.span>{" "}
        by{" "}
        <a
          href="https://legxcysol.dev"
          target="_blank"
          className="hover:underline"
        >
          Legxcy Solutions
        </a>
      </div>
    </footer>
  );
};

export default Footer;
