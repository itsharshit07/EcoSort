"use client";
import Sidebar from "../components/sidebar";
import ProfileCard from "./profilecard";

export default function Profile() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-700">Your Profile</h1>
        <p className="text-gray-600 mt-2">Update your profile details here.</p>

        {/* Profile Card Section */}
        <div className="mt-6 flex justify-center">
          <ProfileCard />
        </div>
      </div>
    </div>
  );
}
