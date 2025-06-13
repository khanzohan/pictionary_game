@echo off

REM Pictionary Game - Windows Setup Script
REM Automatically sets up environment files for development

echo 🎨 Setting up Pictionary Game environment...

REM Note: Using root user in development container for simplicity
REM Production builds use proper non-root user for security

REM Root level environment for Docker Compose
if not exist .env (
    copy env.local.txt .env >nul
    echo ✅ Created root .env file
) else (
    echo ⚠️  Root .env file already exists
)

REM Backend environment
cd backend
if not exist .env (
    copy env.local.txt .env >nul
    echo ✅ Created backend .env file
) else (
    echo ⚠️  Backend .env file already exists
)
cd ..

REM Frontend environment
cd frontend
if not exist .env (
    copy env.local.txt .env >nul
    echo ✅ Created frontend .env file
) else (
    echo ⚠️  Frontend .env file already exists
)
cd ..

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Start the game: docker-compose up
echo 2. Open browser: http://localhost:3000
echo 3. Create a game and share the Game ID with friends!
echo.
echo For manual setup without Docker:
echo - Backend: cd backend ^&^& pip install -r requirements.txt ^&^& python start.py dev
echo - Frontend: cd frontend ^&^& npm install ^&^& npm run dev

pause 