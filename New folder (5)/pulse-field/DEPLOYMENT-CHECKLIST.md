# Netlify Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. Build Configuration
- ✅ Build command: `npm run build:client`
- ✅ Publish directory: `dist/spa`
- ✅ Node version: 20 (specified in `.nvmrc`)

### 2. Required Files
- ✅ `netlify.toml` - Netlify configuration
- ✅ `public/_redirects` - SPA routing redirects
- ✅ `.nvmrc` - Node version specification

### 3. Build Output Verification
Run `npm run build:client` and verify:
- ✅ `dist/spa/index.html` exists
- ✅ `dist/spa/_redirects` exists
- ✅ `dist/spa/assets/` contains CSS and JS bundles
- ✅ `dist/spa/categories/` contains category images
- ✅ `dist/spa/characters/` contains character images
- ✅ `dist/spa/thumbnails/` contains story thumbnails
- ✅ `dist/spa/hero-video.mp4` exists

## 🚀 Deployment Steps

### Option 1: Git-based Deployment (Recommended)
1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-detect settings from `netlify.toml`

3. **Deploy**
   - Netlify will automatically build and deploy
   - Monitor the build logs for any errors

### Option 2: Manual Deployment
1. **Build the project**
   ```bash
   npm run build:client
   ```

2. **Deploy `dist/spa` folder**
   - Go to Netlify Dashboard
   - Drag and drop the `dist/spa` folder
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist/spa`

## 📋 Post-Deployment Checklist

- [ ] Verify homepage loads correctly
- [ ] Test navigation between pages (SPA routing)
- [ ] Verify all images load (categories, characters, thumbnails)
- [ ] Test video playback in hero section
- [ ] Check mobile responsiveness
- [ ] Verify all routes work (no 404 errors)

## 🔧 Troubleshooting

### If you get 404 errors:
1. Verify `_redirects` file is in `dist/spa/`
2. Check Netlify build logs
3. Clear Netlify cache and redeploy

### If images don't load:
1. Verify all files in `public/` folder are copied to `dist/spa/`
2. Check image paths in code (should start with `/`)

### If build fails:
1. Check Node version (should be 20)
2. Verify all dependencies are installed
3. Check build logs for specific errors

## 📝 Notes

- **Admin Portal**: The `admin-portal/` folder is separate and NOT included in this deployment
- **Build Output**: Only `dist/spa/` is deployed, not `dist/server/`
- **SPA Routing**: All routes redirect to `index.html` for client-side routing

