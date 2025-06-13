# 🎨 Pictionary Game - Full Stack Application

A modern, real-time multiplayer Pictionary game built with React (TypeScript) frontend and FastAPI (Python) backend. Draw, guess, and have fun with friends!

> **⚡ Want to get started in 2 minutes?** See [QUICKSTART.md](QUICKSTART.md) for the super simple Docker setup!

## 🎮 Live Demo & Features

### **Core Gameplay**
- ✅ **Real-time Drawing** - Canvas synchronization across all players
- ✅ **Multiplayer Rooms** - Up to 8 players per game room
- ✅ **Turn-based System** - Automatic player rotation
- ✅ **Timer System** - 60-second rounds with visual countdown
- ✅ **Score Tracking** - Points for correct guesses with leaderboard
- ✅ **Word Bank** - 80+ curated words across 7 categories
- ✅ **Mobile Support** - Touch drawing on phones and tablets

### **Advanced Features**
- ✅ **WebSocket Communication** - Real-time game updates
- ✅ **Drawing Tools** - Colors, brush sizes, eraser
- ✅ **Auto Canvas Clear** - Between rounds and game resets
- ✅ **Game State Management** - Persistent room states
- ✅ **Player Management** - Join/leave games dynamically
- ✅ **API Documentation** - Interactive Swagger docs

## 🚀 Quick Start (Docker - Recommended)

### **🐳 Super Easy Docker Setup**
```bash
# 1. Clone the repository
git clone <repository-url>
cd pictionary-game

# 2. Set up environment files (optional - has defaults)
cp env.local.txt .env

# 3. Start everything with one command!
docker-compose up --build
```

**That's it! 🎉**
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs`

### **📋 Docker Prerequisites**
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### **🛠️ Manual Setup (Alternative)**
<details>
<summary>Click to expand manual setup instructions</summary>

#### **Backend Setup**
```bash
cd backend
# Set up environment
cp env.local.txt .env
# Install dependencies
pip install -r requirements.txt
python start.py dev
```

#### **Frontend Setup**
```bash
cd frontend
# Set up environment (optional)
cp env.local.txt .env
# Install dependencies
npm install
npm run dev
```
</details>

## 🐳 Docker Commands

### **Development**
```bash
# Start all services
docker-compose up

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers (after code changes)
docker-compose up --build
```

### **Troubleshooting**
```bash
# Reset everything
docker-compose down -v
docker-compose build --no-cache
docker-compose up

# Check container status
docker-compose ps

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

## 🏗️ Project Structure

```
pictionary-game/
├── frontend/                   # React TypeScript Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── DrawingCanvas.tsx
│   │   │   ├── GameControls.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   └── ...
│   │   ├── services/          # API integration
│   │   ├── types/             # TypeScript definitions
│   │   ├── utils/             # Utility functions
│   │   └── App.tsx            # Main app component
│   ├── Dockerfile             # Dev container config
│   ├── Dockerfile.prod        # Production container config
│   ├── nginx.conf             # Production web server config
│   ├── env.local.txt          # Environment template
│   ├── .gitignore             # Git ignore rules
│   ├── package.json           # Frontend dependencies
│   └── README.md             # Frontend documentation
│
├── backend/                   # FastAPI Python Backend
│   ├── models/               # Pydantic models
│   │   ├── game.py          # Game state models
│   │   └── websocket.py     # WebSocket manager
│   ├── utils/               # Backend utilities
│   │   └── words.py         # Word bank
│   ├── Dockerfile           # Backend container config
│   ├── env.local.txt        # Environment template
│   ├── .gitignore           # Git ignore rules
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
│
├── docker-compose.yml        # Development orchestration
├── docker-compose.prod.yml   # Production orchestration
├── env.local.txt            # Root environment template
├── .gitignore               # Root git ignore rules
├── QUICKSTART.md            # 2-minute setup guide
└── README.md              # This file
```

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast development and building
- **Lucide React** - Beautiful icons
- **HTML5 Canvas** - Smooth drawing experience

### **Backend**
- **FastAPI** - Modern Python web framework
- **WebSockets** - Real-time communication
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server
- **Python 3.8+** - Modern Python features

### **Communication**
- **REST API** - Game management endpoints
- **WebSockets** - Real-time drawing and game events
- **CORS** - Frontend-backend integration

## 🎯 Game Flow

### **1. Create/Join Game**
- Players create or join game rooms
- Each room supports up to 8 players
- Real-time player list updates

### **2. Start Round**
- Current player gets a random word
- 60-second timer starts
- Canvas is cleared for new drawing

### **3. Drawing Phase**
- Current player draws the word
- Drawing syncs in real-time to all players
- Drawing tools: colors, brush sizes, eraser

### **4. Guessing Phase**
- Other players submit guesses
- Correct guess = 10 points + round ends
- Timer runs out = round ends automatically

### **5. Next Round**
- Turn rotates to next player
- Scores update on leaderboard
- Process repeats

## 📡 API Endpoints

### **Game Management**
- `POST /api/games` - Create new game room
- `GET /api/games/{game_id}` - Get game state  
- `POST /api/games/{game_id}/join` - Join game room
- `POST /api/games/{game_id}/start` - Start the game
- `POST /api/games/{game_id}/guess` - Submit guess
- `POST /api/games/{game_id}/reset` - Reset game

### **WebSocket**
- `WS /ws/{game_id}/{player_id}` - Real-time communication

### **Words**
- `GET /api/words` - Get all words
- `GET /api/words/random` - Get random word

## 🔧 Development Setup

### **Prerequisites**
- **Node.js 16+** (for frontend)
- **Python 3.8+** (for backend)
- **npm/yarn** (for frontend packages)
- **pip** (for Python packages)

