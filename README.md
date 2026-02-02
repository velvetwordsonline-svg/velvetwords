# 📚 Velvet Words - Clean Production Setup

## 🚀 Live URLs
- **Main Site**: https://www.velvetwords.online
- **Admin Panel**: https://www.velvetwords.online/admin
- **Backend API**: https://velvetwords-backend.vercel.app

## 📁 Project Structure
```
velvetwords/
├── backend/                 # Node.js API with persistent storage
├── admin/                   # Next.js admin dashboard  
├── New folder (5)/pulse-field/  # Main frontend (Vite + React)
└── README.md
```

## 🔑 Admin Login
- Username: `admin`
- Password: `admin123`

## 🔒 Features
- ✅ Persistent story storage (never auto-delete)
- ✅ Multilingual support (EN/HI/Hinglish)
- ✅ DOCX upload with auto-translation
- ✅ Soft delete with restore capability
- ✅ Transaction-safe uploads

## 🛠️ Development
```bash
# Backend
cd backend && npm run dev

# Admin  
cd admin && npm run dev

# Frontend
cd "New folder (5)/pulse-field" && npm run dev
```

**Production-ready multilingual story platform! 🎉**