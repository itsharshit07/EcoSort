'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const buttonVariants = {
  hover: {
    scale: 1.1,
    transition: { duration: 0.3 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, delay: 0.3 } },
};

export default function Home() {
  return (
    <div className="bg-white">
      <div className="min-h-screen bg-white">
        <section className="flex flex-col md:flex-row items-center justify-center px-6 md:px-12 py-12 space-y-10 md:space-y-0 md:space-x-10">
          {/* Animated Text Section */}
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Let’s Keep The City <span className="text-green-600">Clean</span>
            </h2>
            <p className="text-gray-700 mt-3">
              Sparkling streets, vibrant communities: Together, we can keep our city clean and green.
            </p>
            <Link href="/login"> {/* ✅ Redirects to login now */}
              <motion.button
                className="mt-5 px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition"
                variants={buttonVariants}
                whileHover="hover"
              >
                Join Us
              </motion.button>
            </Link>
          </motion.div>

          {/* Animated Image Section */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          >
            <img
              src="/assets/logoo.jpg" // Replace this with your image
              alt="Trash Bin"
              className="w-72 md:w-80 lg:w-96"
            />
          </motion.div>
        </section>
      </div>
    </div>
  );
}