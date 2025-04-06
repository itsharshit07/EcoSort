"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust this import based on your setup
import Sidebar from "../components/sidebar";

export default function RewardsPage() {
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const rewardData = [
    {
      title: "Report Waste",
      points: "+10",
      description: "Earn 10 ECO points every time you report valid waste."
    },
    {
      title: "Successful Pickup",
      points: "+30",
      description: "Get 30 ECO points for verifying waste pickup."
    },
    {
      title: "Refer a Friend",
      points: "+20",
      description: "Earn bonus when your friend joins and contributes."
    },
  ];

  useEffect(() => {
    const fetchUserRewards = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "userRewards", user.email!);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setRewardPoints(userSnap.data().points || 0);
        } else {
          setRewardPoints(0); // No rewards yet
        }
      }

      setLoading(false);
    };

    fetchUserRewards();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-green-500 leading-tight">
              ECO <span className="text-gray-800">Rewards</span>
            </h1>
          <p className="text-gray-700 mb-8">
            Contribute to a cleaner environment and get rewarded for your actions!
          </p>

          {/* Total Rewards Points */}
          {!loading && rewardPoints !== null && (
            <div className="bg-white shadow-md rounded-xl p-6 text-center mb-8">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">
                Your total ECO points
              </h2>
              <p className="text-4xl font-bold text-green-600">{rewardPoints} ECO <span className="text-gray-800">pts</span></p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardData.map((reward, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
                <h2 className="text-xl font-semibold text-green-700">{reward.title}</h2>
                <p className="text-green-600 text-lg font-bold mt-2">{reward.points}</p>
                <p className="text-gray-500 text-sm mt-1">{reward.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
