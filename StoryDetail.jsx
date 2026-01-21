import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI } from '../lib/api';

const StoryDetail = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    loadStoryData();
  }, [storyId, language]);

  const loadStoryData = async () => {
    try {
      const [storyRes, chaptersRes] = await Promise.all([
        publicAPI.getStory(storyId, language),
        publicAPI.getChapters(storyId, language)
      ]);
      
      setStory(storyRes.data);
      setChapters(chaptersRes.data);
      
      // Set first chapter as current if available
      if (storyRes.data.firstChapter) {
        setCurrentChapter(storyRes.data.firstChapter);
      } else if (chaptersRes.data.length > 0) {
        // Fallback: load first chapter from chapters list
        const firstChapterRes = await publicAPI.getChapter(chaptersRes.data[0].id, language);
        setCurrentChapter(firstChapterRes.data);
      }
    } catch (error) {
      console.error('Failed to load story:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChapter = async (chapterId) => {
    try {
      const response = await publicAPI.getChapter(chapterId, language);
      setCurrentChapter(response.data);
    } catch (error) {
      console.error('Failed to load chapter:', error);
    }
  };

  const navigateChapter = (direction) => {
    const currentIndex = chapters.findIndex(ch => ch.id === currentChapter?.id);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < chapters.length) {
      loadChapter(chapters[newIndex].id);
    }
  };

  const renderContent = (content) => {
    if (!content || !Array.isArray(content)) return null;

    return content.map((block, index) => {
      if (block.type === 'text') {
        return (
          <p key={index} className="mb-6 leading-relaxed text-gray-800 text-lg">
            {block.data}
          </p>
        );
      } else if (block.type === 'image') {
        return (
          <div key={index} className="my-8 text-center">
            <img 
              src={`http://localhost:5001${block.data}`}
              alt="Story illustration"
              className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            />
          </div>
        );
      }
      return null;
    });
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
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentChapter && chapters.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No chapters available</h2>
          <p className="text-gray-600 mb-4">This story hasn't been published yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentChapterIndex = chapters.findIndex(ch => ch.id === currentChapter?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="font-semibold text-gray-900">{story.title}</h1>
                <p className="text-sm text-gray-600">by {story.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>
          </div>

          {/* Progress Bar */}
          {chapters.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Chapter {currentChapterIndex + 1} of {chapters.length}</span>
                <span>{Math.round(((currentChapterIndex + 1) / chapters.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentChapterIndex + 1) / chapters.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Chapter List */}
          {chapters.length > 1 && (
            <div className="w-80 bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Chapters</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => loadChapter(chapter.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentChapter?.id === chapter.id 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-sm">{chapter.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {chapter.estimatedReadTime} min read
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {currentChapter ? (
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {currentChapter.title}
                </h1>
                
                <div className="prose prose-lg max-w-none">
                  {renderContent(currentChapter.content)}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading chapter...</p>
              </div>
            )}

            {/* Navigation */}
            {chapters.length > 1 && currentChapter && (
              <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6">
                <button 
                  onClick={() => navigateChapter('prev')}
                  disabled={currentChapterIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Chapter {currentChapterIndex + 1} of {chapters.length}
                  </p>
                  <p className="font-medium text-gray-900">{currentChapter.title}</p>
                </div>

                <button 
                  onClick={() => navigateChapter('next')}
                  disabled={currentChapterIndex === chapters.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;