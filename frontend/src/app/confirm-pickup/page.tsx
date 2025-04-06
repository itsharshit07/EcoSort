"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../dashboard/components/sidebar";
import { updateUserRewards } from "@/lib/rewards";


export default function ConfirmPickupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wasteId = searchParams.get("id");

  const [pickupData, setPickupData] = useState({
    name: "",
    contact: "",
    vehicleNo: "",
    company: "",
  });

  const [wasteDetails, setWasteDetails] = useState<any>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // 🔐 Get current user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🧠 Fetch waste details
  useEffect(() => {
    const fetchWaste = async () => {
      if (!wasteId) return;
      try {
        const docRef = doc(db, "wasteReports", wasteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWasteDetails(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching waste details", error);
      }
    };
    fetchWaste();
  }, [wasteId]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setPickupData({ ...pickupData, [e.target.name]: e.target.value });
  };

  // ✅ Confirm Pickup → In Progress
  const handleConfirm = async () => {
    if (!wasteId || !currentUserEmail) return alert("No user or waste ID");

    try {
      await updateDoc(doc(db, "wasteReports", wasteId), {
        pickupStatus: "In Progress",
        pickedBy: {
          ...pickupData,
          email: currentUserEmail, // 🆕 Add picker email
        },
        status: "In Progress",
      });

      alert("Pickup marked as In Progress!");
      router.push("/pickup-success");
    } catch (error) {
      console.error("Error updating pickup info", error);
      alert("Failed to confirm pickup.");
    }
  };

  // ✅ Mark as Verified
  const handleVerify = async () => {
    if (!wasteId) return;

    try {
      await updateDoc(doc(db, "wasteReports", wasteId), {
        pickupStatus: "Verified",
        status: "Verified",
      });

      alert("Pickup marked as Verified!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error verifying pickup:", error);
      alert("Failed to verify pickup.");
    }
    await updateUserRewards( currentUserEmail! , 30,);

  };

  // ✅ Check if current user can see "Mark as Verified"
  const canVerify = () => {
    if (!wasteDetails || !currentUserEmail) return false;
    const isReporter = wasteDetails.userEmail === currentUserEmail;
    const isPicker = wasteDetails?.pickedBy?.email === currentUserEmail;
    return (isReporter || isPicker) && wasteDetails.status === "In Progress";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-8">Confirm Pickup</h1>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
          {/* 📦 Waste Product Details */}
          {wasteDetails ? (
            <div className="max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              <p><strong>Brand:</strong> {wasteDetails.brandName}</p>
              <p><strong>Condition:</strong> {wasteDetails.condition}</p>
              <p><strong>Weight:</strong> {wasteDetails.weight} kg</p>
              <p><strong>Location:</strong> {wasteDetails.location}</p>
              <p><strong>Reported by:</strong> {wasteDetails.userEmail || "N/A"}</p>
              {wasteDetails.imageUrl && (
                <img
                  src={wasteDetails.imageUrl}
                  alt="Product"
                  className="w-48 h-48 mt-4 object-cover rounded"
                />
              )}

              {/* ✅ Show "Mark as Verified" if eligible */}
              {canVerify() && (
                <button
                  onClick={handleVerify}
                  className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                  Mark as Verified
                </button>
              )}
            </div>
          ) : (
            <p>Loading product details...</p>
          )}

          {/* 🚚 Pickup Person Form */}
          <div className="max-w-md bg-white p-7 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Pickup Person Details</h2>

            <input
              type="text"
              name="name"
              value={pickupData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              name="contact"
              value={pickupData.contact}
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              name="vehicleNo"
              value={pickupData.vehicleNo}
              onChange={handleChange}
              placeholder="Vehicle Number"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              name="company"
              value={pickupData.company}
              onChange={handleChange}
              placeholder="Company Name (Optional)"
              className="w-full p-2 border rounded mb-4"
            />

            <button
              onClick={handleConfirm}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Confirm Pickup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
