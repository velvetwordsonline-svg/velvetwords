# 📚 Velvet Words - Multilingual Story Platform

> A complete, production-ready, Kindle-like story platform with automatic multilingual translation and subscription system.

## 🌟 Features

- 📖 **Kindle-like Reading Experience** - Professional story reader with font controls
- 🌍 **Multilingual Support** - Auto-translation to Hindi and Hinglish
- 💳 **Subscription System** - Chapter-based access control
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast & Scalable** - Built with modern tech stack
- 🔒 **Secure Authentication** - JWT-based admin system

## 🚀 Live Demo

- **User App**: [Your Domain Here]
- **Admin Panel**: [Admin Domain Here]
- **API**: [API Domain Here]

## 📦 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js + React + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Authentication | JWT |
| File Upload | Multer |
| Translation | Google Translate API |
| Hosting | Vercel |

## 🏗️ Architecture

```
User App ←→ Backend API ←→ MongoDB
    ↓           ↓
Admin Panel   File Storage
```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/velvet-words.git
cd velvet-words
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm start
```

### 3. Setup Admin Panel
```bash
cd admin
npm install
npm run dev
```

### 4. Setup User Frontend
```bash
cd "New folder (5)/pulse-field"
npm install
npm run dev
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=./uploads
PUBLIC_DIR=./public
```

### Admin (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 🔑 Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

## 📖 How to Use

### For Admins:
1. Login to admin panel
2. Upload DOCX files with stories
3. System automatically:
   - Parses chapters
   - Extracts images
   - Translates to Hindi & Hinglish
   - Makes stories available

### For Users:
1. Browse stories on main app
2. Read Chapter 1 for free
3. Subscribe to unlock more chapters
4. Enjoy reading with font controls

## 🌍 Language Support

- **English** (Original)
- **Hindi** (हिंदी - Devanagari script)
- **Hinglish** (Hindi in Roman script)

## 💳 Subscription Plans

- **Daily**: ₹10
- **Weekly**: ₹20  
- **Monthly**: ₹30

## 📱 API Endpoints

### Public APIs
```
GET  /api/stories                    # Get all stories
GET  /api/stories/:id               # Get story details
GET  /api/stories/:id/chapters      # Get story chapters
GET  /api/chapters/:id              # Get chapter content
```

### Admin APIs
```
POST /api/admin/login               # Admin login
POST /api/admin/upload-story        # Upload new story
GET  /api/admin/stories             # Manage stories
```

## 🚀 Deployment

### Automatic Deployment
```bash
chmod +x github-deploy.sh
./github-deploy.sh
```

### Manual Deployment

1. **Backend (Vercel)**
```bash
cd backend
vercel --prod
```

2. **Admin Panel (Vercel)**
```bash
cd admin
vercel --prod
```

3. **User App (Vercel)**
```bash
cd "New folder (5)/pulse-field"
vercel --prod
```

## 🔧 Configuration

### Custom Domain Setup
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed

### Database Setup
1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Update MONGODB_URI in .env

## 📊 Features Overview

### ✅ Completed Features
- [x] Story upload and parsing
- [x] Automatic translation
- [x] Chapter-based reading
- [x] Subscription system
- [x] Admin dashboard
- [x] Mobile responsive design
- [x] Font and reading controls

### 🚧 Future Enhancements
- [ ] Payment gateway integration
- [ ] User reviews and ratings
- [ ] Story recommendations
- [ ] Offline reading
- [ ] Audio narration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love using free and open-source tools
- MongoDB Atlas for database hosting
- Vercel for seamless deployment
- Google Translate API for multilingual support

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation files in the repository

---

**Happy Reading! 📚✨**