'use client';
import { useRouter } from 'next/navigation';
import {
  FiAward,
  FiUsers,
  FiRefreshCcw,
  FiMapPin,
  FiTrendingUp,
  FiHome,
  FiFileText,
  FiUser,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import { useState } from 'react';

const Dashboard = () => {
  const router = useRouter();
  const [glow, setGlow] = useState(false);

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Redirect to report waste
  const goToReportWaste = () => {
    router.push('/dashboard/report-waste');
  };

  // Toggle Glow Effect on Logo Click
  const toggleGlow = () => {
    setGlow(true);
    setTimeout(() => setGlow(false), 500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-green-100 shadow-lg flex flex-col">

        {/* Sidebar Links */}
        <nav className="flex-1 p-4 space-y-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-3 text-gray-700 hover:bg-green-200 p-3 rounded-lg w-full text-left"
          >
            <FiHome />
            <span className="text-lg">Dashboard</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/report-waste')}
            className="flex items-center space-x-3 text-gray-700 hover:bg-green-200 p-3 rounded-lg w-full text-left"
          >
            <FiFileText />
            <span className="text-lg">Report Waste</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/collect-waste')}
            className="flex items-center space-x-3 text-gray-700 hover:bg-green-200 p-3 rounded-lg w-full text-left"
          >
            <FiTrendingUp />
            <span className="text-lg">Collect Waste</span>
          </button>

          <button
  onClick={() => router.push('/dashboard/rewards')}
  className="flex items-center space-x-3 text-gray-700 hover:bg-green-200 p-3 rounded-lg w-full text-left"
>
  <FiAward />
  <span className="text-lg">Rewards</span>
</button>


          <button
            onClick={() => router.push('/dashboard/profile')}
            className="flex items-center space-x-3 text-gray-700 hover:bg-green-200 p-3 rounded-lg w-full text-left"
          >
            <FiUser />
            <span className="text-lg">Profile</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/settings')}
            className="flex items-center space-x-3 text-gray-700 hover:bg-green-200 p-3 rounded-lg w-full text-left"
          >
            <FiSettings />
            <span className="text-lg">Settings</span>
          </button>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-4 text-red-600 hover:bg-red-100 rounded-lg w-full"
        >
          <FiLogOut />
          <span className="text-lg">Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {/* Glowing Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`w-24 h-24 rounded-full transition-all ${
              glow ? 'shadow-[0_0_30px_10px_rgba(34,197,94,0.7)]' : ''
            }`}
            onClick={toggleGlow}
          >
            <Image
              src="/assets/weblogo.png" // ✅ Correct logo path
              alt="EcoSort Logo"
              width={96}
              height={96}
              className="cursor-pointer"
            />
          </div>

          <h2 className="text-3xl font-bold text-green-700 mt-4">
            Welcome to EcoSort AI 🌱
          </h2>
          <p className="text-gray-600 mt-2 text-lg italic">
            "A cleaner future begins with mindful waste management."
          </p>
        </div>

        {/* Button to Report Waste - Moved Above */}
        <div className="flex justify-center mb-10">
          <button
            onClick={goToReportWaste}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition transform hover:scale-105"
            aria-label="Report Waste"
          >
            Report Waste
          </button>
        </div>

        {/* Section for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Eco-Friendly */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-4">
              <FiRefreshCcw className="text-green-500 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold">Eco-Friendly</h3>
            <p className="text-gray-600 mt-2">
              Contribute to a cleaner environment by reporting and collecting waste.
            </p>
          </div>

          {/* Earn Rewards */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-4">
              <FiAward className="text-green-500 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold">Earn Rewards</h3>
            <p className="text-gray-600 mt-2">
              Get tokens for your contributions to waste management efforts.
            </p>
          </div>

          {/* Community-Driven */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
            <div className="flex justify-center mb-4">
              <FiUsers className="text-green-500 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold">Community-Driven</h3>
            <p className="text-gray-600 mt-2">
              Be part of a growing community committed to sustainable practices.
            </p>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
          <h3 className="text-2xl font-semibold text-center mb-6">Our Impact</h3> 
          {/* Impact Section - Updated to Card Layout */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
  {/* Waste Collected */}
  <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
    <div className="flex justify-center mb-4">
      <FiRefreshCcw className="text-green-500 text-4xl" />
    </div>
    <h4 className="text-xl font-semibold">100 kg</h4>
    <p className="text-gray-600">Waste Collected</p>
  </div>

  {/* Reports Submitted */}
  <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
    <div className="flex justify-center mb-4">
      <FiMapPin className="text-green-500 text-4xl" />
    </div>
    <h4 className="text-xl font-semibold">200</h4>
    <p className="text-gray-600">Reports Submitted</p>
  </div>

  {/* Tokens Earned */}
  <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
    <div className="flex justify-center mb-4">
      <FiAward className="text-green-500 text-4xl" />
    </div>
    <h4 className="text-xl font-semibold">10</h4>
    <p className="text-gray-600">Tokens Earned</p>
  </div>

  {/* CO2 Offset */}
  <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
    <div className="flex justify-center mb-4">
      <FiTrendingUp className="text-green-500 text-4xl" />
    </div>
    <h4 className="text-xl font-semibold">40 kg</h4>
    <p className="text-gray-600">CO2 Offset</p>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
