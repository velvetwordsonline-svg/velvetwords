#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Velvet Words Project...${NC}"

# Function to kill all background processes on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "${BLUE}📡 Starting Backend (Port 3000)...${NC}"
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Admin Panel
echo -e "${BLUE}⚙️ Starting Admin Panel (Port 3001)...${NC}"
cd ../admin && npm run dev &
ADMIN_PID=$!

# Wait a moment for admin to start
sleep 3

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend (Port 5173)...${NC}"
cd "../New folder (5)/pulse-field" && npm run dev &
FRONTEND_PID=$!

# Display URLs
echo -e "\n${GREEN}✅ All services started!${NC}"
echo -e "${GREEN}📱 Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}⚙️ Admin Panel: http://localhost:3001${NC}"
echo -e "${GREEN}📡 Backend API: http://localhost:3000${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for all background processes
wait