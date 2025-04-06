export default function PickupSuccessPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Pickup Confirmed ✅</h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          Thank you for confirming the pickup. The waste item has been assigned for collection.
        </p>
        <a
          href="/dashboard"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Back to Dashboard
        </a>
      </div>
    );
  }
  