### **Frontend Development**
```bash
cd frontend
npm install
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linting
```

### **Backend Development**
```bash
cd backend
pip install -r requirements.txt
python start.py dev    # Start dev server
python start.py check  # Check dependencies
```

### **Environment Configuration**

**Root Level** (for Docker):
```bash
# Copy template to .env file
cp env.local.txt .env
```

**Frontend** (`frontend/`):
```bash
# Optional - Docker provides defaults
cp env.local.txt .env
```

**Backend** (`backend/`):
```bash
# Optional - Docker provides defaults  
cp env.local.txt .env
```

All environment files are included with correct development values. Docker Compose uses the root `.env` file automatically.

## 🚦 Testing the Game

### **🎮 Quick Multiplayer Test**
1. **Start with Docker**: `docker-compose up`
2. **Open Game**: Go to `http://localhost:3000`
3. **Create Game**: Enter your name, click "Create New Game"
4. **Get Game ID**: Copy the Game ID from the screen
5. **Join as Player 2**: Open new browser tab, enter name + Game ID
6. **Start Playing**: Click "Start Game" and enjoy real-time multiplayer!

### **✅ What to Test**
- **Real-time Drawing**: Draw in one tab, see it instantly in others
- **Turn Management**: Only current player can draw, others guess
- **Scoring System**: Correct guesses earn 10 points immediately
- **Game State Sync**: Timer, scores, rounds sync across all players
- **Mobile Support**: Test on phone/tablet with touch drawing

### **🔍 API Testing (Optional)**
```bash
# Health check
curl http://localhost:8000/health

# Create game
curl -X POST http://localhost:8000/api/games

# Interactive API docs
open http://localhost:8000/docs
```

## 🌟 Why Docker?

### **🎯 Benefits for Clients & Testing**
✅ **One Command Setup** - No Python/Node.js installation needed  
✅ **Consistent Environment** - Works the same on any machine  
✅ **Zero Configuration** - No environment setup headaches  
✅ **Instant Testing** - Get the game running in under 2 minutes  
✅ **Easy Cleanup** - Remove everything with one command  
✅ **Production Ready** - Same containers work in production  

### **🚀 Perfect for:**
- **Client Demos** - Impress clients with instant setup
- **Development Teams** - Consistent dev environment
- **Testing** - Quick validation without setup overhead
- **Deployment** - Container-ready for any cloud platform

## 🎨 Drawing Features

### **Drawing Tools**
- **10 Colors** - Vibrant color palette
- **Variable Brush Size** - 1-20 pixel brush width
- **Eraser Tool** - Remove strokes precisely
- **Clear Canvas** - Remove all drawings
- **Touch Support** - Works on mobile devices

### **Real-time Sync**
- Drawing strokes sync instantly across all players
- Canvas clearing syncs to all clients
- Smooth performance with optimized WebSocket messages

## 🎮 Game Customization

### **Configurable Settings**
- **Round Timer** - Modify `ROUND_TIME` in backend
- **Max Players** - Adjust `MAX_PLAYERS` setting  
- **Word Bank** - Add/remove words in `utils/words.py`
- **Scoring** - Customize point values
- **Round Limits** - Set maximum rounds per game

### **Word Categories**
- **Animals** - cat, dog, elephant, etc.
- **Objects** - car, house, computer, etc.
- **Food** - pizza, apple, sandwich, etc.
- **Actions** - running, dancing, cooking, etc.
- **Sports** - football, tennis, basketball, etc.
- **Nature** - mountain, ocean, rainbow, etc.
- **Emotions** - happy, excited, surprised, etc.

## 🚀 Deployment

### **🐳 Docker Deployment (Recommended)**
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to any container platform:
# - AWS ECS/Fargate
# - Google Cloud Run
# - Azure Container Instances
# - Digital Ocean App Platform
# - Heroku Container Registry
```

### **🌐 Traditional Deployment**
<details>
<summary>Click for manual deployment options</summary>

#### **Frontend Deployment**
```bash
cd frontend
npm run build
# Deploy 'dist' folder to hosting service
```

#### **Backend Deployment**
```bash
cd backend
python start.py prod  # Production mode with multiple workers
```
</details>

### **⚙️ Production Configuration**
- **Environment Variables**: Copy `env.docker.example` to `.env`
- **CORS Origins**: Update for your production domain
- **SSL/HTTPS**: Required for WebSocket connections in production
- **Database**: Add persistent storage if needed
- **Monitoring**: Container health checks included

## 📱 Mobile Support

- **Responsive Design** - Works on all screen sizes
- **Touch Drawing** - Native touch events for mobile
- **Mobile-friendly UI** - Optimized buttons and controls
- **Cross-platform** - iOS, Android, desktop browsers

## 🔒 Security Features

- **Input Validation** - Pydantic models validate all inputs
- **CORS Protection** - Restricted to frontend origins
- **WebSocket Management** - Proper connection handling
- **Error Handling** - No sensitive data exposure

## 🎉 Ready to Play!

Your full-stack Pictionary game is ready! The application provides:

✅ **Professional multiplayer experience** with real-time sync  
✅ **Modern, responsive UI** that works on all devices  
✅ **Robust backend** with proper API design  
✅ **Easy setup** with comprehensive documentation  
✅ **Extensible architecture** for future enhancements  

## 🤝 Contributing

Feel free to contribute by:
- Adding new drawing tools or effects
- Expanding the word bank
- Improving the UI/UX design  
- Adding new game modes
- Enhancing mobile experience
- Adding sound effects or animations

## 📄 License

This project is open source and available under the MIT License.

---

**Have fun playing Pictionary! 🎨🎮** 