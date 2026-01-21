import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const Categories = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [trendingStories, setTrendingStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/stories?lang=en');
      const data = await response.json();
      console.log('All stories:', data);
      setStories(data.data || []);
      
      // Load trending stories
      const trendingResponse = await fetch('http://localhost:5001/api/trending?lang=en');
      const trendingData = await trendingResponse.json();
      console.log('Trending stories:', trendingData);
      setTrendingStories(trendingData.data || []);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(stories.map(story => story.category))];
  const filteredStories = selectedCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === selectedCategory);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Discover Amazing <span className="text-purple-400">Stories</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore our collection of captivating stories across different genres
          </p>
        </div>
        
        {/* Trending Stories Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">🔥 Trending Stories</h2>
            <button 
              onClick={() => setSelectedCategory('all')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              View All →
            </button>
          </div>
          
          {trendingStories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No trending stories set by admin yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trendingStories.slice(0, 6).map(story => (
                <div
                  key={story._id}
                  onClick={() => navigate(`/book/${story._id}`)}
                  className="bg-gray-900 border-[3px] border-white/20 rounded-lg overflow-hidden cursor-pointer hover:border-purple-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:scale-105"
                >
                  <div className="aspect-[3/4] bg-gray-800 relative">
                    {story.thumbnail ? (
                      <img
                        src={`http://localhost:5001${story.thumbnail}`}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      HOT
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-white text-xs mb-1 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">by {story.author}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded font-medium">
                        {story.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredStories.map(story => (
            <div
              key={story._id}
              onClick={() => navigate(`/book/${story._id}`)}
              className="bg-gray-900 border-[3px] border-white/20 rounded-lg overflow-hidden cursor-pointer hover:border-purple-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:scale-105"
            >
              <div className="aspect-[3/4] bg-gray-800">
                {story.thumbnail ? (
                  <img
                    src={`http://localhost:5001${story.thumbnail}`}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-sm mb-2 line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-xs text-gray-400 mb-3">by {story.author}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded font-medium">
                    {story.category}
                  </span>
                  <span className="text-gray-500">{story.totalChapters} chapters</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Stories Found</h3>
            <p className="text-gray-400">No stories found in this category.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;