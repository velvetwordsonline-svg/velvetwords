# 🚀 Hostinger Deployment Guide

## ✅ Build Complete!

Your frontend is built and ready in: `client/dist/spa/`

## 📦 Files to Upload

Upload these files from `client/dist/spa/` to Hostinger:

```
dist/spa/
├── index.html
├── assets/
│   ├── index-CCaT86dl.css
│   └── index-DDFBawF-.js
└── (any other assets)
```

## 🌐 Hostinger Deployment Steps

### Step 1: Access File Manager
1. Login to Hostinger
2. Go to **File Manager**
3. Navigate to `public_html/` folder

### Step 2: Upload Files
1. Delete existing files in `public_html/` (if any)
2. Upload ALL files from `client/dist/spa/` to `public_html/`
3. Maintain folder structure (especially `assets/` folder)

### Step 3: Configure .htaccess (Important!)
Create `.htaccess` file in `public_html/` with this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Step 4: Update API URL (if needed)
If your backend is hosted separately, update the API URL in your code before building.

## 🔄 Re-deploy (Future Updates)

When you make changes:

```bash
# 1. Make your changes
# 2. Rebuild
cd client
npm run build

# 3. Upload new files from dist/spa/ to Hostinger
```

## 📁 Final Structure on Hostinger

```
public_html/
├── .htaccess          (create this)
├── index.html         (from dist/spa/)
├── assets/
│   ├── index-*.css
│   └── index-*.js
└── (other assets)
```

## ✅ Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Check if site loads correctly
3. Test navigation (should work without 404 errors)
4. Check browser console for errors

## 🐛 Troubleshooting

### Issue: 404 on page refresh
**Solution**: Make sure `.htaccess` file is uploaded and configured correctly

### Issue: Assets not loading
**Solution**: Check if `assets/` folder structure is maintained

### Issue: Blank page
**Solution**: Check browser console for errors, verify all files uploaded

## 🎯 Quick Upload via FTP (Alternative)

```bash
# Using FileZilla or any FTP client
Host: ftp.yourdomain.com
Username: your_hostinger_username
Password: your_hostinger_password
Port: 21

# Upload location: /public_html/
```

## 📝 Notes

- ✅ Build size: ~488 KB (gzipped: ~135 KB)
- ✅ Single Page Application (SPA)
- ✅ Production optimized
- ✅ Ready for Hostinger shared hosting

## 🚀 You're Done!

Your frontend is now ready to be deployed on Hostinger!
