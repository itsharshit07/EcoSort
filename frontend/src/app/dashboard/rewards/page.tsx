'use client';
import Sidebar from '../components/sidebar'; // ✅ Import Sidebar
import { FiAward } from 'react-icons/fi';

const RewardsPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Imported */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center">
          <FiAward className="mr-2" /> Rewards & Achievements
        </h2>

        {/* Rewards Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-lg text-gray-600 mb-4">
            Earn tokens and rewards for your contributions to waste management efforts!
          </p>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Report and collect waste to earn EcoTokens 🌱</li>
            <li>Redeem tokens for exclusive rewards and benefits 🎁</li>
            <li>Contribute consistently to unlock badges and recognition 🏆</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
