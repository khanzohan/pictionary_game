# Pictionary Game Frontend

A modern, real-time multiplayer Pictionary game frontend built with React, TypeScript, and Tailwind CSS. Connected to a FastAPI backend for seamless multiplayer gameplay with WebSocket synchronization.

## 🎮 Features

### **Core Multiplayer Features**
- **Real-time Drawing Sync**: Canvas synchronization across all players via WebSocket
- **Game Rooms**: Create and join multiplayer rooms (up to 8 players)
- **Live Player Management**: See connected players, scores, and current turn
- **WebSocket Communication**: Instant game updates and drawing synchronization
- **Turn-based System**: Automatic player rotation managed by backend
- **Real-time Scoring**: Points update instantly for all players

### **Enhanced Drawing Tools**
- **Interactive Canvas**: Full-featured drawing with 10 colors and variable brush sizes
- **Eraser Tool**: Precise stroke removal with visual feedback
- **Auto Canvas Clear**: Automatic clearing between rounds and games
- **Touch Support**: Full mobile support with touch drawing
- **Drawing Sync**: Real-time stroke synchronization across all clients

### **Modern UI/UX**
- **Game Lobby**: Beautiful room creation and joining interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Live Game State**: Real-time timer, scores, and turn indicators
- **Error Handling**: Graceful error messages and loading states
- **Connection Management**: Auto-reconnection on WebSocket disconnect

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or yarn package manager
- **FastAPI Backend** (running on localhost:8000)

### Installation & Setup

1. **Ensure Backend is Running**:
   ```bash
   # In a separate terminal, start the backend
   cd ../backend
   pip install -r requirements.txt
   python start.py dev
   ```
   Backend should be running at `http://localhost:8000`

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Open Game**:
   ```
   http://localhost:3000
   ```

5. **Test Multiplayer**:
   - Open multiple browser tabs/windows
   - Create a game in one tab, join with Game ID in others
   - Experience real-time multiplayer gameplay!

## 🎯 How to Play (Multiplayer)

### **1. Join or Create Game**
- **Create Game**: Enter your name and click "Create New Game"
- **Join Game**: Enter your name and Game ID to join existing room
- Game ID is shared with other players to join your room

### **2. Game Lobby**
- Wait for other players to join (2-8 players supported)
- See all connected players in the player list
- Host can start the game when ready

### **3. Multiplayer Gameplay**
- **Current Drawer**: Gets a word and draws it for others to guess
- **Other Players**: Watch drawing in real-time and submit guesses
- **Scoring**: 10 points for correct guesses
- **Turn Rotation**: Automatic switching to next player after each round
- **Timer**: 60-second rounds with live countdown

### **4. Real-time Features**
- Drawing strokes appear instantly on all screens
- Game state updates (scores, timer, turns) sync in real-time
- Canvas clearing syncs across all players
- Player join/leave notifications

## 🛠️ Available Scripts

- `npm run dev` - Start development server (requires backend running)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Game Controls

### Drawing Tools
- **Color Palette**: 10 different colors to choose from
- **Brush Size**: Adjustable from 1-20 pixels
- **Clear Canvas**: Remove all drawings
- **Touch/Mouse Support**: Works with both input methods

### Game Features
- **Timer**: 60-second countdown for each round
- **Word Visibility**: Toggle word visibility for helpers/observers
- **Player List**: Shows current scores and who's turn it is
- **Turn Rotation**: Automatic player switching after each round

## 🏗️ Project Structure

```
src/
├── components/
│   ├── DrawingCanvas.tsx    # Real-time drawing with WebSocket sync
│   ├── GameControls.tsx     # Game management controls
│   ├── GameHeader.tsx       # Game title and branding
│   ├── GameLobby.tsx        # Room creation and joining UI
│   ├── PlayerList.tsx       # Live player list with scores
│   └── WordDisplay.tsx      # Word and timer display
├── services/
│   └── api.ts              # FastAPI integration & WebSocket service
├── types/
│   └── game.ts             # TypeScript type definitions
├── utils/
│   └── words.ts            # Word bank (shared with backend)
├── App.tsx                 # Main multiplayer app logic
├── main.tsx               # Application entry point
└── index.css              # Global styles and Tailwind imports
```

