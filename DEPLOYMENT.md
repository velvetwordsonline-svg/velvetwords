# 🚀 Deployment Guide

This guide covers deploying Velvet Words to various platforms using free tiers.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free)
- Railway account (for backend)
- Vercel account (for frontend)

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create Free Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create new project
4. Build a database (free M0 cluster)
5. Choose cloud provider and region
6. Create cluster (takes 1-3 minutes)

### 2. Setup Database Access
1. Go to Database Access
2. Add new database user
3. Choose password authentication
4. Set username and password
5. Grant "Read and write to any database" role

### 3. Setup Network Access
1. Go to Network Access
2. Add IP Address
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Confirm

### 4. Get Connection String
1. Go to Databases
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database user password

## 🖥️ Backend Deployment (Railway)

### 1. Prepare Backend
```bash
cd backend
# Ensure package.json has start script
# Ensure all environment variables are documented
```

### 2. Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your velvetwords repository
6. Choose backend folder as root directory

### 3. Configure Environment Variables
In Railway dashboard:
1. Go to Variables tab
2. Add environment variables:
   ```
   PORT=5000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-generated-secret
   NODE_ENV=production
   ```

### 4. Generate JWT Secret
```bash
openssl rand -base64 32
```

### 5. Deploy
Railway will automatically deploy. Check logs for any errors.

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Admin Dashboard
```bash
cd admin
# Update .env.local with production backend URL
```

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Choose admin folder as root directory
5. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: admin
   - Build Command: npm run build
   - Output Directory: .next

### 3. Configure Environment Variables
In Vercel dashboard:
1. Go to Settings > Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app/api
   ```

### 4. Deploy
Vercel will automatically deploy and provide a URL.

## 🔧 Post-Deployment Setup

### 1. Seed Database
```bash
# SSH into Railway or run locally with production DB
npm run seed
```

### 2. Test Upload
1. Go to your admin dashboard URL
2. Login with admin/admin123
3. Upload a test DOCX file
4. Verify translation works

### 3. Update CORS
In backend, update CORS settings to include your frontend domain:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000']
}));
```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable MongoDB authentication
- [ ] Configure proper CORS origins
- [ ] Use HTTPS in production
- [ ] Set up rate limiting
- [ ] Validate file uploads
- [ ] Sanitize user inputs

## 📊 Monitoring

### Railway (Backend)
- Check deployment logs
- Monitor resource usage
- Set up alerts

### Vercel (Frontend)
- Check function logs
- Monitor build times
- Review analytics

### MongoDB Atlas
- Monitor database performance
- Check connection limits
- Review query performance

## 🚨 Troubleshooting

### Common Issues

**Backend won't start:**
- Check environment variables
- Verify MongoDB connection string
- Check Railway logs

**Frontend can't connect to backend:**
- Verify NEXT_PUBLIC_API_URL
- Check CORS configuration
- Ensure backend is running

**File uploads fail:**
- Check file size limits
- Verify upload directory permissions
- Check multer configuration

**Translation not working:**
- Verify Google Translate API access
- Check rate limiting
- Review translation service logs

### Debug Commands
```bash
# Check backend health
curl https://your-backend-url.railway.app/health

# Test API endpoint
curl https://your-backend-url.railway.app/api/stories

# Check admin login
curl -X POST https://your-backend-url.railway.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 💰 Cost Breakdown

| Service | Free Tier | Limits |
|---------|-----------|--------|
| MongoDB Atlas | M0 Cluster | 512MB storage |
| Railway | Hobby Plan | 500 hours/month |
| Vercel | Hobby Plan | 100GB bandwidth |
| **Total** | **$0/month** | **Sufficient for MVP** |

## 📈 Scaling

When you outgrow free tiers:

1. **Database:** Upgrade MongoDB Atlas cluster
2. **Backend:** Upgrade Railway plan or migrate to AWS/GCP
3. **Frontend:** Upgrade Vercel plan or use CDN
4. **Files:** Move to cloud storage (AWS S3, Cloudinary)

## 🔄 CI/CD Setup

### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        # Add Railway deployment action
      - name: Deploy to Vercel
        # Add Vercel deployment action
```

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review platform documentation
3. Check GitHub issues
4. Create new issue with deployment logs

---

**Happy Deploying! 🚀**