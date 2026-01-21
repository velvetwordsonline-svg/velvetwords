# 🔗 Complete System Integration Guide

## System Architecture

```
┌─────────────────┐
│  Admin Panel    │ (Port 3001)
│  Next.js        │
└────────┬────────┘
         │
         │ JWT Auth
         │ Upload Stories
         │
         ▼
┌─────────────────┐
│  Backend API    │ (Port 5001)
│  Node.js        │
│  - Auth         │
│  - File Upload  │
│  - DOCX Parse   │
│  - Translation  │
└────────┬────────┘
         │
         │ Store/Fetch
         │
         ▼
┌─────────────────┐
│  MongoDB Atlas  │
│  - Stories      │
│  - Chapters     │
│  - Admin Users  │
└────────┬────────┘
         │
         │ Fetch Stories
         │
         ▼
┌─────────────────┐
│  User Frontend  │ (Port 3000)
│  Next.js        │
│  - Browse       │
│  - Read         │
│  - Lang Switch  │
└─────────────────┘
```

---

## 🚀 Complete Setup (Step-by-Step)

### Step 1: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env (already exists)
# PORT=5001
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=...

# Create admin user
npm run seed

# Start backend
npm run dev
# ✅ Backend running on http://localhost:5001
```

### Step 2: Admin Dashboard Setup
```bash
cd admin

# Install dependencies
npm install

# .env.local already configured
# NEXT_PUBLIC_API_URL=http://localhost:5001/api

# Start admin
npm run dev
# ✅ Admin running on http://localhost:3001
```

### Step 3: Test Admin Flow
```bash
# 1. Open browser: http://localhost:3001
# 2. Login: admin / admin123
# 3. Upload a test story
# 4. Verify in "Manage Stories"
```

### Step 4: User Frontend Integration

Create API client in your user frontend:

```javascript
// frontend/lib/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export async function getStories(lang = 'en', category = null) {
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

