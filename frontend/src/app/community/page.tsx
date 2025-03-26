'use client';
import { motion } from 'framer-motion';

const communityVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function CommunityPage() {
  return (
    <div className="bg-white">
    <motion.div
      className="min-h-screen bg-white px-6 md:px-12 py-12"
      initial="hidden"
      animate="visible"
      variants={communityVariants}
    >
      <h1 className="text-4xl font-bold text-green-600 mb-4">Join Our Community</h1>
      <p className="text-lg text-gray-700">
        Connect with like-minded individuals and organizations who are passionate about making a positive impact on the environment.
      </p>
      <h2 className="text-2xl font-semibold mt-8 text-gray-900">Why Join Us?</h2>
      <ul className="list-disc list-inside text-gray-700 mt-2">
        <li>Participate in awareness campaigns.</li>
        <li>Collaborate with others for clean-up drives.</li>
        <li>Stay informed about waste management trends.</li>
      </ul>
    </motion.div>
    </div>
  );
}
