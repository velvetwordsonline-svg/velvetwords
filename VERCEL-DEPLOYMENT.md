# Vercel Deployment Guide for e-stories.velvetwords.online

## ✅ Pre-Deployment Checklist

1. ✅ API base URL updated to use environment variables
2. ✅ Vercel configuration file (vercel.json) updated
3. ✅ Build configuration verified

## 🚀 Deployment Steps

### Step 1: Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy to Vercel
```bash
# From the project root directory
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (for first deployment)
- **What's your project's name?** → `e-stories` (or your preferred name)
- **In which directory is your code located?** → `./` (current directory)

### Step 4: Add Custom Domain

After initial deployment:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `e-stories.velvetwords.online`
6. Follow DNS configuration instructions

### Step 5: Configure Environment Variables

1. In Vercel Dashboard, go to **Settings** → **Environment Variables**
2. Add the following variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://velvetwords-backend.vercel.app/api`
   - **Environment**: Production, Preview, Development (select all)

### Step 6: Redeploy

After adding environment variables, trigger a new deployment:
```bash
vercel --prod
```

Or redeploy from the Vercel Dashboard by clicking **Redeploy**.

## 📋 DNS Configuration

To connect `e-stories.velvetwords.online` to Vercel:

1. Go to your domain registrar (where you manage velvetwords.online)
2. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: `e-stories`
   - **Value**: `cname.vercel-dns.com` (or the value provided by Vercel)
   - **TTL**: 3600 (or default)

Alternatively, Vercel may provide A records. Follow the instructions in the Vercel dashboard.

## 🔧 Build Configuration

The project is configured with:
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist`
- **Framework**: Vite
- **Node Version**: Auto-detected (or set to 18.x in Vercel settings)

## 🌐 Environment Variables

### Production
```
VITE_API_BASE_URL=https://velvetwords-backend.vercel.app/api
```

### Local Development
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:5001/api
```

## ✅ Verification

After deployment, verify:

1. ✅ Site loads at `https://e-stories.velvetwords.online`
2. ✅ API calls work (check browser console for errors)
3. ✅ All routes work (SPA routing)
4. ✅ Assets load correctly (images, CSS, JS)

## 🐛 Troubleshooting

### Issue: API calls failing
- Check that `VITE_API_BASE_URL` environment variable is set in Vercel
- Verify the backend API is accessible at `https://velvetwords-backend.vercel.app/api`
- Check browser console for CORS errors

### Issue: 404 errors on routes
- Verify `vercel.json` has the SPA rewrite rule
- Check that build output includes `index.html`

### Issue: Assets not loading
- Verify `public` directory is included in build
- Check that asset paths are relative (starting with `/`)

## 📝 Notes

- The Express server plugin in `vite.config.ts` only runs in development mode
- For production, Vercel serves the static build from the `dist` directory
- All API calls go to the separate backend at `velvetwords-backend.vercel.app`