## 🔗 Backend Integration

### **API Endpoints Used**
- `POST /api/games` - Create new game room
- `POST /api/games/{id}/join` - Join game room
- `POST /api/games/{id}/start` - Start multiplayer game
- `POST /api/games/{id}/guess` - Submit guess
- `GET /api/games/{id}` - Get game state
- `WebSocket /ws/{game_id}/{player_id}` - Real-time communication

### **WebSocket Events**
- **Drawing sync** - Real-time canvas synchronization
- **Game state updates** - Timer, scores, turns
- **Player management** - Join/leave notifications
- **Canvas clearing** - Synchronized canvas clears
- **Game events** - Start, end, correct guesses

## 🌟 Technical Features

### **Frontend Stack**
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for beautiful icons
- **HTML5 Canvas** for smooth drawing experience

### **Real-time Communication**
- **WebSocket Integration** with auto-reconnection
- **REST API** for game management
- **Event-driven Architecture** for real-time updates
- **Error Handling** with graceful fallbacks

### **Drawing Engine**
- **Canvas API** with optimized rendering
- **Touch Events** for mobile support
- **Real-time Sync** via WebSocket messages
- **Stroke-based Drawing** for precise erasing

## 🎮 Multiplayer Gameplay

### **Game Flow**
1. **Lobby** → Create or join game room
2. **Waiting** → Players join, host starts game
3. **Drawing Round** → Current player draws word
4. **Guessing Phase** → Other players submit guesses
5. **Scoring** → Points awarded for correct guesses
6. **Next Turn** → Rotate to next player
7. **Repeat** → Continue until desired rounds completed

### **Real-time Features**
- ✅ **Instant Drawing Sync** - See strokes as they're drawn
- ✅ **Live Scoring** - Points update immediately
- ✅ **Turn Management** - Backend handles player rotation
- ✅ **Timer Sync** - Countdown synchronized across clients
- ✅ **Canvas Clearing** - Auto-clear between rounds
- ✅ **Connection Status** - Auto-reconnect on disconnect

## 📱 Cross-Platform Support

- **Desktop Browsers** - Chrome, Firefox, Safari, Edge
- **Mobile Devices** - iOS Safari, Android Chrome
- **Touch Drawing** - Native touch events for mobile
- **Responsive Layout** - Adapts to all screen sizes
- **PWA Ready** - Can be installed as app

## 🔧 Development & Customization

### **Configuration**
- **API URLs** - Configure in `src/services/api.ts`
- **Game Settings** - Timer, max players (backend controlled)
- **UI Theming** - Tailwind CSS configuration
- **Drawing Tools** - Colors and brush sizes

### **Environment Variables**
```bash
# Optional frontend configuration
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## 🚀 Deployment

### **Frontend Deployment**
```bash
npm run build
# Deploy 'dist' folder to hosting service
```

### **Production Requirements**
- Backend API running and accessible
- WebSocket support enabled
- CORS configured for frontend domain
- HTTPS for production WebSocket connections

## 📄 License

This project is open source and available under the MIT License.

## 🧪 Testing Multiplayer

1. **Start Backend**: `cd backend && python start.py dev`
2. **Start Frontend**: `npm run dev`
3. **Multiple Players**: Open multiple browser tabs
4. **Create Game**: One tab creates, others join with Game ID
5. **Test Features**: Drawing sync, guessing, scoring, turns

## 🤝 Contributing

The frontend integrates tightly with the FastAPI backend. When contributing:

- **API Changes** - Update service layer in `src/services/api.ts`
- **WebSocket Events** - Handle new events in `src/App.tsx`
- **Game Features** - Consider both frontend UX and backend state
- **Testing** - Test with multiple browser tabs for multiplayer

## 🎉 Ready for Multiplayer!

This frontend provides a professional multiplayer Pictionary experience:

✅ **Real-time multiplayer** with up to 8 players  
✅ **WebSocket synchronization** for instant drawing updates  
✅ **Modern React architecture** with TypeScript safety  
✅ **Mobile-friendly design** with touch support  
✅ **Robust error handling** and auto-reconnection  
✅ **Beautiful UI/UX** with Tailwind CSS styling  

Start the backend, fire up the frontend, and enjoy multiplayer Pictionary! 🎨🎮 