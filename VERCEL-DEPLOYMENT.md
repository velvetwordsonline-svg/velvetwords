# 🚀 Deploy to velvetwords.online on Vercel

## 📋 Deployment Steps

### 1. Deploy Backend API
```bash
cd backend
npx vercel --prod
```

**Environment Variables for Backend:**
```
MONGODB_URI=mongodb+srv://velvetwords:Akashsharma1@velvetwords.3mn2bgu.mongodb.net/velvetwords_db?appName=VelvetWords
JWT_SECRET=8mte6Q4sxrNiMqeAxbps+MFblFm5pwZUoBHlH902FAc=
NODE_ENV=production
PORT=5001
```

### 2. Deploy Admin Dashboard
```bash
cd admin
npx vercel --prod
```

**Environment Variables for Admin:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

### 3. Setup Custom Domain

#### For Backend (api.velvetwords.online):
1. Go to Vercel Dashboard → Backend Project → Settings → Domains
2. Add domain: `api.velvetwords.online`
3. Configure DNS:
   ```
   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com
   ```

#### For Admin (admin.velvetwords.online):
1. Go to Vercel Dashboard → Admin Project → Settings → Domains  
2. Add domain: `admin.velvetwords.online`
3. Configure DNS:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

#### For Main Site (velvetwords.online):
1. Deploy your main frontend
2. Add domain: `velvetwords.online`
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```

## 🔧 Quick Deploy Commands

### One-Click Deploy Backend:
```bash
cd backend
vercel --prod --env MONGODB_URI="mongodb+srv://velvetwords:Akashsharma1@velvetwords.3mn2bgu.mongodb.net/velvetwords_db?appName=VelvetWords" --env JWT_SECRET="8mte6Q4sxrNiMqeAxbps+MFblFm5pwZUoBHlH902FAc=" --env NODE_ENV="production"
```

### One-Click Deploy Admin:
```bash
cd admin  
vercel --prod --env NEXT_PUBLIC_API_URL="https://api.velvetwords.online/api"
```

## 🌐 Final URLs

- **API**: https://api.velvetwords.online
- **Admin**: https://admin.velvetwords.online  
- **Main Site**: https://velvetwords.online

## ✅ Verification

Test your deployment:
```bash
# Test API
curl https://api.velvetwords.online/api/stories

# Test Admin Login
curl -X POST https://api.velvetwords.online/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🚨 Troubleshooting

**If deployment fails:**
1. Check Vercel logs
2. Verify environment variables
3. Ensure MongoDB connection
4. Check domain DNS settings

**Common fixes:**
- Wait 24-48 hours for DNS propagation
- Clear browser cache
- Check SSL certificate status