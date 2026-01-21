import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ stories: 0, users: 0 });
  const [user, setUser] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadStories();
  }, []);

  const loadStories = () => {
    const localStories = JSON.parse(localStorage.getItem('stories') || '[]');
    setStories(localStories);
    setStats({ stories: localStories.length, users: 0 });
  };

  const handleDeleteStory = (storyId: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      const updatedStories = stories.filter(story => story.id !== storyId);
      localStorage.setItem('stories', JSON.stringify(updatedStories));
      setStories(updatedStories);
      setStats({ stories: updatedStories.length, users: 0 });
      
      // Trigger storage event for other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'stories',
        newValue: JSON.stringify(updatedStories)
      }));
    }
  };

  const handleEditStory = (storyId: string) => {
    // For now, just navigate to upload with story data
    navigate(`/admin/upload?edit=${storyId}`);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient divider line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50" />
      
      <nav className="bg-[#050505] shadow border-b border-purple-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">Velvet Words Admin</h1>
              {user && <span className="ml-4 text-gray-300">Welcome, {user.username}</span>}
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/admin/upload"
                className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]"
              >
                Upload Story
              </a>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#050505] overflow-hidden shadow-[0_0_15px_rgba(124,58,237,0.3)] rounded-xl border border-purple-600">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Stories
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {stats.stories}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#050505] overflow-hidden shadow-[0_0_15px_rgba(124,58,237,0.3)] rounded-xl border border-purple-600">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">U</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Users
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      {stats.users}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Management */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Manage Stories</h2>
            <button
              onClick={() => navigate('/admin/upload')}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]"
            >
              <Plus className="w-4 h-4" />
              Add New Story
            </button>
          </div>
          
          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div key={story.id} className="bg-[#050505] border border-purple-600 rounded-xl p-4 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                  <div className="flex items-start gap-4">
                    {story.coverImage && (
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm mb-1 truncate">{story.title}</h3>
                      <p className="text-gray-400 text-xs mb-2">{story.author}</p>
                      <p className="text-gray-500 text-xs line-clamp-2">{story.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleEditStory(story.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded hover:bg-blue-600/30 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded hover:bg-red-600/30 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#050505] border border-purple-600/30 rounded-xl">
              <p className="text-gray-400 mb-4">No stories uploaded yet</p>
              <button
                onClick={() => navigate('/admin/upload')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upload Your First Story
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}