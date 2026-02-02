'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/upload', label: 'Upload Story' },
    { href: '/stories', label: 'Manage Stories' },
    { href: '/trending', label: '🔥 Trending' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center text-xl font-bold text-blue-600">
              Velvet Words Admin
            </Link>
            <div className="ml-10 flex space-x-4">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    pathname === link.href
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
