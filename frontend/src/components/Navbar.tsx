'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import Image from 'next/image';
import { FaBell, } from 'react-icons/fa';
import { FiAward } from 'react-icons/fi';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [glow, setGlow] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [rewardTokens, setRewardTokens] = useState<number>(0);

  // ✅ Check auth state and get user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const email = user.email || '';
        const name = email.substring(0, email.indexOf('@'));
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        setUsername(formattedName);

        // 🎖️ Fetch reward tokens
        const docRef = doc(db, 'users', email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRewardTokens(docSnap.data().rewardTokens || 0);
        }

        // 🔔 Fetch notifications
        const notifQuery = query(
          collection(db, 'notifications'),
          where('userEmail', '==', email),
          orderBy('timestamp', 'desc')
        );
        const unsubNotifs = onSnapshot(notifQuery, (snapshot) => {
          const notifs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifications(notifs);
        });

        return () => unsubNotifs();
      } else {
        setUsername(null);
        setRewardTokens(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    const notifRef = doc(db, 'notifications', id);
    await updateDoc(notifRef, { read: true });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const toggleGlow = () => {
    setGlow(true);
    setTimeout(() => setGlow(false), 500);
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md border-b border-gray-300">
      {/* 🌱 Logo */}
      <div className="flex items-center space-x-3">
        <div
          className={`w-12 h-12 rounded-full transition-all cursor-pointer ${
            glow ? 'shadow-[0_0_20px_5px_rgba(34,197,94,0.7)]' : ''
          }`}
          onClick={toggleGlow}
        >
          <Image
            src="/assets/weblogo.png"
            alt="EcoSort Logo"
            width={48}
            height={48}
          />
        </div>
        <h1 className="text-2xl font-bold text-green-600">EcoSort AI</h1>
      </div>

      {/* 🧭 Center Navigation */}
      <div className="flex-1 flex justify-center space-x-4">
        {!user ? (
          <>
            <a href="/" className="text-gray-700 hover:text-green-600">Home</a>
            <a href="/about" className="text-gray-700 hover:text-green-600">About Us</a>
            <a href="/tips" className="text-gray-700 hover:text-green-600">Tips</a>
            <a href="/community" className="text-gray-700 hover:text-green-600">Community</a>
          </>
        ) : (
          <p className="text-green-600 font-semibold">Hello, {username || 'User'}</p>
        )}
      </div>

      {/* 🔔 Notification & 🎖️ Rewards */}
      <div className="flex items-center space-x-6 relative">
            {/* 🔔 Notifications in box */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center relative"
              >
                <FaBell className="text-lg text-gray-700" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md z-50 p-3 max-h-96 overflow-y-auto">
                  <h4 className="font-bold mb-2">Notifications</h4>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="border-b py-2">
                        <p className={`text-sm ${notif.read ? 'text-gray-500' : 'text-black font-semibold'}`}>
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-blue-500 text-xs mt-1"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>


        {/* 🚪 Logout / Join Us */}
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
