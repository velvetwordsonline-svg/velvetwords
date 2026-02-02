# 🎨 Velvet Words - Admin Dashboard

Complete admin panel for managing multilingual story platform.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd admin
npm install
```

### 2. Configure Environment
```bash
# .env.local already created with:
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 3. Start Backend (Required)
```bash
cd ../backend
npm run dev
# Backend runs on http://localhost:5001
```

### 4. Start Admin Dashboard
```bash
cd ../admin
npm run dev
# Admin runs on http://localhost:3001
```

### 5. Login
- URL: http://localhost:3001
- Username: `admin`
- Password: `admin123`

---

## 📁 Project Structure

```
admin/
├── src/
│   ├── app/
│   │   ├── login/page.js          # Admin login
│   │   ├── dashboard/page.js      # Dashboard with stats
│   │   ├── upload/page.js         # Story upload
│   │   ├── stories/page.js        # Manage stories
│   │   ├── layout.js              # Root layout
│   │   ├── page.js                # Redirect to login
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── AdminNav.js            # Navigation bar
│   │   └── ProtectedRoute.js     # Auth guard
│   ├── contexts/
│   │   └── AuthContext.js         # Auth state
│   └── lib/
│       └── api.js                 # API client
├── package.json
├── tailwind.config.js
└── next.config.js
```

---

## 🎯 Features

### ✅ Authentication
- JWT-based login
- Protected routes
- Auto-redirect if not logged in
- Logout functionality

### ✅ Dashboard
- Total stories count
- Published vs Draft stats
- Quick action cards

### ✅ Story Upload
- Drag & drop file upload
- Thumbnail preview
- DOCX validation
- Upload progress bar
- Automatic translation (backend)

### ✅ Story Management
- View all stories
- Grid layout with thumbnails
- Delete stories
- Status indicators

---

## 🔌 API Integration

Admin dashboard connects to backend APIs:

```javascript
// Login
POST /api/admin/login
Body: { username, password }

// Upload Story
POST /api/admin/upload-story
Headers: Authorization: Bearer <token>
Body: FormData (thumbnail, document, title, author, description, category)

// Get Stories
GET /api/admin/stories
Headers: Authorization: Bearer <token>

// Delete Story
DELETE /api/admin/stories/:id
Headers: Authorization: Bearer <token>
```

---

## 🎨 Pages Overview

### 1. Login (`/login`)
- Simple username/password form
- Stores JWT in localStorage
- Redirects to dashboard on success

### 2. Dashboard (`/dashboard`)
- Shows story statistics
- Quick links to upload and manage
- Protected route

### 3. Upload (`/upload`)
- Form with metadata fields
- Drag & drop for thumbnail and DOCX
- Real-time upload progress
- Redirects to stories list on success

### 4. Stories (`/stories`)
- Grid view of all stories
- Shows thumbnail, title, author, category
- Status badges (published/draft)
- Delete functionality

---

## 🔐 Authentication Flow

```
User visits /dashboard
  ↓
Check localStorage for token
  ↓
No token? → Redirect to /login
  ↓
Login successful → Store token → Redirect to /dashboard
  ↓
Token exists → Allow access
```

---

## 🌐 User Frontend Integration

Your existing user frontend can fetch stories:

```javascript
// In your user frontend
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

// Get stories in selected language
export async function getStories(lang = 'en') {
  const { data } = await axios.get(`${API_BASE}/stories?lang=${lang}`);
  return data;
}

// Get single story
export async function getStory(id, lang = 'en') {
  const { data } = await axios.get(`${API_BASE}/stories/${id}?lang=${lang}`);
  return data;
}

// Get chapters
export async function getChapters(storyId, lang = 'en') {
  const { data } = await axios.get(`${API_BASE}/stories/${storyId}/chapters?lang=${lang}`);
  return data;
}
```

---

## 📖 Usage Workflow

### Admin Uploads Story:
1. Login to admin dashboard
2. Click "Upload New Story"
3. Fill in metadata (title, author, description, category)
4. Upload thumbnail image
5. Upload DOCX file
6. Click "Upload Story"
7. Backend processes:
   - Parses DOCX
   - Extracts chapters and images
   - Translates to Hindi and Hinglish
   - Saves to database
8. Story appears in "Manage Stories"

### User Views Story:
1. User frontend fetches stories from API
2. Stories display with thumbnails
3. User selects language (EN/HI/Hinglish)
4. User clicks story
5. Frontend fetches story details in selected language
6. Content renders with text and images

---

## 🎨 Customization

### Change Port
```javascript
// package.json
"dev": "next dev -p 3002"  // Change from 3001
```

### Change API URL
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

### Add More Categories
```javascript
// src/app/upload/page.js
<select>
  <option value="romance">Romance</option>
  <option value="thriller">Thriller</option>
  <option value="horror">Horror</option>  // Add new
</select>
```

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on port 5001
- Check NEXT_PUBLIC_API_URL in .env.local

### "Login failed"
- Verify admin user exists in database
- Run: `cd backend && npm run seed`

### "Upload fails"
- Check file formats (DOCX for document, JPG/PNG for thumbnail)
- Check backend logs for errors

### "Images not showing"
- Ensure backend serves static files
- Check thumbnail path in database

---

## 🚀 Deployment

### Admin Dashboard (Vercel)
```bash
cd admin
vercel
```

### Backend (Railway)
```bash
cd backend
railway up
```

Update .env.local with production API URL:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## 📊 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **File Upload:** react-dropzone
- **Notifications:** react-hot-toast
- **Auth:** JWT (localStorage)

---

## ✅ Checklist

- [x] Admin authentication
- [x] Protected routes
- [x] Story upload with drag & drop
- [x] Thumbnail preview
- [x] Upload progress
- [x] Story management
- [x] Delete functionality
- [x] Responsive design
- [x] Error handling
- [x] Success notifications

---

## 🎉 Ready to Use!

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Admin
cd admin && npm run dev

# Terminal 3: Start User Frontend (if separate)
cd frontend && npm run dev
```

Visit: http://localhost:3001

---

**Happy Managing! 🚀**
