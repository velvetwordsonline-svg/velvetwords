#!/bin/bash

echo "🚀 Setting up Velvet Words Admin Dashboard..."
echo ""

cd admin

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Admin dashboard setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Ensure backend is running: cd backend && npm run dev"
echo "2. Start admin dashboard: cd admin && npm run dev"
echo "3. Open http://localhost:3001"
echo "4. Login with: admin / admin123"
echo ""
echo "Happy managing! 🎉"
