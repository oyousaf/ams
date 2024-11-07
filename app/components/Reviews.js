import { reviews } from "../constants/index";
import { FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion"; 

const Reviews = () => {
  return (
    <section className="py-8" id="reviews">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">Reviews</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 lg:px-8">
        {reviews.map(({ name, feedback }, index) => (
          <motion.div
            key={index}
            className="bg-rose-800 p-4 shadow-md rounded-lg text-center" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            whileHover={{ scale: 1.05 }} 
          >
            <div className="flex justify-center mb-2">
              <FaQuoteLeft className="text-3xl text-white mt-2" />
            </div>
            <p className="text-lg pt-2">{feedback}</p>
            <h4 className="text-3xl font-bold mt-4">{name}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
