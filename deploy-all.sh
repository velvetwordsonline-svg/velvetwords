#!/bin/bash

echo "🚀 Uploading to GitHub and Deploying to Vercel..."

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
.env.local
.next/
dist/
build/
uploads/
*.log
.DS_Store
.vercel
EOF

# Initialize git and commit
git init
git add .
git commit -m "Initial commit: Velvet Words Story Platform"

echo "📝 Enter your GitHub repository URL:"
read REPO_URL

git remote add origin $REPO_URL
git branch -M main
git push -u origin main

echo "✅ Code uploaded to GitHub!"

# Deploy Backend
echo "📦 Deploying Backend to Vercel..."
cd backend
npx vercel --prod
echo "✅ Backend deployed!"
cd ..

# Deploy Admin Panel
echo "📦 Deploying Admin Panel to Vercel..."
cd admin
npx vercel --prod
echo "✅ Admin Panel deployed!"
cd ..

# Deploy User Frontend
echo "📦 Deploying User Frontend to Vercel..."
cd "New folder (5)/pulse-field"
npx vercel --prod
echo "✅ User Frontend deployed!"
cd ../..

echo ""
echo "🎉 All deployments complete!"
echo ""
echo "Next steps:"
echo "1. Go to vercel.com/dashboard"
echo "2. Add your custom domain to each project"
echo "3. Update DNS records"
echo "4. Login with admin/admin123"