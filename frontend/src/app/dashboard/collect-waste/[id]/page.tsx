'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // 🟢 Added useRouter
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Sidebar from '@/app/dashboard/components/sidebar';

const WasteDetails = () => {
  const { id } = useParams(); // Get waste item ID from URL
  const router = useRouter(); // 🟢 Router for navigation
  const [wasteDetails, setWasteDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWasteDetails = async () => {
      if (!id || typeof id !== 'string') {
        console.error('Invalid ID');
        return;
      }

      try {
        const docRef = doc(getFirestore(), 'wasteReports', id); // Firestore doc reference
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setWasteDetails(docSnap.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching waste details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!wasteDetails) return <p className="text-center text-red-500">Waste not found.</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">Waste Details</h1>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <p><strong>Brand Name:</strong> {wasteDetails.brandName}</p>
          <p><strong>Condition:</strong> {wasteDetails.condition}</p>
          <p><strong>Date:</strong> {wasteDetails.date?.seconds ? new Date(wasteDetails.date.seconds * 1000).toLocaleString() : "N/A"}</p>
          <p><strong>Location:</strong> {wasteDetails.location}</p>
          <p><strong>Product Age:</strong> {wasteDetails.productAge} years</p>
          <p><strong>Weight:</strong> {wasteDetails.weight} kg</p>
          <p><strong>Status:</strong> {wasteDetails.status}</p>
          <p><strong>Reported by:</strong> {wasteDetails.userName}</p>

          {/* Display Image If Available */}
          {wasteDetails.imageUrl && (
            <img
              src={wasteDetails.imageUrl}
              alt="Waste"
              className="mt-4 w-64 h-64 object-cover rounded-lg"
            />
          )}

          {/* ✅ Modified Confirm Pickup Button */}
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => router.push(`/confirm-pickup?id=${id}`)}
          >
            Confirm Pickup
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasteDetails;
