"use client";

import { motion } from "framer-motion";
import { socialLinks } from "../constants";
import EnquiryForm from "./EnquiryForm";
import { useInView } from "react-intersection-observer";

const Footer = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <footer id="contact" className="py-28 px-4 lg:px-8 text-white relative">
      <div className="space-y-20">
        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center tracking-tight"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get in Touch
        </motion.h2>

        {/* Main Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            max-w-7xl mx-auto rounded-2xl p-6 md:p-10
            bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950
            shadow-2xl border border-white/10
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {inView ? (
                <iframe
                  title="Ace Motor Sales Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d631.5462629097879!2d-1.6783367301941519!3d53.70835050988343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bdf983824d755%3A0x1ccbf3963f34d05a!2sAce%20Motor%20Sales!5e0!3m2!1sen!2suk!4v1729510614154!5m2!1sen!2suk"
                  className="w-full h-[400px] md:h-[450px] rounded-xl shadow-lg"
                  loading="lazy"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-[400px] md:h-[450px] rounded-xl bg-black/20 animate-pulse" />
              )}
            </motion.div>

            {/* Enquiry */}
            <div className="flex justify-center">
              <EnquiryForm />
            </div>
          </div>
        </motion.div>

        {/* Footer Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="
            max-w-4xl mx-auto rounded-xl px-6 py-8
            bg-gradient-to-br from-rose-900/80 via-rose-800/80 to-rose-950/80
            backdrop-blur-md shadow-xl border border-white/10
            text-center space-y-4
          "
        >
          <h3 className="text-2xl font-semibold">
            © {new Date().getFullYear()} Ace Motor Sales
          </h3>

          <p className="text-white/85">4 Westgate, Heckmondwike, WF16 0EH</p>

          <p className="text-white/70">
            Keys in the ignition from 9am to 8pm. Cruise on in anytime.
          </p>

          {/* Phone */}
          <a
            href="tel:+447809107655"
            aria-label="Call Ace Motor Sales on 07809 107655"
            className="
              inline-block text-3xl font-bold
              text-rose-300 hover:text-rose-200 transition
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-rose-300/50
            "
          >
            07809 107655
          </a>

          {/* Socials */}
          <div className="flex justify-center gap-5 pt-3">
            {socialLinks.map(({ id, href, icon, name }) => (
              <motion.a
                key={id}
                href={href}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label={name}
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="text-2xl text-white/80 hover:text-rose-300"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Signature */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-base md:text-lg leading-tight text-white/70 text-center">
          <span>Built with</span>

          <motion.span
            aria-hidden
            className="inline-block leading-none"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          >
            💚
          </motion.span>

          <span>
            by{" "}
            <a
              href="https://legxcysol.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white/80 hover:text-white transition"
            >
              Legxcy Solutions
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
