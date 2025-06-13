# Pictionary Game Backend

A FastAPI backend for the Pictionary game with real-time WebSocket communication, game state management, and multiplayer support.

## 🚀 Features

- **RESTful API** - Complete game management endpoints
- **WebSocket Support** - Real-time drawing synchronization
- **Multi-room Support** - Multiple concurrent games
- **Player Management** - Join/leave games, scoring system
- **Game State Management** - Round timers, turn rotation
- **Word Bank API** - 80+ curated Pictionary words
- **CORS Enabled** - Frontend integration ready

## 🛠️ Tech Stack

- **FastAPI** - Modern Python web framework
- **WebSockets** - Real-time communication
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server
- **Python 3.8+** - Modern Python features

## 📋 Prerequisites

- Python 3.8 or higher
- pip package manager

## 🔧 Installation & Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the development server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Server will start at:**
   - API: `http://localhost:8000`
   - Interactive docs: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

## 📡 API Endpoints

### Game Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/games` | Create a new game room |
| `GET` | `/api/games/{game_id}` | Get game state |
| `POST` | `/api/games/{game_id}/join` | Join a game room |
| `POST` | `/api/games/{game_id}/start` | Start the game |
| `POST` | `/api/games/{game_id}/guess` | Make a guess |
| `POST` | `/api/games/{game_id}/reset` | Reset the game |

### Word Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/words` | Get all available words |
| `GET` | `/api/words/random` | Get a random word |

### WebSocket

| Endpoint | Description |
|----------|-------------|
| `WS` | `/ws/{game_id}/{player_id}` | Real-time game communication |

## 🎮 Game Flow

### 1. Create Game
```bash
curl -X POST http://localhost:8000/api/games
# Returns: {"game_id": "abc12345", "message": "Game created successfully"}
```

### 2. Join Game
```bash
curl -X POST http://localhost:8000/api/games/abc12345/join \
  -H "Content-Type: application/json" \
  -d '{"name": "Player 1"}'
```

### 3. Start Game
```bash
curl -X POST http://localhost:8000/api/games/abc12345/start
```

### 4. Make Guess
```bash
curl -X POST http://localhost:8000/api/games/abc12345/guess \
  -H "Content-Type: application/json" \
  -d '{"player_id": "player123", "guess": "cat"}'
```

## 🔌 WebSocket Messages

### Client → Server Messages

**Drawing Data:**
```json
{
  "type": "drawing",
  "stroke": {
    "points": [{"x": 100, "y": 150}],
    "color": "#000000",
    "width": 3
  }
}
```

**Clear Canvas:**
```json
{
  "type": "clear_canvas"
}
```

**Keep Alive:**
```json
{
  "type": "ping"
}
```

### Server → Client Messages

**Game Started:**
```json
{
  "type": "game_started",
  "state": "playing",
  "current_word": "cat",
  "current_player_index": 0,
  "time_left": 60
}
```

**Player Joined:**
```json
{
  "type": "player_joined",
  "player": {"id": "123", "name": "Player 1", "score": 0},
  "players": [...]
}
```

**Correct Guess:**
```json
{
  "type": "correct_guess",
  "player": {"id": "123", "name": "Player 1", "score": 10},
  "word": "cat",
  "players": [...]
}
```

**Time Update:**
```json
{
  "type": "time_update",
  "time_left": 45
}
```

## 🏗️ Project Structure

```
backend/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── models/
│   ├── __init__.py
│   ├── game.py            # Game state models
│   └── websocket.py       # WebSocket manager
├── utils/
│   ├── __init__.py
│   └── words.py           # Word bank utilities
└── README.md              # This file
```

## 🎯 Game Rules & Logic

### Game States
- **WAITING** - Game created, waiting for players
- **PLAYING** - Active round with timer
- **ENDED** - Round finished, showing results

### Player Management
- Maximum 8 players per game
- Automatic name collision handling
- Score tracking (10 points per correct guess)
- Turn rotation system

### Round System
- 60-second timer per round
- Automatic turn switching
- Canvas clearing between rounds
- Real-time score updates

## 🔧 Configuration

### Environment Variables
Create a `.env` file for configuration:

```bash
# Server configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS settings
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Game settings
ROUND_TIME=60
MAX_PLAYERS=8
MAX_ROUNDS=10
```

### Development vs Production

**Development:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Production:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🧪 Testing the API

### Using curl
```bash
# Health check
curl http://localhost:8000/health

# Get random word
curl http://localhost:8000/api/words/random

# Create game
curl -X POST http://localhost:8000/api/games
```

### Using the Interactive Docs
Visit `http://localhost:8000/docs` for a Swagger UI interface to test all endpoints.

## 🚀 Integration with Frontend

The backend is configured to work with the React frontend:

1. **CORS** - Allows requests from `http://localhost:3000`
2. **WebSocket** - Real-time drawing synchronization
3. **Game State** - Shared game logic between frontend/backend
4. **Word Bank** - Consistent word list across both sides

### Frontend Integration Points
- Game creation and joining
- Real-time drawing via WebSocket
- Turn management and scoring
- Timer synchronization
- Canvas clearing coordination

## 📊 Monitoring & Logging

The application includes comprehensive logging:
- Player connections/disconnections
- Game state changes
- Error handling
- WebSocket events

## 🔒 Security Considerations

- Input validation via Pydantic models
- WebSocket connection management
- Error handling without exposing internals
- CORS restrictions for frontend-only access

## 🎉 Ready to Play!

Your FastAPI backend is now ready to power the Pictionary game! The API provides:

✅ **Multi-room support** - Host multiple concurrent games  
✅ **Real-time drawing** - WebSocket-powered synchronization  
✅ **Turn management** - Automatic player rotation  
✅ **Score tracking** - Persistent scoring across rounds  
✅ **Timer system** - 60-second round countdown  
✅ **Word management** - Curated word bank API  

Start the backend server and connect your React frontend for a complete multiplayer Pictionary experience! 