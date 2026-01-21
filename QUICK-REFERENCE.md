# ⚡ QUICK REFERENCE

## 🚀 Start Everything

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Admin
cd admin && npm run dev

# Terminal 3: User Frontend
cd frontend && npm run dev
```

## 🌐 URLs

- **Backend:** http://localhost:5001
- **Admin:** http://localhost:3001
- **Frontend:** http://localhost:3000

## 🔑 Login

- **Username:** admin
- **Password:** admin123

## 📁 Key Files

```
admin/
├── src/app/login/page.js       # Login page
├── src/app/dashboard/page.js   # Dashboard
├── src/app/upload/page.js      # Upload story
├── src/app/stories/page.js     # Manage stories
├── src/lib/api.js              # API client
└── src/contexts/AuthContext.js # Auth state

backend/
├── src/routes/adminRoutes.js   # Admin APIs
├── src/routes/publicRoutes.js  # Public APIs
├── src/services/docxParser.js  # DOCX parser
└── src/services/translator.js  # Translation
```

## 🔌 API Endpoints

### Admin (JWT Required)
```
POST /api/admin/login
POST /api/admin/upload-story
GET  /api/admin/stories
DELETE /api/admin/stories/:id
```

### Public
```
GET /api/stories?lang=en
GET /api/stories/:id?lang=hi
GET /api/stories/:id/chapters?lang=hinglish
GET /api/chapters/:id?lang=en
```

## 🌍 Languages

- `en` - English
- `hi` - Hindi (हिंदी)
- `hinglish` - Hinglish

## 📝 Upload Flow

1. Login to admin
2. Go to "Upload Story"
3. Fill form (title, author, description, category)
4. Upload thumbnail (JPG/PNG)
5. Upload document (DOCX)
6. Click "Upload Story"
7. Wait for processing (2-5 min)
8. Story appears in "Manage Stories"

## 🎯 User Frontend Integration

```javascript
// lib/api.js
import axios from 'axios';
const API = 'http://localhost:5001/api';

export const getStories = (lang) => 
  axios.get(`${API}/stories?lang=${lang}`);

export const getStory = (id, lang) => 
  axios.get(`${API}/stories/${id}?lang=${lang}`);
```

## ✅ Checklist

- [ ] Backend running (port 5001)
- [ ] Admin running (port 3001)
- [ ] Can login to admin
- [ ] Can upload story
- [ ] Story appears in admin panel
- [ ] Frontend can fetch stories
- [ ] Language switching works

## 🐛 Common Issues

**Can't login:**
```bash
cd backend
npm run seed
```

**Upload fails:**
- Check file format (DOCX only)
- Check backend logs

**Images not showing:**
- Ensure backend is running
- Check image paths

## 📚 Documentation

- `SYSTEM-OVERVIEW.md` - Complete overview
- `INTEGRATION-GUIDE.md` - Integration guide
- `admin/README.md` - Admin dashboard
- `backend/SETUP-STATUS.md` - Backend status

---

**Need help? Check the docs above! 🚀**
