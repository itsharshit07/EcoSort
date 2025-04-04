"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase"; 
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileCard() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>({});

  // Generate avatar from first letter of name
  const getAvatar = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    return `https://api.dicebear.com/7.x/initials/svg?seed=${firstLetter}`;
  };

  // Fetch user details from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setEditedUser(userData);
        } else {
          setUser({
            uid: currentUser.uid,
            name: currentUser.displayName || "Anonymous",
            email: currentUser.email || "No Email",
            location: "Not set",
            contact: "Not set",
            avatar: getAvatar(currentUser.displayName || "A"),
          });
        }
      }
    };

    fetchUserData();
  }, []);

  // Enable Editing
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Save Edited Information
  const handleSaveClick = async () => {
    if (!user || !auth.currentUser) return;

    try {
      await updateProfile(auth.currentUser, { displayName: editedUser.name });

      await updateDoc(doc(db, "users", user.uid), {
        name: editedUser.name,
        location: editedUser.location,
        contact: editedUser.contact,
      });

      setUser(editedUser);
      setIsEditing(false);
      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Try again!");
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl w-96">
      {/* Profile Image */}
      <div className="flex justify-center">
        <img
          src={user.avatar}
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
              type="text"
              value={editedUser.location}
              onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter Location"
            />
            <input
              type="text"
              value={editedUser.contact}
              onChange={(e) => setEditedUser({ ...editedUser, contact: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter Contact Number"
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
            <h2 className="text-2xl font-semibold text-gray-800"> 😎 {user.name}</h2>
            <p className="text-gray-500"> 📧 {user.email}</p>
            <p className="text-gray-600 mt-2">📌 {user.location}</p>
            <p className="text-gray-600">📞 {user.contact}</p>
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
