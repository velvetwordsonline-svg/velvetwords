# 🔗 ADMIN TO USER INTEGRATION GUIDE

## System Overview

```
Admin uploads DOCX → Backend processes → Database stores → User fetches → Categories display
```

---

## ✅ What's Already Working

Your backend already has:
- ✅ DOCX parsing (Mammoth.js)
- ✅ Chapter extraction
- ✅ Image extraction
- ✅ Translation (EN → HI → Hinglish)
- ✅ MongoDB storage
- ✅ Public APIs

---

## 🔌 User Frontend Integration

### Step 1: Create API Client

Create this file in your user frontend:

```javascript
// lib/api.js (in your user frontend at port 8084)
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export async function getStoriesByCategory(category = null, lang = 'en') {
  const params = { lang };
  if (category) params.category = category;
  
  const { data } = await axios.get(`${API_BASE}/stories`, { params });
  return data;
}

export async function getStory(id, lang = 'en') {
  const { data } = await axios.get(`${API_BASE}/stories/${id}?lang=${lang}`);
  return data;
}

export async function getChapters(storyId, lang = 'en') {
  const { data } = await axios.get(`${API_BASE}/stories/${storyId}/chapters?lang=${lang}`);
  return data;
}

export async function getChapter(chapterId, lang = 'en') {
  const { data } = await axios.get(`${API_BASE}/chapters/${chapterId}?lang=${lang}`);
  return data;
}
```

---

### Step 2: Categories Page Implementation

