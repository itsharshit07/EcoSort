import Sidebar from '../components/sidebar';

export default function Settings() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-700">Settings</h1>
        <p className="text-gray-600 mt-2">Modify your application settings here.</p>
      </div>
    </div>
  );
}
