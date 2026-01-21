import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const Home = () => {
  const navigate = useNavigate();
  const [trendingStories, setTrendingStories] = useState([]);

  useEffect(() => {
    // Set mock data immediately
    setTrendingStories([
      {
        _id: '1',
        title: 'Crimson Hearts',
        category: 'Romance',
        rating: 4.9
      },
      {
        _id: '2', 
        title: 'Midnight Desires',
        category: 'Romance',
        rating: 4.8
      },
      {
        _id: '3',
        title: 'Forbidden Passion',
        category: 'Romance',
        rating: 4.9
      },
      {
        _id: '4',
        title: 'Whispered Promises',
        category: 'Romance',
        rating: 4.6
      }
    ]);
  }, []);

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
        <section className="py-12 bg-gradient-to-b from-transparent via-purple-600/10 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">Trending Stories</h2>
            
            {/* Debug */}
            <div className="text-white mb-4">Stories: {trendingStories.length}</div>
            
            <div className="relative group">
              <div className="overflow-x-auto scrollbar-hide scroll-smooth">
                <div className="flex gap-16 pb-4 px-2">
                  {trendingStories.length > 0 ? trendingStories.map((story, index) => (
                    <div key={story._id} className="flex-shrink-0 w-[200px]">
                      <div className="group cursor-pointer">
                        <div className="relative rounded-lg overflow-hidden bg-gray-900 border-[3px] transition-all duration-300 border-white/20 hover:border-purple-600">
                          <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-900">
                            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
                              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                            <div className="absolute top-3 right-3">
                              <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">{story.category}</span>
                            </div>
                            <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">
                                Read Now
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">
                              {story.title}
                            </h3>
                            <p className="text-gray-400 text-xs mb-3">
                              {story.category}
                            </p>
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, starIndex) => {
                                  const isFilled = starIndex < Math.floor(story.rating);
                                  return (
                                    <svg
                                      key={starIndex}
                                      className={`w-3 h-3 ${isFilled ? 'fill-purple-600 text-purple-600' : 'text-gray-600'}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  );
                                })}
                              </div>
                              <span className="text-gray-400 text-xs ml-1">
                                {story.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-white">No stories found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">New Arrivals</h2>
            
            <div className="relative group">
              <div className="overflow-x-auto scrollbar-hide scroll-smooth">
                <div className="flex gap-16 pb-4 px-2">
                  {trendingStories.map((story, index) => (
                    <div key={`new-${story._id}`} className="flex-shrink-0 w-36 sm:w-40 lg:w-48">
                      <div className="group relative flex-shrink-0 w-[200px] cursor-pointer">
                        <div className="relative rounded-lg overflow-hidden bg-gray-900 border-[3px] transition-all duration-300 border-white/20 hover:border-purple-600 hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]">
                          <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-900">
                            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
                              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                            <div className="absolute top-3 left-3 right-3 flex gap-2">
                              <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full ml-auto">{story.category}</span>
                            </div>
                            <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">
                                Read Now
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">
                              {story.title}
                            </h3>
                            <p className="text-gray-400 text-xs mb-3">
                              {story.category}
                            </p>
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, starIndex) => {
                                  const isFilled = starIndex < Math.floor(story.rating);
                                  return (
                                    <svg
                                      key={starIndex}
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className={`w-3 h-3 ${isFilled ? 'fill-purple-600 text-purple-600' : 'text-gray-600'}`}
                                    >
                                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                    </svg>
                                  );
                                })}
                              </div>
                              <span className="text-gray-400 text-xs ml-1">
                                {story.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
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