```javascript
// pages/categories.js (or wherever your categories page is)
import { useState, useEffect } from 'react';
import { getStoriesByCategory } from '@/lib/api';

export default function CategoriesPage() {
  const [stories, setStories] = useState([]);
  const [language, setLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, [language, selectedCategory]);

  const loadStories = async () => {
    setLoading(true);
    try {
      const data = await getStoriesByCategory(selectedCategory, language);
      setStories(data);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['romance', 'thriller', 'fantasy', 'mystery', 'scifi'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Language Switcher */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          English
        </button>
        <button 
          onClick={() => setLanguage('hi')}
          className={`px-4 py-2 rounded ${language === 'hi' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          हिंदी
        </button>
        <button 
          onClick={() => setLanguage('hinglish')}
          className={`px-4 py-2 rounded ${language === 'hinglish' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Hinglish
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded whitespace-nowrap ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded whitespace-nowrap capitalize ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.map(story => (
            <div 
              key={story.id} 
              className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => window.location.href = `/story/${story.id}`}
            >
              <img 
                src={`http://localhost:5001${story.thumbnail}`}
                alt={story.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{story.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {story.author}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{story.description}</p>
                <div className="mt-3 flex justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">{story.category}</span>
                  <span>{story.totalChapters} chapters</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {stories.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No stories found in this category
        </div>
      )}
    </div>
  );
}
```

---

### Step 3: Story Detail Page

```javascript
// pages/story/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getStory, getChapters } from '@/lib/api';

export default function StoryDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStoryData();
    }
  }, [id, language]);

  const loadStoryData = async () => {
    setLoading(true);
    try {
      const [storyData, chaptersData] = await Promise.all([
        getStory(id, language),
        getChapters(id, language)
      ]);
      setStory(storyData);
      setChapters(chaptersData);
    } catch (error) {
      console.error('Failed to load story:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!story) {
    return <div className="text-center py-12">Story not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Language Switcher */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setLanguage('en')} 
          className={`px-4 py-2 rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          English
        </button>
        <button onClick={() => setLanguage('hi')} 
          className={`px-4 py-2 rounded ${language === 'hi' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          हिंदी
        </button>
        <button onClick={() => setLanguage('hinglish')} 
          className={`px-4 py-2 rounded ${language === 'hinglish' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Hinglish
        </button>
      </div>

      {/* Story Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-6">
          <img 
            src={`http://localhost:5001${story.thumbnail}`}
            alt={story.title}
            className="w-48 h-64 object-cover rounded"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
            <p className="text-gray-600 mb-4">by {story.author}</p>
            <p className="text-gray-700 mb-4">{story.description}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>📚 {story.totalChapters} chapters</span>
              <span>🏷️ {story.category}</span>
              <span>⭐ {story.rating}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Chapters</h2>
        </div>
        <div className="divide-y">
          {chapters.map(chapter => (
            <div 
              key={chapter.id}
              onClick={() => router.push(`/read/${chapter.id}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    Chapter {chapter.chapterNumber}: {chapter.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {chapter.estimatedReadTime} min read
                  </p>
                </div>
                <span className="text-blue-600">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### Step 4: Chapter Reader Page

```javascript
// pages/read/[chapterId].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getChapter } from '@/lib/api';

export default function ReaderPage() {
  const router = useRouter();
  const { chapterId } = router.query;
  const [chapter, setChapter] = useState(null);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chapterId) {
      loadChapter();
    }
  }, [chapterId, language]);

  const loadChapter = async () => {
    setLoading(true);
    try {
      const data = await getChapter(chapterId, language);
      setChapter(data);
    } catch (error) {
      console.error('Failed to load chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!chapter) {
    return <div className="text-center py-12">Chapter not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Chapter {chapter.chapterNumber}: {chapter.title}
          </h1>
          
          {/* Language Switcher */}
          <div className="flex gap-2">
            <button onClick={() => setLanguage('en')} 
              className={`px-3 py-1 rounded text-sm ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              EN
            </button>
            <button onClick={() => setLanguage('hi')} 
              className={`px-3 py-1 rounded text-sm ${language === 'hi' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              HI
            </button>
            <button onClick={() => setLanguage('hinglish')} 
              className={`px-3 py-1 rounded text-sm ${language === 'hinglish' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              Hinglish
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow p-8">
          {chapter.content.map((block, index) => (
            <div key={index} className="mb-6">
              {block.type === 'text' ? (
                <p className="text-lg leading-relaxed text-gray-800">
                  {block.data}
                </p>
              ) : (
                <img 
                  src={`http://localhost:5001${block.data}`}
                  alt="Story illustration"
                  className="w-full rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔄 Complete Data Flow

### Admin Upload Flow

```
1. Admin opens http://localhost:3001/upload
2. Fills form:
   - Title: "My Story"
   - Author: "John Doe"
   - Description: "A great story"
   - Category: "romance"
3. Uploads:
   - Thumbnail: story-cover.jpg
   - Document: story-content.docx
4. Clicks "Upload Story"
5. Backend receives files
6. Backend processes:
   ├─ Saves thumbnail to /public/thumbnails
   ├─ Parses DOCX with Mammoth.js
   ├─ Extracts chapters (based on "Chapter X:" headings)
   ├─ Extracts images from DOCX
   ├─ Translates each chapter:
   │  ├─ English (original)
   │  ├─ Hindi (Google Translate API - free)
   │  └─ Hinglish (transliteration)
   └─ Saves to MongoDB:
      ├─ Story document
      └─ Chapter documents (one per chapter)
7. Returns success response
8. Admin redirected to /stories
```

### User View Flow

```
1. User opens http://localhost:8084/categories
2. Frontend calls GET /api/stories?lang=en
3. Backend returns stories from MongoDB
4. Stories display with thumbnails
5. User clicks language button (हिंदी)
6. Frontend calls GET /api/stories?lang=hi
7. Backend returns same stories with Hindi content
8. UI updates instantly (no loading)
9. User clicks a story
10. Frontend calls:
    - GET /api/stories/:id?lang=hi
    - GET /api/stories/:id/chapters?lang=hi
11. Story details display
12. User clicks chapter
13. Frontend calls GET /api/chapters/:id?lang=hi
14. Chapter content renders (text + images)
```

---

## 🌍 Language Switching Logic

### How It Works

1. **Upload Time (One-time)**
   ```
   Admin uploads DOCX in English
   ↓
   Backend translates to Hindi
   ↓
   Backend converts to Hinglish
   ↓
   All 3 versions stored in DB
   ```

2. **Runtime (Instant)**
   ```
   User clicks "हिंदी"
   ↓
   Frontend changes lang parameter
   ↓
   API returns Hindi version from DB
   ↓
   UI updates (no translation delay)
   ```

### Database Structure

```javascript
// Story Document
{
  _id: "story123",
  title: {
    en: "The Beginning",
    hi: "शुरुआत",
    hinglish: "Shuruaat"
  },
  description: {
    en: "A great story",
    hi: "एक महान कहानी",
    hinglish: "Ek mahaan kahaani"
  },
  author: "John Doe",
  category: "romance",
  thumbnail: "/thumbnails/1234567890-cover.jpg",
  totalChapters: 5,
  status: "published"
}

// Chapter Document
{
  _id: "chapter123",
  storyId: "story123",
  chapterNumber: 1,
  title: {
    en: "The First Day",
    hi: "पहला दिन",
    hinglish: "Pehla din"
  },
  content: {
    en: [
      { type: "text", data: "It was a sunny morning..." },
      { type: "image", data: "/images/1234567890-img1.jpg" },
      { type: "text", data: "She walked to the park..." }
    ],
    hi: [
      { type: "text", data: "यह एक धूप वाली सुबह थी..." },
      { type: "image", data: "/images/1234567890-img1.jpg" },
      { type: "text", data: "वह पार्क की ओर चली..." }
    ],
    hinglish: [
      { type: "text", data: "Yah ek dhoop waali subah thi..." },
      { type: "image", data: "/images/1234567890-img1.jpg" },
      { type: "text", data: "Vah park ki or chali..." }
    ]
  },
  estimatedReadTime: 5
}
```

---

## ✅ Testing Checklist

### Backend
- [ ] Backend running on port 5001
- [ ] MongoDB connected
- [ ] DOCX parser working
- [ ] Translation generating
- [ ] Files storing correctly

### Admin
- [ ] Admin running on port 3001
- [ ] Can login
- [ ] Can upload DOCX + thumbnail
- [ ] Upload completes successfully
- [ ] Story appears in /stories

### User Frontend
- [ ] User app running on port 8084
- [ ] Can fetch stories from API
- [ ] Stories display on /categories
- [ ] Language switching works
- [ ] Story details page works
- [ ] Chapter reading works

---

## 🚀 Quick Start

### 1. Ensure Backend is Running
```bash
cd backend
npm run dev
# Should see: ✅ MongoDB connected
# Should see: 🚀 Server running on http://localhost:5001
```

### 2. Test API Directly
```bash
# Get stories in English
curl http://localhost:5001/api/stories?lang=en

# Get stories in Hindi
curl http://localhost:5001/api/stories?lang=hi

# Get stories in Hinglish
curl http://localhost:5001/api/stories?lang=hinglish
```

### 3. Integrate in User Frontend
- Copy the API client code above
- Add to your categories page
- Test language switching

---

## 📞 API Endpoints Reference

### Public APIs (No Auth Required)

```
GET /api/stories?lang=en&category=romance
Response: Array of stories

GET /api/stories/:id?lang=hi
Response: Single story details

GET /api/stories/:id/chapters?lang=hinglish
Response: Array of chapters

GET /api/chapters/:id?lang=en
Response: Chapter content with text + images

GET /api/trending?lang=hi
Response: Trending stories

GET /thumbnails/:filename
Response: Thumbnail image file

GET /images/:filename
Response: Story image file
```

---

## 🎉 You're Ready!

Your system is complete:
- ✅ Admin uploads DOCX
- ✅ Backend processes & translates
- ✅ Database stores all languages
- ✅ User frontend fetches dynamically
- ✅ Language switching is instant

Just integrate the API client code in your user frontend at port 8084!
