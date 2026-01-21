# Netlify Deployment Guide

This project is configured for deployment on Netlify.

## Build Configuration

- **Build Command**: `npm run build:client`
- **Publish Directory**: `dist/spa`
- **Node Version**: 20 (specified in `.nvmrc`)

## Deployment Steps

1. **Connect to Netlify**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Connect your repository to Netlify
   - Netlify will auto-detect the build settings from `netlify.toml`

2. **Manual Deployment** (if needed):
   - Build the project: `npm run build:client`
   - The output will be in `dist/spa/`
   - Deploy the `dist/spa` folder to Netlify

## Important Files

- `netlify.toml` - Netlify configuration
- `.nvmrc` - Node version specification
- `dist/spa/` - Build output directory

## SPA Routing

The project uses React Router for client-side routing. The `netlify.toml` includes a redirect rule that redirects all routes to `index.html` to support SPA routing.

## Public Assets

All assets in the `public/` folder are automatically copied to `dist/spa/` during build:
- Images (thumbnails, characters, categories)
- Videos (hero-video.mp4)
- Other static files

## Environment Variables

If you need environment variables, add them in Netlify's dashboard under:
Site settings → Environment variables

