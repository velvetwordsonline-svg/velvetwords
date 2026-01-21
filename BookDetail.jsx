import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI } from '../lib/api';

const BookDetail = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoryData();
  }, [storyId]);

  const loadStoryData = async () => {
    try {
      const [storyRes, chaptersRes] = await Promise.all([
        publicAPI.getStory(storyId, 'en'),
        publicAPI.getChapters(storyId, 'en')
      ]);
      
      setStory(storyRes.data);
      setChapters(chaptersRes.data);
    } catch (error) {
      console.error('Failed to load story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadNow = () => {
    if (chapters.length > 0) {
      // Navigate to reader with first chapter
      navigate(`/reader/${storyId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Story not found</h2>
          <button 
            onClick={() => navigate('/categories')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Categories
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Book Cover */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-6">
                {story.thumbnail ? (
                  <img
                    src={`http://localhost:5001${story.thumbnail}`}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 rounded-lg">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Read Now Button */}
              <button
                onClick={handleReadNow}
                disabled={chapters.length === 0}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
              >
                {chapters.length > 0 ? 'Read Now' : 'No Chapters Available'}
              </button>

              {/* Quick Stats */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapters:</span>
                  <span className="font-medium">{story.totalChapters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{story.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{story.rating || 'N/A'}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{story.title}</h1>
              <p className="text-xl text-gray-600 mb-6">by {story.author}</p>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Story</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {story.description || 'No description available for this story.'}
                </p>
              </div>

              {/* Chapters Preview */}
              {chapters.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Chapters</h2>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {chapters.slice(0, 5).map((chapter, index) => (
                      <div key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {chapter.chapterNumber}
                          </span>
                          <span className="font-medium text-gray-900">{chapter.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">{chapter.estimatedReadTime} min</span>
                      </div>
                    ))}
                    {chapters.length > 5 && (
                      <div className="text-center py-2">
                        <span className="text-gray-500 text-sm">
                          +{chapters.length - 5} more chapters
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;