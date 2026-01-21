# 🧪 TESTING GUIDE

## Complete Testing Workflow

---

## 1️⃣ Backend Testing

### Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5001
```

### Test Health Endpoint
```bash
curl http://localhost:5001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Admin Login
```bash
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin"
  }
}
```

### Test Public Stories API
```bash
# English
curl http://localhost:5001/api/stories?lang=en

# Hindi
curl http://localhost:5001/api/stories?lang=hi

# Hinglish
curl http://localhost:5001/api/stories?lang=hinglish
```

---

## 2️⃣ Admin Dashboard Testing

### Start Admin Dashboard
```bash
cd admin
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3001
```

### Test Login Page

1. **Open Browser:**
   ```
   http://localhost:3001
   ```

2. **Should redirect to:**
   ```
   http://localhost:3001/login
   ```

3. **Login Form:**
   - Username: `admin`
   - Password: `admin123`
   - Click "Login"

4. **Expected:**
   - Success toast notification
   - Redirect to `/dashboard`
   - Token stored in localStorage

### Test Dashboard

1. **URL:**
   ```
   http://localhost:3001/dashboard
   ```

2. **Should Display:**
   - Navigation bar with username
   - Statistics cards (Total, Published, Draft)
   - Quick action cards
   - "Upload New Story" link
   - "Manage Stories" link

3. **Test Navigation:**
   - Click "Upload Story" → `/upload`
   - Click "Manage Stories" → `/stories`
   - Click "Dashboard" → `/dashboard`

### Test Upload Page

1. **URL:**
   ```
   http://localhost:3001/upload
   ```

2. **Fill Form:**
   - Title: "Test Story"
   - Author: "Test Author"
   - Description: "This is a test story"
   - Category: "Romance"

3. **Upload Thumbnail:**
   - Drag & drop or click to browse
   - Select JPG/PNG image
   - Should show preview

4. **Upload Document:**
   - Drag & drop or click to browse
   - Select DOCX file
   - Should show filename

5. **Submit:**
   - Click "Upload Story"
   - Should show progress bar
   - Wait for completion (2-5 minutes)
   - Success toast notification
   - Redirect to `/stories`

### Test Stories Management

1. **URL:**
   ```
   http://localhost:3001/stories
   ```

2. **Should Display:**
   - Grid of uploaded stories
   - Thumbnails
   - Title, author, description
   - Category badge
   - Status badge (published/draft)
   - Chapter count
   - Delete button

3. **Test Delete:**
   - Click "Delete" on a story
   - Confirm dialog appears
   - Click "OK"
   - Story removed from list
   - Success toast notification

### Test Protected Routes

1. **Logout:**
   - Click "Logout" in navigation
   - Should redirect to `/login`
   - Token removed from localStorage

2. **Try Accessing Protected Route:**
   ```
   http://localhost:3001/dashboard
   ```
   - Should redirect to `/login`

3. **Login Again:**
   - Should redirect back to `/dashboard`

---

## 3️⃣ Integration Testing

### Test Complete Upload Flow

1. **Prepare Test Files:**
   - Create a DOCX file with:
     ```
     Chapter 1: The Beginning
     
     This is the first paragraph.
     
     This is the second paragraph.
     
     Chapter 2: The Journey
     
     This is chapter two content.
     ```
   - Create a thumbnail image (JPG/PNG)

2. **Upload via Admin:**
   - Login to admin dashboard
   - Go to "Upload Story"
   - Fill all fields
   - Upload both files
   - Submit

3. **Monitor Backend Logs:**
   ```
   Parsing DOCX...
   Translating chapters...
   Chapter 1 translated
   Chapter 2 translated
   Story saved successfully
   ```

4. **Verify in Admin:**
   - Go to "Manage Stories"
   - New story should appear
   - Check thumbnail displays
   - Check status is "published"

5. **Test API Response:**
   ```bash
   # Get stories in English
   curl http://localhost:5001/api/stories?lang=en
   
   # Should return new story with English content
   ```

6. **Test Language Switching:**
   ```bash
   # Get stories in Hindi
   curl http://localhost:5001/api/stories?lang=hi
   
   # Should return same story with Hindi content
   
   # Get stories in Hinglish
   curl http://localhost:5001/api/stories?lang=hinglish
   
   # Should return same story with Hinglish content
   ```

---

## 4️⃣ User Frontend Testing

### Setup Test Page

Create a test page in your user frontend:

