'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminNav from '@/components/AdminNav';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await adminAPI.getStories();
      // Handle different response structures
      const storiesArray = data.stories || data || [];
      const stories = Array.isArray(storiesArray) ? storiesArray : [];
      
      setStats({
        total: stories.length,
        published: stories.filter(s => s.status === 'published').length,
        draft: stories.filter(s => s.status === 'draft').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({ total: 0, published: 0, draft: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Stories</div>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Published</div>
              <div className="text-3xl font-bold text-green-600">{stats.published}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Draft</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.draft}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/upload" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">📤 Upload New Story</h3>
              <p className="text-gray-600">Upload DOCX files with automatic translation</p>
            </Link>
            
            <Link href="/stories" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">📚 Manage Stories</h3>
              <p className="text-gray-600">View, edit, and delete existing stories</p>
            </Link>

            <Link href="/trending" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🔥 Trending Stories</h3>
              <p className="text-gray-600">Manage trending stories for homepage</p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
