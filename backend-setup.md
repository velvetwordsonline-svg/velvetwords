# Backend Implementation Guide

## Installation

```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose multer mammoth @vitalets/google-translate-api bcryptjs jsonwebtoken cors dotenv
```

## Key Dependencies

- **mammoth**: Parse DOCX files (free, open-source)
- **@vitalets/google-translate-api**: Free Google Translate (no API key needed)
- **multer**: File uploads
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: Admin authentication
- **bcryptjs**: Password hashing

## Environment Variables (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/velvet-words
JWT_SECRET=your_secret_key_here
UPLOAD_DIR=./uploads
PUBLIC_DIR=./public
```
