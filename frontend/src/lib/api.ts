// src/lib/api.ts
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000"; // Ensure this matches the backend URL

// Upload image and get prediction
export const predictWaste = async (formData: FormData) => {
  try {
    // Make the POST request to /predict/
    const response = await axios.post(`${BASE_URL}/predict/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Log the response for debugging
    console.log("Prediction response:", response);

    // Check if response status is 200 and data exists
    if (response.status === 200 && response.data) {
      console.log("Prediction result:", response.data);
      return response.data; // Return the result
    } else {
      throw new Error("Unexpected response format or empty data.");
    }
  }// eslint-disable-next-line @typescript-eslint/no-explicit-any 
  catch (error: any) {
    console.error("Error predicting waste:", error?.response?.data || error.message);
    throw error;
  }
};
