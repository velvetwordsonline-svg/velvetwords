'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TrendingManagement() {
  const router = useRouter();
  const [trendingStories, setTrendingStories] = useState([]);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }
    loadTrendingData();
  }, []);

  const loadTrendingData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/trending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTrendingStories(data.trending || []);
      setAllStories(data.all || []);
    } catch (error) {
      console.error('Failed to load trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTrendingStatus = async (storyId, isTrending, trendingOrder = 0) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5001/api/admin/stories/${storyId}/trending`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isTrending, trendingOrder })
      });
      loadTrendingData();
    } catch (error) {
      console.error('Failed to update trending status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔥 Trending Stories Management</h1>
          <p className="text-gray-600 mt-2">Manage which stories appear in the trending section on homepage</p>
        </div>

        {/* Current Trending Stories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Trending Stories ({trendingStories.length}/6)</h2>
          {trendingStories.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No trending stories set. Add some from the stories below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingStories.map((story, index) => (
                <div key={story._id} className="bg-white rounded-lg shadow overflow-hidden border-2 border-red-200">
                  <div className="aspect-[3/4] bg-gray-200 relative">
                    {story.thumbnail ? (
                      <img
                        src={`http://localhost:5001${story.thumbnail}`}
                        alt={story.title.en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                        TRENDING
                      </span>
                      <button
                        onClick={() => updateTrendingStatus(story._id, false)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{story.title.en}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {story.author}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">{story.category}</span>
                      <span>{story.totalChapters} chapters</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Stories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 All Published Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allStories.filter(story => !story.isTrending).map(story => (
              <div key={story._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] bg-gray-200">
                  {story.thumbnail ? (
                    <img
                      src={`http://localhost:5001${story.thumbnail}`}
                      alt={story.title.en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{story.title.en}</h3>
                  <p className="text-xs text-gray-600 mb-2">by {story.author}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded">{story.category}</span>
                    <span>{story.totalChapters} ch</span>
                  </div>
                  <button
                    onClick={() => updateTrendingStatus(story._id, true, trendingStories.length + 1)}
                    disabled={trendingStories.length >= 6}
                    className={`w-full text-white text-xs py-2 rounded font-medium ${
                      trendingStories.length >= 6 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    🔥 Make Trending
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}