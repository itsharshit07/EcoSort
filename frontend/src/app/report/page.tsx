'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

interface Report {
  id: string;
  wasteType: string;
  amount: number;
  date: string;
}

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports');
        setReports(res.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Waste Analysis Reports 📊</h2>
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          {reports.length === 0 ? (
            <p className="text-gray-700">No reports available.</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Waste Type</th>
                  <th className="py-3 px-6 text-center">Amount (kg)</th>
                  <th className="py-3 px-6 text-center">Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{report.wasteType}</td>
                    <td className="py-3 px-6 text-center">{report.amount}</td>
                    <td className="py-3 px-6 text-center">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
