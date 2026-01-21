import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const Home = () => {
  const navigate = useNavigate();
  const [trendingStories, setTrendingStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingStories();
  }, []);

  const loadTrendingStories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/trending?lang=en');
      const data = await response.json();
      console.log('Home - Trending stories response:', data);
      console.log('Home - Stories count:', data.data?.length || 0);
      setTrendingStories(data.data || []);
    } catch (error) {
      console.error('Failed to load trending stories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-6xl font-bold text-white mb-6">
              Welcome to <span className="text-purple-400">Velvet Words</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Discover amazing stories in multiple languages. Read, explore, and immerse yourself in captivating narratives.
            </p>
            <button
              onClick={() => navigate('/categories')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Explore Stories
            </button>
          </div>
        </section>

        {/* Trending Stories Section */}
        <section className="py-8 sm:py-12 bg-gradient-to-b from-transparent via-purple-600/10 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">🔥 Trending Stories</h2>
            
            <div className="relative group">
              <div className="overflow-x-auto scrollbar-hide scroll-smooth">
                <div className="flex gap-6 pb-4 px-2">
                  {loading ? (
                    <div className="flex gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-48 h-72 bg-gray-800 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : trendingStories.length === 0 ? (
                    <div className="w-full text-center py-16">
                      <p className="text-gray-400 text-lg">No trending stories available yet.</p>
                      <p className="text-gray-500 text-sm mt-2">Admin needs to mark stories as trending.</p>
                      <p className="text-red-400 text-xs mt-2">Debug: {JSON.stringify(trendingStories)}</p>
                    </div>
                  ) : (
                    trendingStories.map(story => (
                      <div
                        key={story._id}
                        onClick={() => navigate(`/book/${story._id}`)}
                        className="flex-shrink-0 w-48 cursor-pointer group/card"
                      >
                        <div className="bg-gray-900 border-[3px] border-white/20 rounded-lg overflow-hidden hover:border-purple-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:scale-105">
                          <div className="aspect-[3/4] bg-gray-800 relative">
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
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              HOT
                            </div>
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
                              <span className="text-gray-500">{story.totalChapters} ch</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Navigation Arrows */}
              {trendingStories.length > 0 && (
                <>
                  <button className="hidden group-hover:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 items-center justify-center w-12 h-12 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-all shadow-lg z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                  </button>
                  <button className="hidden group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 items-center justify-center w-12 h-12 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-all shadow-lg z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose Velvet Words?</h2>
              <p className="text-xl text-gray-400">Experience stories like never before</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Rich Stories</h3>
                <p className="text-gray-400">Immerse yourself in captivating narratives across multiple genres</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Multiple Languages</h3>
                <p className="text-gray-400">Read stories in English, Hindi, and Hinglish</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mobile Friendly</h3>
                <p className="text-gray-400">Enjoy seamless reading experience on any device</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;