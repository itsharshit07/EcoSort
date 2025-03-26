"use client";
import { useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  image: string;
}

export default function ProfileCard() {
  const [user, setUser] = useState<UserProfile>({
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "AI Enthusiast | Web Developer | Problem Solver",
    image: "/assets/profile.png",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>({ ...user });

  // Handle Edit Button
  const handleEditClick = () => setIsEditing(true);

  // Handle Save Changes
  const handleSaveClick = () => {
    setUser(editedUser);
    setIsEditing(false);
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl w-96">
      {/* Profile Image */}
      <div className="flex justify-center">
        <img
          src={user.image}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-blue-500"
        />
      </div>

      {/* Profile Details */}
      <div className="text-center mt-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter Name"
            />
            <input
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter Email"
            />
            <textarea
              value={editedUser.bio}
              onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter Bio"
            />
            <button
              onClick={handleSaveClick}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-2"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-600 mt-2">{user.bio}</p>
            <button
              onClick={handleEditClick}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
