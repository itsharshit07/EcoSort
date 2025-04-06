'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Sidebar from "../components/sidebar";
import { useRouter } from 'next/navigation';
import {
  FaMapMarkerAlt, FaTrash, FaWeightHanging, FaCalendarAlt,
  FaUser, FaBox, FaMap
} from "react-icons/fa";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CollectWaste = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wasteItems, setWasteItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [customFilter, setCustomFilter] = useState('');
  const router = useRouter();

  // 🔐 Get current user email
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  // 📦 Fetch waste reports
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

  // 🗑 Delete a report
  const deleteReport = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this report?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'wasteReports', id));
      setWasteItems((prev) => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete the report. Please try again.');
    }
  };

  // 🔍 Filter waste reports
  const filteredItems = wasteItems.filter(item => {
    const matchesLocation = item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || item.status === statusFilter;

    const isReporter = currentUserEmail && item.userEmail === currentUserEmail;
    const isPicker = currentUserEmail && item?.pickedBy?.email === currentUserEmail;

    const matchesCustom =
      customFilter === 'myReports' ? isReporter :
      customFilter === 'myPickups' ? isPicker :
      true;

    return matchesLocation && matchesStatus && matchesCustom;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Waste Collection Tasks</h1>

        {/* 🔍 Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-2 border rounded-md"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="In Progress">In Progress</option>
            <option value="Verified">Verified</option>
          </select>
          <select
            value={customFilter}
            onChange={(e) => setCustomFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">All Tasks</option>
            <option value="myReports">My Reports</option>
            <option value="myPickups">My Pickups</option>
          </select>
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
                    <h2 className="text-lg font-semibold">
                      {item.wasteType} ( {item.brandName} ) {item.condition}
                    </h2>

                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                      <FaMap />
                      <span>{item.location}</span>
                    </div>

                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                      <FaWeightHanging />
                      <span>Approximately {item.weight} kg</span>
                    </div>

                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                      <FaBox />
                      <span>Product Age: {item.productAge} years</span>
                    </div>

                    <div className="text-gray-500 text-sm flex items-center space-x-2">
                      <FaUser />
                      <span>Reported by: {item.userName}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-end">
                  <div className="text-gray-500 text-sm flex items-center space-x-2">
                    <FaCalendarAlt />
                    <span>
                      {item.date && item.date.seconds
                        ? new Date(item.date.seconds * 1000).toLocaleDateString()
                        : "Invalid Date"}
                    </span>
                  </div>

                  <span
                    className={`mt-1 px-3 py-1 text-xs rounded-full ${
                      item.status === "Available"
                        ? "bg-green-200 text-green-700"
                        : item.status === "In Progress"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-purple-200 text-purple-700"
                    }`}
                  >
                    {item.status}
                  </span>

                  {/* Show "Pick Up"/"Update" button if not the reporter */}
{(item.status === "Available" || item.status === "In Progress") &&
  item.userEmail !== currentUserEmail && (
    <button
      onClick={() => router.push(`/dashboard/collect-waste/${item.id}`)}
      className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
    >
      {item.status === "Available" ? "Pick Up" : "Update"}
    </button>
)}
                  {/* Delete button shown only if current user is the reporter */}
                  {item.userEmail === currentUserEmail && item.status === "Available" && (
                    <button
                      onClick={() => deleteReport(item.id)}
                      className="mt-2 px-3 py-1 bg-red-400 text-white rounded hover:bg-red-600 text-sm flex items-center"
                    >
                      <FaTrash className="mr-1" /> Delete
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
