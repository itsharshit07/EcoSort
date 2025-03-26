'use client';
import { motion } from 'framer-motion';

const aboutVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function AboutPage() {
  return (
    <div className="bg-white">
    <motion.div
      className="min-h-screen bg-white px-6 md:px-12 py-12"
      initial="hidden"
      animate="visible"
      variants={aboutVariants}
    >
      <h1 className="text-4xl font-bold text-green-600 mb-4">About Us</h1>
      <p className="text-lg text-gray-700">
        EcoSort AI is dedicated to revolutionizing waste management through artificial intelligence.
        Our mission is to help communities manage e-waste efficiently and promote sustainable practices.
      </p>
      <h2 className="text-2xl font-semibold mt-8 text-gray-900">Our Vision</h2>
      <p className="text-lg text-gray-700 mt-2">
        To create a world where technology and environmental consciousness go hand in hand, making
        our cities cleaner and greener.
      </p>
    </motion.div>
    </div>
  );
}
