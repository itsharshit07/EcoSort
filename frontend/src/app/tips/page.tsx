'use client';
import { motion } from 'framer-motion';

const tipsVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const tips = [
  { title: 'Reduce Electronic Waste', description: 'Consider donating or recycling old devices.' },
  { title: 'Separate E-Waste Properly', description: 'Avoid mixing e-waste with regular trash.' },
  { title: 'Participate in Clean Drives', description: 'Join local initiatives to manage waste effectively.' },
];

export default function TipsPage() {
  return (
    <div className="bg-white">
    <motion.div
      className="min-h-screen bg-white px-6 md:px-12 py-12"
      initial="hidden"
      animate="visible"
      variants={tipsVariants}
    >
      <h1 className="text-4xl font-bold text-green-600 mb-4">Waste Management Tips</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-green-600">{tip.title}</h3>
            <p className="text-gray-700 mt-2">{tip.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
    </div>
  );
}
