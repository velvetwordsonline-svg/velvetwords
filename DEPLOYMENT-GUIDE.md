# 🚀 Manual Deployment Guide

## Step 1: Upload to GitHub

1. **Create GitHub Repository:**
   - Go to github.com
   - Click "New repository"
   - Name it "velvet-words" or similar
   - Copy the repository URL

2. **Upload Code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Velvet Words Story Platform"
   git remote add origin YOUR_GITHUB_URL
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Backend Deployment:
1. Go to vercel.com and login
2. Click "New Project"
3. Import your GitHub repository
4. Select the `backend` folder
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
6. Deploy

### Admin Panel Deployment:
1. Create new Vercel project
2. Select the `admin` folder
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL from step above
4. Deploy

### User Frontend Deployment:
1. Create new Vercel project
2. Select the `New folder (5)/pulse-field` folder
3. Deploy

## Step 3: Configure Custom Domain

1. In each Vercel project dashboard:
   - Go to Settings → Domains
   - Add your custom domain/subdomain
   - Follow DNS configuration instructions

## Step 4: Update Environment Variables

Update your backend `.env` with production URLs:
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## 🎉 Your platform is now live!

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**URLs:**
- Backend API: `https://your-backend.vercel.app`
- Admin Panel: `https://your-admin.vercel.app`
- User App: `https://your-app.vercel.app`