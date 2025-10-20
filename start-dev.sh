#!/bin/bash

# TownHall Development Startup Script

echo "🏛️  Starting TownHall Development Environment"
echo "=============================================="

# Check if virtual environment exists
if [ ! -d "townhallvenv" ]; then
    echo "❌ Virtual environment not found. Please run setup first."
    exit 1
fi

# Check if frontend node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "🚀 Starting Django backend on port 8001..."
cd /home/smitdesai/Coding/TownHall
source townhallvenv/bin/activate
python manage.py runserver 0.0.0.0:8001 &
BACKEND_PID=$!

echo "🎨 Starting Next.js frontend on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "📊 Django Admin: http://localhost:8001/admin/"
echo "🌐 Frontend: http://localhost:3000"
echo "📚 API: http://localhost:8001/api/"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for interrupt
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
