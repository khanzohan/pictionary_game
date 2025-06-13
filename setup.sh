#!/bin/bash

# Pictionary Game - Setup Script
# Automatically sets up environment files for development

echo "🎨 Setting up Pictionary Game environment..."

# Root level environment for Docker Compose
if [ ! -f .env ]; then
    cp env.local.txt .env
    echo "✅ Created root .env file"
else
    echo "⚠️  Root .env file already exists"
fi

# Backend environment
cd backend
if [ ! -f .env ]; then
    cp env.local.txt .env
    echo "✅ Created backend .env file"
else
    echo "⚠️  Backend .env file already exists"
fi
cd ..

# Frontend environment  
cd frontend
if [ ! -f .env ]; then
    cp env.local.txt .env
    echo "✅ Created frontend .env file"
else
    echo "⚠️  Frontend .env file already exists"
fi
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the game: docker-compose up"
echo "2. Open browser: http://localhost:3000"
echo "3. Create a game and share the Game ID with friends!"
echo ""
echo "For manual setup without Docker:"
echo "- Backend: cd backend && pip install -r requirements.txt && python start.py dev"
echo "- Frontend: cd frontend && npm install && npm run dev" 