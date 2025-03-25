'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const linkVariants = {
  hover: {
    scale: 1.1,
    color: '#1FA746',
    transition: { duration: 0.2 },
  },
};

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md w-full px-10 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-green-600">
        <span className="text-black">ECOSORT</span>
      </Link>
      <div className="flex space-x-6">
        <NavLink href="/" label="Home" active={pathname === '/'} />
        <NavLink href="/about" label="About us" />
        <NavLink href="/tips" label="Tips" />
        <NavLink href="/community" label="Community" />
      </div>
      <Link href="/join">
        <motion.button
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          whileHover={{ scale: 1.1 }}
        >
          Join Us
        </motion.button>
      </Link>
    </nav>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  const MotionLink = motion(Link);

  return (
    <MotionLink
      href={href}
      passHref
      className={`text-gray-700 hover:text-green-600 transition ${active ? 'font-bold text-green-600' : ''}`}
      whileHover="hover"
      variants={linkVariants}
    >
      {label}
    </MotionLink>
  );
}
