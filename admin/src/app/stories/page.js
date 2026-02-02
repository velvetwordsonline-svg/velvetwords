'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminNav from '@/components/AdminNav';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const { data } = await adminAPI.getStories();
      // Handle different response structures
      const storiesArray = data.stories || data || [];
      setStories(Array.isArray(storiesArray) ? storiesArray : []);
    } catch (error) {
      console.error('Load stories error:', error);
      toast.error('Failed to load stories');
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    
    try {
      await adminAPI.deleteStory(id);
      toast.success('Story deleted');
      loadStories();
    } catch (error) {
      toast.error('Failed to delete story');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <AdminNav />
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Stories</h1>
            <div className="text-sm text-gray-600">{stories.length} total stories</div>
          </div>

          {stories.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 mb-4">No stories uploaded yet</p>
              <a href="/upload" className="text-blue-600 hover:underline">Upload your first story</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div key={story._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                  {story.thumbnail && (
                    <img
                      src={story.thumbnail.startsWith('data:') ? story.thumbnail : `https://velvetwords-backend.vercel.app${story.thumbnail}`}
                      alt={story.title.en}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{story.title.en}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {story.author}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{story.description.en}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded">{story.category}</span>
                      <span>{story.totalChapters || 0} chapters</span>
                      <span className={`px-2 py-1 rounded ${
                        story.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {story.status}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(story._id, story.title.en)}
                      className="w-full bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
