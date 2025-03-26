"use client";
import { useState } from "react";
import { predictWaste } from "@/lib/api";

export default function ReportWaste() {
  const [file, setFile] = useState<File | null>(null);
  const [wasteType, setWasteType] = useState<string | null>(null); // Waste type
  const [confidence, setConfidence] = useState<number | null>(null); // Confidence
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // For error handling

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setWasteType(null); // Clear previous predictions
      setConfidence(null);
      setError(null); // Clear previous errors
    }
  };

  // Submit the file to backend
  const handleSubmit = async () => {
    if (!file) {
      alert("Please select an image!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a new FormData instance
      const formData = new FormData();
      formData.append("file", file); // Append the selected file

      // Send the formData to the backend
      const result = await predictWaste(formData);
      console.log("Prediction result:", result);

      // Check if the response contains valid data
      if (result && result.waste_type && result.confidence !== undefined) {
        setWasteType(result.waste_type);
        setConfidence(result.confidence);
      } else {
        setError("Invalid response format. Please try again.");
      }
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
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-700 mb-5">Report Waste</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        {/* File Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full mb-4"
        />

        {/* Upload Button */}
        <button
          onClick={handleSubmit}
          className={`${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded transition duration-300`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload and Predict"}
        </button>

        {/* Show Prediction Result */}
        {wasteType && confidence !== null && (
          <div className="mt-5 bg-green-100 p-4 rounded">
            <p className="text-green-700 font-bold">Prediction Result:</p>
            <p className="text-gray-800">
              Waste Type: <span className="font-bold">{wasteType}</span>
            </p>
            <p className="text-gray-800">
              Confidence:{" "}
              <span className="font-bold">{confidence.toFixed(2)}%</span>
            </p>
          </div>
        )}

        {/* Show Error if Prediction Fails */}
        {error && (
          <div className="mt-5 bg-red-100 p-4 rounded">
            <p className="text-red-700 font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
