'use client';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage('Error uploading file');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Upload Waste Image 📸</h2>
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 w-full text-sm text-gray-700"
          />
          <button
            onClick={handleUpload}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Upload
          </button>
          {message && <p className="mt-4 text-lg text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
}