```javascript
// frontend/app/test/page.js
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TestPage() {
  const [stories, setStories] = useState([]);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    loadStories();
  }, [lang]);

  const loadStories = async () => {
    const { data } = await axios.get(
      `http://localhost:5001/api/stories?lang=${lang}`
    );
    setStories(data);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Stories API</h1>
      
      <div className="flex gap-2 mb-6">
        <button onClick={() => setLang('en')} 
          className="px-4 py-2 bg-blue-600 text-white rounded">
          English
        </button>
        <button onClick={() => setLang('hi')} 
          className="px-4 py-2 bg-blue-600 text-white rounded">
          Hindi
        </button>
        <button onClick={() => setLang('hinglish')} 
          className="px-4 py-2 bg-blue-600 text-white rounded">
          Hinglish
        </button>
      </div>

      <div className="space-y-4">
        {stories.map(story => (
          <div key={story._id} className="border p-4 rounded">
            <h2 className="font-bold">{story.title}</h2>
            <p className="text-sm text-gray-600">{story.author}</p>
            <p className="text-sm">{story.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              {story.totalChapters} chapters | {story.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Test User Frontend

1. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open Test Page:**
   ```
   http://localhost:3000/test
   ```

3. **Expected:**
   - Stories display in English
   - Click "Hindi" → Content switches to Hindi
   - Click "Hinglish" → Content switches to Hinglish
   - Switching is instant (no loading)

---

## 5️⃣ Error Testing

### Test Invalid Login
```bash
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wrong","password":"wrong"}'
```

Expected:
```json
{
  "error": "Invalid credentials"
}
```

### Test Unauthorized Access
```bash
curl http://localhost:5001/api/admin/stories
```

Expected:
```json
{
  "error": "No token provided"
}
```

### Test Invalid File Upload

1. Try uploading non-DOCX file
2. Expected: Error message "Only DOCX files allowed"

3. Try uploading non-image thumbnail
4. Expected: Error message "Only images allowed for thumbnail"

---

## 6️⃣ Performance Testing

### Test Upload Speed

1. **Small Story (5 chapters):**
   - Expected: 30-60 seconds

2. **Medium Story (20 chapters):**
   - Expected: 2-3 minutes

3. **Large Story (50 chapters):**
   - Expected: 5-7 minutes

### Test API Response Time

```bash
# Measure response time
time curl http://localhost:5001/api/stories?lang=en
```

Expected: < 100ms

### Test Concurrent Requests

```bash
# Run 10 concurrent requests
for i in {1..10}; do
  curl http://localhost:5001/api/stories?lang=en &
done
wait
```

All should complete successfully.

---

## 7️⃣ Browser Testing

### Test in Different Browsers

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Test Responsive Design

1. **Desktop (1920x1080):**
   - All features work
   - Layout looks good

2. **Tablet (768x1024):**
   - Navigation adapts
   - Grid becomes 2 columns

3. **Mobile (375x667):**
   - Navigation collapses
   - Grid becomes 1 column
   - Forms are usable

---

## 8️⃣ Database Testing

### Check MongoDB Data

```bash
# Connect to MongoDB
mongosh "mongodb+srv://velvetwords:Akashsharma1@velvetwords.3mn2bgu.mongodb.net/velvetwords_db"

# List collections
show collections

# Count stories
db.stories.countDocuments()

# View a story
db.stories.findOne()

# Count chapters
db.chapters.countDocuments()

# View a chapter
db.chapters.findOne()
```

---

## ✅ Testing Checklist

### Backend
- [ ] Server starts successfully
- [ ] MongoDB connects
- [ ] Health endpoint works
- [ ] Login endpoint works
- [ ] Public APIs work
- [ ] Admin APIs require auth
- [ ] File upload works
- [ ] DOCX parsing works
- [ ] Translation works
- [ ] Images are extracted

### Admin Dashboard
- [ ] Login page loads
- [ ] Login works
- [ ] Dashboard displays stats
- [ ] Upload page loads
- [ ] Drag & drop works
- [ ] File validation works
- [ ] Upload completes
- [ ] Stories page shows stories
- [ ] Delete works
- [ ] Logout works
- [ ] Protected routes work

### Integration
- [ ] Admin upload → Backend processes
- [ ] Backend saves → MongoDB stores
- [ ] API returns → Frontend displays
- [ ] Language switching works
- [ ] Images display correctly
- [ ] All 3 languages work

### User Experience
- [ ] Responsive design works
- [ ] Toast notifications appear
- [ ] Loading states show
- [ ] Error messages display
- [ ] Navigation works
- [ ] Forms validate

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution:**
```bash
# Check backend is running
curl http://localhost:5001/health

# Check .env.local in admin
cat admin/.env.local
# Should have: NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Issue: "Login failed"
**Solution:**
```bash
# Recreate admin user
cd backend
npm run seed
```

### Issue: "Upload fails"
**Solution:**
- Check file format (DOCX only)
- Check file size (< 10MB)
- Check backend logs for errors
- Ensure MongoDB is connected

### Issue: "Images not showing"
**Solution:**
- Check backend serves static files
- Verify image paths in database
- Check browser network tab
- Ensure backend is running

### Issue: "Translation fails"
**Solution:**
- Check internet connection
- Google Translate API has rate limits
- Backend adds 1-second delay between chapters
- Check backend logs for errors

---

## 📊 Expected Results

### After Complete Testing

✅ **Backend:**
- All APIs working
- DOCX parsing successful
- Translation generating
- Files storing correctly

✅ **Admin Dashboard:**
- Login/logout working
- Upload completing
- Stories displaying
- Delete functioning

✅ **Integration:**
- Admin → Backend → Database → Frontend
- All languages working
- Images displaying
- Content rendering correctly

✅ **Performance:**
- API responses < 100ms
- Upload completes in reasonable time
- No memory leaks
- Concurrent requests handled

---

## 🎉 Success Criteria

Your system is working correctly if:

1. ✅ Admin can login
2. ✅ Admin can upload story
3. ✅ Backend processes DOCX
4. ✅ Translation generates (3 languages)
5. ✅ Story appears in admin panel
6. ✅ API returns stories
7. ✅ User frontend can fetch stories
8. ✅ Language switching works instantly
9. ✅ Images display correctly
10. ✅ No errors in console

---

**Happy Testing! 🚀**
