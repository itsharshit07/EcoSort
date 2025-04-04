'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Sidebar from "../components/sidebar";
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaTrash, FaWeightHanging, FaCalendarAlt, FaUser, FaBox, FaMap } from "react-icons/fa";

const CollectWaste = () => {
  const [wasteItems, setWasteItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'wasteReports'));
        const wasteData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWasteItems(wasteData);
      } catch (error) {
        console.error('Error fetching waste data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteData();
  }, []);

  // 🔍 Filter by Search Query
  const filteredItems = wasteItems.filter(item =>
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Waste Collection Tasks</h1>

        {/* 🔍 Search Bar */}
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search by area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <button className="ml-2 p-2 bg-gray-300 rounded-md">
            Search
          </button>
        </div>

        {loading ? (
          <p>Loading waste reports...</p>
        ) : filteredItems.length === 0 ? (
          <p>No waste reports available.</p>
        ) : (
          <div className="flex flex-col space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
                
                {/* Left Section */}
                <div className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="text-gray-600 mt-1" />
                  <div>
                    {/* Brand Name & Condition */}
                    <h2 className="text-lg font-semibold">
                      {item.wasteType} ( {item.brandName} ) {item.condition}
                    </h2>

                    {/* Waste Type */}
                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                      <FaMap />
                      <span>{item.location}</span>
                    </div>

                    {/* Weight */}
                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                      <FaWeightHanging />
                      <span>Approximately {item.weight} kg</span>
                    </div>

                    {/* Product Age */}
                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                      <FaBox />
                      <span>Product Age: {item.productAge} years</span>
                    </div>

                    {/* Username (Reporter) */}
                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                      <FaUser />
                      <span>Reported by: {item.userName}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-end">
                  {/* Date */}
                  <div className="text-gray-500 text-sm flex items-center space-x-2">
                    <FaCalendarAlt />
                    <span>
                      {item.date && item.date.seconds
                        ? new Date(item.date.seconds * 1000).toLocaleDateString()
                        : "Invalid Date"}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {item.status === "Available" ? (
                    <span className="bg-green-200 text-green-700 px-3 py-1 text-xs rounded-full mt-2">
                      Available
                    </span>
                  ) : item.status === "In Progress" ? (
                    <span className="bg-blue-200 text-blue-700 px-3 py-1 text-xs rounded-full mt-2">
                      In Progress
                    </span>
                  ) : item.status === "Verified" ? (
                    <span className="bg-purple-200 text-purple-700 px-3 py-1 text-xs rounded-full mt-2">
                      Verified
                    </span>
                  ) : null}

                  {/* Pickup Button */}
                  {item.status === "Available" && (
                    <button
                      onClick={() => router.push(`/dashboard/collect-waste/${item.id}`)}
                      className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Pick Up
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectWaste;
