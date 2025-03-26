'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [glow, setGlow] = useState(false);

  // Check auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Extract username from email
        const email = user.email || '';
        const name = email.substring(0, email.indexOf('@'));
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        setUsername(formattedName);
      } else {
        setUsername(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Toggle Glow Effect on Logo Click
  const toggleGlow = () => {
    setGlow(true);
    setTimeout(() => setGlow(false), 500);
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-bold text-green-600">EcoSort AI</h1>
        <p className="text-gray-600">Loading...</p>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md border-b border-gray-300">
      {/* Glowing Logo with EcoSort AI Text - No Redirect */}
      <div className="flex items-center space-x-3">
        <div
          className={`w-12 h-12 rounded-full transition-all ${
            glow ? 'shadow-[0_0_20px_5px_rgba(34,197,94,0.7)]' : ''
          }`}
          onClick={toggleGlow} // Glow effect only
        >
          <Image
            src="/assets/weblogo.png" // ✅ Correct logo path
            alt="EcoSort Logo"
            width={48}
            height={48}
          />
        </div>
        <h1 className="text-2xl font-bold text-green-600">EcoSort AI</h1>
      </div>

      {/* Centered Navbar Items */}
      <div className="flex-1 flex justify-center space-x-8">
        {!user ? (
          <>
            <a href="/" className="text-gray-700 hover:text-green-600">
              Home
            </a>
            <a href="/about" className="text-gray-700 hover:text-green-600">
              About Us
            </a>
            <a href="/tips" className="text-gray-700 hover:text-green-600">
              Tips
            </a>
            <a href="/community" className="text-gray-700 hover:text-green-600">
              Community
            </a>
          </>
        ) : (
          <p className="text-green-600 font-semibold">
            Hello, {username || 'User'}
          </p>
        )}
      </div>

      {/* Right Aligned Buttons */}
      <div className="flex items-center space-x-6">
        {!user ? (
          <button
            onClick={() => router.push('/signup')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Join Us
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
