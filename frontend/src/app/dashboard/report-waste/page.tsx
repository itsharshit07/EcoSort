"use client";
import { useState, useCallback, useEffect  } from "react";
import { useDropzone } from "react-dropzone";
import { predictWaste } from "@/lib/api";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";
import Sidebar from "../components/sidebar";
import { sendNotification } from "@/lib/sendNotification"; 
import { updateUserRewards } from "@/lib/rewards";

export default function ReportWaste() {
  const [file, setFile] = useState<File | null>(null);
  const [wasteType, setWasteType] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [location, setLocation] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // New State for Additional Fields
  const [userName, setUserName] = useState<string>("");
  const [productAge, setProductAge] = useState<number | null>(null);
  const [brandName, setBrandName] = useState<string>("");
  const [condition, setCondition] = useState<string>("Good");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });
  
    return () => unsubscribe(); // Clean up on unmount
  }, []);
  

  const wasteCategories = [
    "Battery",
    "Keyboard",
    "Microwave",
    "Mobile",
    "Mouse",
    "PCB",
    "Player",
    "Printer",
    "Television",
    "Washing Machine",
  ];

  // Handle file change (Upload via Input)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      resetState();
    }
  };

  // Handle file drop (Drag and Drop)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      resetState();
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // Reset state after file change
  const resetState = () => {
    setWasteType(null);
    setConfidence(null);
    setError(null);
  };

  // Submit the file and additional data to backend
  const handleSubmit = async () => {
    if (!file) {
      alert("Please select or drag an image!");
      return;
    }
    if (!weight || weight <= 0) {
      alert("Please enter a valid weight.");
      return;
    }
    if (!location) {
      alert("Please enter the location.");
      return;
    }
    if (!userName) {
      alert("Please enter your name.");
      return;
    }
    if (!productAge || productAge <= 0) {
      alert("Please enter a valid product age.");
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("weight", String(weight));
      formData.append("location", location);
      formData.append("userName", userName);
      formData.append("productAge", String(productAge));
      formData.append("brandName", brandName);
      formData.append("condition", condition);
      const result = await predictWaste(formData);
      console.log("Prediction result:", result);
  
      if (!result || !result.waste_type || result.confidence === undefined) {
        setError("Invalid response format. Please try again.");
        setLoading(false);
        return;
      }
      setWasteType(result.waste_type);
      setConfidence(result.confidence);
      await addDoc(collection(db, "wasteReports"), {
        userName,
        userEmail,
        productAge,
        brandName,
        condition,
        weight,
        location,
        wasteType: result.waste_type, 
        confidence: result.confidence,
        status: "Available",
        date: Timestamp.now(),
        imageUrl: file ? URL.createObjectURL(file) : "",
      });

      await sendNotification(
        userEmail!,
        `Thanks ${userName}, your ${result.waste_type} waste report has been submitted and your ECO points will be credited to your account shortly`
      );
      await updateUserRewards(userEmail!, 10);
     
      setSuccess("Waste reported successfully! 🎉");
  
    } catch (error: any) {
      console.error("Failed to get prediction:", error);
      setError(
        error?.response?.data?.detail || "Prediction failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };   

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl w-full">
          {/* Upload and Form Section */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
              Report Waste
            </h1>

            {/* Drag and Drop or File Upload */}
            <div
              {...getRootProps()}
              className={`border-2 ${
                isDragActive ? "border-green-500" : "border-gray-300"
              } border-dashed rounded-lg p-20 mb-10 cursor-pointer bg-gray-50 hover:bg-gray-100 transition`}
            >
              <input {...getInputProps()} />
              {file ? (
                <p className="text-green-600 text-center font-medium">
                  ✅ {file.name} selected
                </p>
              ) : isDragActive ? (
                <p className="text-green-500 text-center">
                  Drop the image here...
                </p>
              ) : (
                <p className="text-green-600 text-center">
                  Drag & Drop an image here, or click to select one
                </p>
              )}
            </div>

            {/* ✅ Additional Sections Added Here */}
            {/* Name Input */}
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg focus:ring focus:ring-green-300"
            />

            {/* Product Age Input */}
            <input
              type="number"
              placeholder="Enter how old the product is (in years)"
              value={productAge || ""}
              onChange={(e) => setProductAge(Number(e.target.value))}
              className="border p-2 w-full mb-4 rounded-lg focus:ring focus:ring-green-300"
            />

            {/* Brand Name Input */}
            <input
              type="text"
              placeholder="Enter the brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg focus:ring focus:ring-green-300"
            />

            {/* Condition Dropdown */}
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg focus:ring focus:ring-green-300"
            >
              <option value="Good">Good (Functional)</option>
              <option value="Repairable">Repairable</option>
              <option value="Scrap">Scrap (For Recycling)</option>
            </select>

            {/* Weight Input */}
            <input
              type="number"
              placeholder="Enter approximate weight (in kg)"
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="border p-2 w-full mb-4 rounded-lg focus:ring focus:ring-green-300"
            />

            {/* Location Input */}
            <input
              type="text"
              placeholder="Enter location of waste"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-2 w-full mb-6 rounded-lg focus:ring focus:ring-green-300"
            />

            {/* Upload and Predict Button */}
            <button
              onClick={handleSubmit}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white px-6 py-3 rounded-lg w-full transition duration-300 mb-8`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Upload and Predict"}
            </button>

            {/* Show Prediction Result */}
            {wasteType && confidence !== null && (
              <div className="mt-6 bg-green-100 p-4 rounded-lg shadow-md">
                <p className="text-green-700 font-bold">Prediction Result:</p>
                <p className="text-green-800">
                  Waste Type: <span className="font-bold">{wasteType}</span>
                </p>
                <p className="text-green-800">
                  Confidence:{" "}
                  <span className="font-bold">{confidence.toFixed(2)}%</span>
                </p>
              </div>
            )}

            {/* Show Error if Prediction Fails */}
            {error && (
              <div className="mt-6 bg-red-100 p-4 rounded-lg shadow-md">
                <p className="text-red-700 font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Waste Categories Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-3">
              Types of E-Waste Currently Supported
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-none">
              {wasteCategories.map((category, index) => (
                <li
                  key={index}
                  className="bg-green-100 text-green-700 p-2 rounded text-sm font-medium text-center"
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
