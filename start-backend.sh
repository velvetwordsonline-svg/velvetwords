#!/bin/bash

echo "🚀 Starting Velvet Words Backend..."
echo ""

cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Seed admin if needed
echo "👤 Checking admin user..."
npm run seed

echo ""
echo "🚀 Starting server on port 5001..."
npm run dev