export async function getTrending(lang = 'en') {
  const { data } = await axios.get(`${API_BASE}/trending?lang=${lang}`);
  return data;
}
```

---

## 📱 User Frontend Pages

### 1. Stories List Page (`/stories`)

```javascript
// frontend/app/stories/page.js
'use client';
import { useState, useEffect } from 'react';
import { getStories } from '@/lib/api';
import Link from 'next/link';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    loadStories();
  }, [lang]);

  const loadStories = async () => {
    const data = await getStories(lang);
    setStories(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Language Selector */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setLang('en')} 
          className={lang === 'en' ? 'bg-blue-600 text-white px-4 py-2 rounded' : 'bg-gray-200 px-4 py-2 rounded'}>
          English
        </button>
        <button onClick={() => setLang('hi')} 
          className={lang === 'hi' ? 'bg-blue-600 text-white px-4 py-2 rounded' : 'bg-gray-200 px-4 py-2 rounded'}>
          हिंदी
        </button>
        <button onClick={() => setLang('hinglish')} 
          className={lang === 'hinglish' ? 'bg-blue-600 text-white px-4 py-2 rounded' : 'bg-gray-200 px-4 py-2 rounded'}>
          Hinglish
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stories.map(story => (
          <Link key={story._id} href={`/stories/${story._id}`}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
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
                  <span>{story.totalChapters} chapters</span>
                  <span>{story.category}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### 2. Story Detail Page (`/stories/[id]`)

```javascript
// frontend/app/stories/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { getStory, getChapters } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    loadStory();
  }, [lang]);

  const loadStory = async () => {
    const [storyData, chaptersData] = await Promise.all([
      getStory(params.id, lang),
      getChapters(params.id, lang)
    ]);
    setStory(storyData);
    setChapters(chaptersData);
  };

  if (!story) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Language Selector */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setLang('en')} 
          className={lang === 'en' ? 'bg-blue-600 text-white px-4 py-2 rounded' : 'bg-gray-200 px-4 py-2 rounded'}>
          English
        </button>
        <button onClick={() => setLang('hi')} 
          className={lang === 'hi' ? 'bg-blue-600 text-white px-4 py-2 rounded' : 'bg-gray-200 px-4 py-2 rounded'}>
          हिंदी
        </button>
        <button onClick={() => setLang('hinglish')} 
          className={lang === 'hinglish' ? 'bg-blue-600 text-white px-4 py-2 rounded' : 'bg-gray-200 px-4 py-2 rounded'}>
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
              key={chapter._id}
              onClick={() => router.push(`/read/${chapter._id}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Chapter {chapter.chapterNumber}: {chapter.title}</h3>
                  <p className="text-sm text-gray-600">{chapter.estimatedReadTime} min read</p>
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

### 3. Chapter Reader Page (`/read/[chapterId]`)

```javascript
// frontend/app/read/[chapterId]/page.js
'use client';
import { useState, useEffect } from 'react';
import { getChapter } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function ReaderPage() {
  const params = useParams();
  const [chapter, setChapter] = useState(null);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    loadChapter();
  }, [lang]);

  const loadChapter = async () => {
    const data = await getChapter(params.chapterId, lang);
    setChapter(data);
  };

  if (!chapter) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Chapter {chapter.chapterNumber}: {chapter.title}</h1>
          
          {/* Language Selector */}
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} 
              className={`px-3 py-1 rounded text-sm ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              EN
            </button>
            <button onClick={() => setLang('hi')} 
              className={`px-3 py-1 rounded text-sm ${lang === 'hi' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              HI
            </button>
            <button onClick={() => setLang('hinglish')} 
              className={`px-3 py-1 rounded text-sm ${lang === 'hinglish' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
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
                <p className="text-lg leading-relaxed text-gray-800">{block.data}</p>
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

### Admin Uploads Story:
1. Admin logs in → JWT stored in localStorage
2. Admin fills form + uploads files
3. POST /api/admin/upload-story with FormData
4. Backend:
   - Saves files to disk
   - Parses DOCX with Mammoth.js
   - Extracts chapters and images
   - Translates to Hindi (Google Translate API)
   - Converts Hindi to Hinglish (transliteration)
   - Saves to MongoDB
5. Story appears in admin "Manage Stories"

### User Views Story:
1. User opens /stories
2. Frontend calls GET /api/stories?lang=en
3. Backend returns stories from MongoDB
4. User clicks story → /stories/[id]
5. Frontend calls GET /api/stories/[id]?lang=en
6. User clicks chapter → /read/[chapterId]
7. Frontend calls GET /api/chapters/[chapterId]?lang=en
8. Content renders with text + images

### Language Switching:
1. User clicks "हिंदी" button
2. setLang('hi')
3. useEffect triggers
4. API called with ?lang=hi
5. Backend returns Hindi content from DB
6. UI updates instantly (no translation delay)

---

## 🌍 API Endpoints Summary

### Public (No Auth)
```
GET  /api/stories?lang=en&category=romance
GET  /api/stories/:id?lang=hi
GET  /api/stories/:id/chapters?lang=hinglish
GET  /api/chapters/:id?lang=en
GET  /api/trending?lang=hi
GET  /images/:filename
GET  /thumbnails/:filename
```

### Admin (Requires JWT)
```
POST /api/admin/login
POST /api/admin/upload-story
GET  /api/admin/stories
DELETE /api/admin/stories/:id
```

---

## 🎯 Key Features Implemented

✅ **Admin System**
- Login/logout with JWT
- Protected routes
- Story upload with drag & drop
- DOCX + image handling
- Story management (view/delete)

✅ **Backend Processing**
- DOCX parsing (Mammoth.js)
- Chapter extraction
- Image extraction
- Translation (English → Hindi → Hinglish)
- MongoDB storage

✅ **User Experience**
- Browse stories
- View story details
- Read chapters
- Instant language switching
- Mixed text + image content

✅ **Multilingual**
- 3 languages (EN/HI/Hinglish)
- Pre-translated (no runtime delay)
- Instant switching

---

## 🚀 Running Everything

```bash
# Terminal 1: Backend
cd backend
npm run dev
# → http://localhost:5001

# Terminal 2: Admin
cd admin
npm run dev
# → http://localhost:3001

# Terminal 3: User Frontend
cd frontend
npm run dev
# → http://localhost:3000
```

---

## ✅ Testing Checklist

- [ ] Backend starts successfully
- [ ] Admin login works
- [ ] Story upload completes
- [ ] Translation generates
- [ ] Stories appear in admin panel
- [ ] User frontend fetches stories
- [ ] Language switching works
- [ ] Images display correctly
- [ ] Chapter reading works

---

## 🎉 You're All Set!

Your complete Kindle-like multilingual story platform is ready:
- ✅ Admin uploads content
- ✅ Backend processes and translates
- ✅ Users read in 3 languages
- ✅ 100% free and open-source

**Happy Building! 🚀**
