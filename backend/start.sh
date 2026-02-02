#!/bin/bash

echo "🚀 Starting Velvet Words Backend..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo ""
    echo "Please start MongoDB first:"
    echo "  Option 1: brew services start mongodb-community"
    echo "  Option 2: Use MongoDB Atlas (free cloud)"
    echo ""
    echo "Then run: npm run dev"
    exit 1
fi

echo "✅ MongoDB is running"
echo "✅ Starting server..."
echo ""

npm run dev
