'use client';
import Navbar from '@/components/Navbar';
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

const featureVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.3 },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20">
        {/* Animated Text Section */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Let’s Keep The City <span className="text-green-600">Clean</span>
          </h2>
          <p className="text-gray-700 mt-4">
            Sparkling streets, vibrant communities: Together, we can keep our city clean and green.
          </p>
          <Link href="/join">
            <motion.button
              className="mt-6 px-6 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition"
              variants={buttonVariants}
              whileHover="hover"
            >
              Join Us
            </motion.button>
          </Link>
        </motion.div>

        {/* Animated Image Section */}
        <motion.div
          className="md:w-1/2 flex justify-center mt-8 md:mt-0"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <img
            src="/assets/logo.jpg" // Replace this with your image
            alt="Trash Bin"
            className="w-80 md:w-96"
          />
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, index }: { title: string; description: string; index: number }) {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition"
      custom={index}
      initial="hidden"
      whileInView="visible"
      variants={featureVariants}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-bold text-green-600">{title}</h3>
      <p className="text-gray-700 mt-2">{description}</p>
    </motion.div>
  );
}