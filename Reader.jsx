import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI } from '../lib/api';
import SubscriptionPopup from './SubscriptionPopup';

const Reader = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState(18);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [userPhone, setUserPhone] = useState(null);

  useEffect(() => {
    // Get user phone from localStorage
    const phone = localStorage.getItem('userPhone');
    setUserPhone(phone);
    loadReaderData();
  }, [storyId, chapterId, language]);

  const loadReaderData = async () => {
    setLoading(true);
    try {
      // Load story and chapters list
      const [storyRes, chaptersRes] = await Promise.all([
        publicAPI.getStory(storyId, language),
        publicAPI.getChapters(storyId, language)
      ]);
      
      setStory(storyRes.data);
      setChapters(chaptersRes.data);

      // Load specific chapter or first chapter
      let chapterData;
      if (chapterId && chaptersRes.data.length > 0) {
        // Try to load specific chapter
        try {
          const chapterRes = await publicAPI.getChapter(chapterId, language);
          chapterData = chapterRes.data;
        } catch (error) {
          console.warn('Specific chapter not found, loading first chapter');
          // Fallback to first chapter
          const firstChapterRes = await publicAPI.getChapter(chaptersRes.data[0].id, language);
          chapterData = firstChapterRes.data;
        }
      } else {
        // Load first chapter by default (when no chapterId provided)
        if (chaptersRes.data.length > 0) {
          const firstChapterRes = await publicAPI.getChapter(chaptersRes.data[0].id, language);
          chapterData = firstChapterRes.data;
        }
      }

      if (chapterData) {
        setChapter(chapterData);
        // Update URL to include chapterId if not present
        if (!chapterId) {
          navigate(`/reader/${storyId}/${chapterData.id}`, { replace: true });
        } else if (chapterId !== chapterData.id) {
          navigate(`/reader/${storyId}/${chapterData.id}`, { replace: true });
        }
      }
    } catch (error) {
      console.error('Failed to load reader data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChapter = async (targetChapterId) => {
    try {
      setLoading(true);
      
      // Add phone number to headers if available
      const headers = {};
      if (userPhone) {
        headers['x-phone-number'] = userPhone;
      }
      
      const response = await fetch(`http://localhost:5001/api/chapters/${targetChapterId}?lang=${language}`, {
        headers
      });
      
      if (response.status === 401 || response.status === 402) {
        // Subscription required
        setShowSubscriptionPopup(true);
        return;
      }
      
      const data = await response.json();
      setChapter(data);
      navigate(`/reader/${storyId}/${targetChapterId}`);
    } catch (error) {
      console.error('Failed to load chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateChapter = (direction) => {
    const currentIndex = chapters.findIndex(ch => ch.id === chapter?.id);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < chapters.length) {
      loadChapter(chapters[newIndex].id);
    }
  };

  const handleSubscriptionSuccess = () => {
    // Reload current chapter after successful subscription
    if (chapter) {
      loadChapter(chapter.id);
    }
  };

  const renderContent = (content) => {
    if (!content || !Array.isArray(content)) return null;

    return content.map((block, index) => {
      if (block.type === 'text') {
        return (
          <div 
            key={index} 
            className="mb-8 text-justify"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: '1.8',
              fontFamily: 'Georgia, serif'
            }}
          >
            <p className="text-gray-800 leading-relaxed">
              {block.data}
            </p>
          </div>
        );
      } else if (block.type === 'image') {
        return (
          <div key={index} className="my-12 text-center">
            <img 
              src={`http://localhost:5001${block.data}`}
              alt="Story illustration"
              className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              style={{ maxHeight: '500px' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapter...</p>
        </div>
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

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No chapters available</h2>
          <p className="text-gray-600 mb-4">This story doesn't have any chapters yet.</p>
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

  const currentChapterIndex = chapters.findIndex(ch => ch.id === chapter.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/categories')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="font-semibold text-gray-900">{story.title}</h1>
                <p className="text-sm text-gray-600">{chapter.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="hinglish">Hinglish</option>
              </select>

              {/* Font Size Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Decrease font size"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600 w-8 text-center">{fontSize}</span>
                <button 
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Increase font size"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
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
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentChapterIndex + 1) / chapters.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-12 mb-8" style={{ minHeight: '70vh' }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center border-b border-gray-200 pb-6">
            {chapter.title}
          </h1>
          
          <div className="prose prose-xl max-w-none">
            {renderContent(chapter.content)}
          </div>
        </div>

        {/* Navigation */}
        {chapters.length > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6">
            <button 
              onClick={() => navigateChapter('prev')}
              disabled={currentChapterIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Chapter
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chapter {currentChapterIndex + 1} of {chapters.length}
              </p>
              <p className="font-medium text-gray-900">{chapter.title}</p>
            </div>

            <button 
              onClick={() => navigateChapter('next')}
              disabled={currentChapterIndex === chapters.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Chapter
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </main>
      
      {/* Subscription Popup */}
      <SubscriptionPopup 
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
        onSuccess={handleSubscriptionSuccess}
      />
    </div>
  );
};

export default Reader;