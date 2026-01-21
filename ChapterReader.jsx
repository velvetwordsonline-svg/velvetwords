import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI } from '../lib/api';

const ChapterReader = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    loadData();
  }, [storyId, chapterId, language]);

  const loadData = async () => {
    try {
      const [storyRes, chapterRes, chaptersRes] = await Promise.all([
        publicAPI.getStory(storyId, language),
        publicAPI.getChapter(chapterId, language),
        publicAPI.getChapters(storyId, language)
      ]);
      
      setStory(storyRes.data);
      setChapter(chapterRes.data);
      setChapters(chaptersRes.data);
    } catch (error) {
      console.error('Failed to load chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateChapter = (direction) => {
    const currentIndex = chapters.findIndex(ch => ch.id === chapterId);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < chapters.length) {
      navigate(`/reader/${storyId}/${chapters[newIndex].id}`);
    }
  };

  const renderContent = (content) => {
    if (!content || !Array.isArray(content)) return null;

    return content.map((block, index) => {
      if (block.type === 'text') {
        return (
          <p 
            key={index} 
            className="mb-6 leading-relaxed text-gray-800"
            style={{ fontSize: `${fontSize}px` }}
          >
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

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chapter not found</h2>
          <button 
            onClick={() => navigate(`/story/${storyId}`)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Story
          </button>
        </div>
      </div>
    );
  }

  const currentChapterIndex = chapters.findIndex(ch => ch.id === chapterId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(`/story/${storyId}`)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="font-semibold text-gray-900">{story?.title}</h1>
                <p className="text-sm text-gray-600">{chapter.title}</p>
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

              {/* Font Size */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600 w-8 text-center">{fontSize}</span>
                <button 
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
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
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {chapter.title}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            {renderContent(chapter.content)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6">
          <button 
            onClick={() => navigateChapter('prev')}
            disabled={currentChapterIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Chapter
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChapterReader;