# 🚀 Quick Start Guide

## Step 1: Backend Setup (5 minutes)

```bash
# Create backend folder
mkdir backend && cd backend

# Copy package.json content from backend-package.json
# Then install
npm install

# Create folder structure
mkdir -p src/{models,services,routes,middleware}
mkdir -p public/{images,thumbnails}
mkdir uploads

# Copy all backend-*.js files to appropriate locations:
# backend-models.js → src/models/models.js
# backend-docxParser.js → src/services/docxParser.js
# backend-translator.js → src/services/translator.js
# backend-adminRoutes.js → src/routes/adminRoutes.js
# backend-publicRoutes.js → src/routes/publicRoutes.js
# backend-authRoutes.js → src/routes/authRoutes.js
# backend-authMiddleware.js → src/middleware/authMiddleware.js
# backend-server.js → src/server.js

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/velvet-words
JWT_SECRET=$(openssl rand -base64 32)
UPLOAD_DIR=./uploads
PUBLIC_DIR=./public
EOF
```

## Step 2: Database Setup (2 minutes)

**Option A: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create free cluster (M0 - 512MB)
4. Get connection string
5. Update MONGODB_URI in .env

## Step 3: Create Admin Account (1 minute)

```bash
# Create seed script
cat > scripts/seedAdmin.js << 'EOF'
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin } = require('../src/models/models');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await Admin.create({
    username: 'admin',
    password: hashedPassword,
    email: 'admin@velvetwords.com'
  });
  
  console.log('Admin created: username=admin, password=admin123');
  process.exit(0);
}

seed();
EOF

# Run seed
npm run seed
```

## Step 4: Start Backend (1 minute)

```bash
npm run dev
# Server running on http://localhost:5000
```

## Step 5: Test Upload (2 minutes)

### Create Test DOCX
Open Microsoft Word or Google Docs and create:

```
Chapter 1: The Beginning

This is the first paragraph of our story. It introduces the main character.

This is the second paragraph with more details about the setting.

Chapter 2: The Journey

The adventure begins here with exciting events.

More content for chapter two continues...
```

Save as `test-story.docx`

### Upload via API

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Copy the token from response

curl -X POST http://localhost:5000/api/admin/upload-story \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "thumbnail=@/path/to/image.jpg" \
  -F "document=@/path/to/test-story.docx" \
  -F "title=Test Story" \
  -F "author=Test Author" \
  -F "description=A test story" \
  -F "category=romance"
```

## Step 6: Verify Data (1 minute)

```bash
# Get all stories
curl http://localhost:5000/api/stories?lang=en

# Get Hindi version
curl http://localhost:5000/api/stories?lang=hi

# Get chapters
curl http://localhost:5000/api/stories/STORY_ID/chapters?lang=hinglish
```

## Step 7: Frontend Integration

### Update your Next.js app

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getStories(lang = 'en') {
  const res = await fetch(`${API_BASE}/stories?lang=${lang}`);
  return res.json();
}

export async function getStory(id: string, lang = 'en') {
  const res = await fetch(`${API_BASE}/stories/${id}?lang=${lang}`);
  return res.json();
}

export async function getChapters(storyId: string, lang = 'en') {
  const res = await fetch(`${API_BASE}/stories/${storyId}/chapters?lang=${lang}`);
  return res.json();
}

export async function getChapter(chapterId: string, lang = 'en') {
  const res = await fetch(`${API_BASE}/chapters/${chapterId}?lang=${lang}`);
  return res.json();
}
```

### Language Context

```typescript
// contexts/LanguageContext.tsx
'use client';
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext<{
  language: 'en' | 'hi' | 'hinglish';
  setLanguage: (lang: 'en' | 'hi' | 'hinglish') => void;
}>({
  language: 'en',
  setLanguage: () => {}
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'hi' | 'hinglish'>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
```

### Reader Component

```typescript
// components/StoryReader.tsx
'use client';
import { useEffect, useState } from 'react';
import { getChapter } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StoryReader({ chapterId }: { chapterId: string }) {
  const { language } = useLanguage();
  const [chapter, setChapter] = useState<any>(null);

  useEffect(() => {
    getChapter(chapterId, language).then(setChapter);
  }, [chapterId, language]);

  if (!chapter) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{chapter.title}</h1>
      
      {chapter.content.map((block: any, i: number) => (
        block.type === 'text' ? (
          <p key={i} className="mb-6 text-lg leading-relaxed text-gray-300">
            {block.data}
          </p>
        ) : (
          <img 
            key={i} 
            src={`http://localhost:5000${block.data}`}
            alt="Story illustration"
            className="w-full my-8 rounded-lg"
          />
        )
      ))}
    </div>
  );
}
```

### Language Selector

```typescript
// components/LanguageSelector.tsx
'use client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded ${
          language === 'en' ? 'bg-primary text-white' : 'bg-gray-800'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-4 py-2 rounded ${
          language === 'hi' ? 'bg-primary text-white' : 'bg-gray-800'
        }`}
      >
        हिंदी
      </button>
      <button
        onClick={() => setLanguage('hinglish')}
        className={`px-4 py-2 rounded ${
          language === 'hinglish' ? 'bg-primary text-white' : 'bg-gray-800'
        }`}
      >
        Hinglish
      </button>
    </div>
  );
}
```

## 🎉 Done!

You now have:
- ✅ Backend running on port 5000
- ✅ MongoDB storing stories
- ✅ Admin can upload DOCX files
- ✅ Automatic translation to 3 languages
- ✅ API endpoints for frontend
- ✅ Language switching capability

## 📝 Admin Credentials

- Username: `admin`
- Password: `admin123`
- Change these in production!

## 🔗 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stories` | GET | Get all stories |
| `/api/stories/:id` | GET | Get single story |
| `/api/stories/:id/chapters` | GET | Get chapters |
| `/api/chapters/:id` | GET | Get chapter content |
| `/api/admin/login` | POST | Admin login |
| `/api/admin/upload-story` | POST | Upload story |
| `/api/admin/stories` | GET | List all stories (admin) |

All endpoints support `?lang=en|hi|hinglish` query parameter.

## 🚀 Deploy to Production

### Backend (Railway.app - Free)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

### Frontend (Vercel - Free)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Update `NEXT_PUBLIC_API_URL` in Vercel environment variables.

---

**Total Setup Time: ~15 minutes** ⚡
