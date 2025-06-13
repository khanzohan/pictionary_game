from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, List, Optional
import json
import asyncio
import uuid
from datetime import datetime
import logging

from models.game import Game, Player, GameState, DrawingStroke
from models.websocket import ConnectionManager
from utils.words import get_random_word, get_word_list

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Pictionary Game API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global game state
games: Dict[str, Game] = {}
connection_manager = ConnectionManager()

@app.get("/")
async def root():
    return {"message": "Pictionary Game API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Game Management Endpoints
@app.post("/api/games")
async def create_game():
    """Create a new game room"""
    game_id = str(uuid.uuid4())[:8]
    game = Game(id=game_id)
    games[game_id] = game
    
    logger.info(f"Created new game: {game_id}")
    return {"game_id": game_id, "message": "Game created successfully"}

@app.get("/api/games/{game_id}")
async def get_game(game_id: str):
    """Get game state"""
    # Convert to lowercase for case-insensitive lookup
    game_id = game_id.lower()
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[game_id]
    return {
        "game_id": game_id,
        "state": game.state.value,
        "players": [player.dict() for player in game.players],
        "current_player_index": game.current_player_index,
        "time_left": game.time_left,
        "round_number": game.round_number,
        "word": game.current_word if game.state == GameState.ENDED else None
    }

@app.post("/api/games/{game_id}/join")
async def join_game(game_id: str, player_data: dict):
    """Join a game room"""
    # Convert to lowercase for case-insensitive lookup
    game_id = game_id.lower()
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[game_id]
    
    if len(game.players) >= 8:  # Max players limit
        raise HTTPException(status_code=400, detail="Game is full")
    
    player = Player(
        id=str(uuid.uuid4()),
        name=player_data.get("name", f"Player {len(game.players) + 1}"),
        score=0
    )
    
    game.add_player(player)
    
    # Notify all connected clients
    await connection_manager.broadcast_to_game(game_id, {
        "type": "player_joined",
        "player": player.dict(),
        "players": [p.dict() for p in game.players]
    })
    
    logger.info(f"Player {player.name} joined game {game_id}")
    return {"player_id": player.id, "message": "Joined game successfully"}

@app.post("/api/games/{game_id}/start")
async def start_game(game_id: str):
    """Start the game"""
    # Convert to lowercase for case-insensitive lookup
    game_id = game_id.lower()
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[game_id]
    
    if len(game.players) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 players to start")
    
    if game.state != GameState.WAITING:
        raise HTTPException(status_code=400, detail="Game already started")
    
    # Start the game
    game.start_round()
    
    # Notify all connected clients
    await connection_manager.broadcast_to_game(game_id, {
        "type": "game_started",
        "state": game.state.value,
        "current_word": game.current_word,
        "current_player_index": game.current_player_index,
        "time_left": game.time_left
    })
    
    # Start the game timer
    asyncio.create_task(game_timer(game_id))
    
    logger.info(f"Started game {game_id}")
    return {"message": "Game started"}

@app.post("/api/games/{game_id}/guess")
async def make_guess(game_id: str, guess_data: dict):
    """Make a guess"""
    # Convert to lowercase for case-insensitive lookup
    game_id = game_id.lower()
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[game_id]
    player_id = guess_data.get("player_id")
    guess = guess_data.get("guess", "").strip().lower()
    
    if not player_id or not guess:
        raise HTTPException(status_code=400, detail="Missing player_id or guess")
    
    player = game.get_player(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    
    if game.state != GameState.PLAYING:
        raise HTTPException(status_code=400, detail="Game not in playing state")
    
    # Check if correct guess
    is_correct = guess == game.current_word.lower()
    
    if is_correct:
        # Award points
        player.score += 10
        game.end_round()
        
        # Notify all clients
        await connection_manager.broadcast_to_game(game_id, {
            "type": "correct_guess",
            "player": player.dict(),
            "word": game.current_word,
            "players": [p.dict() for p in game.players]
        })
        
        # Start next round after delay
        asyncio.create_task(next_round_delay(game_id))
        
        logger.info(f"Correct guess by {player.name} in game {game_id}")
        return {"correct": True, "message": "Correct guess!"}
    else:
        # Broadcast the guess to other players
        await connection_manager.broadcast_to_game(game_id, {
            "type": "guess_made",
            "player": player.dict(),
            "guess": guess_data.get("guess")  # Original case
        })
        
        return {"correct": False, "message": "Try again!"}

@app.post("/api/games/{game_id}/reset")
async def reset_game(game_id: str):
    """Reset the game"""
    # Convert to lowercase for case-insensitive lookup
    game_id = game_id.lower()
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    
    game = games[game_id]
    game.reset()
    
    # Notify all connected clients
    await connection_manager.broadcast_to_game(game_id, {
        "type": "game_reset",
        "state": game.state.value,
        "players": [p.dict() for p in game.players]
    })
    
    logger.info(f"Reset game {game_id}")
    return {"message": "Game reset"}

# WebSocket endpoint for real-time communication
@app.websocket("/ws/{game_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str, player_id: str):
    # Convert to lowercase for case-insensitive lookup
    game_id = game_id.lower()
    await connection_manager.connect(websocket, game_id, player_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message["type"] == "drawing":
                # Broadcast drawing data to other players
                await connection_manager.broadcast_to_game(
                    game_id, 
                    message, 
                    exclude_player=player_id
                )
            elif message["type"] == "clear_canvas":
                # Broadcast canvas clear to other players
                await connection_manager.broadcast_to_game(
                    game_id, 
                    message, 
                    exclude_player=player_id
                )
            elif message["type"] == "ping":
                # Send pong back to keep connection alive
                await websocket.send_text(json.dumps({"type": "pong"}))
                
    except WebSocketDisconnect:
        connection_manager.disconnect(game_id, player_id)
        logger.info(f"Player {player_id} disconnected from game {game_id}")

# Game timer function
async def game_timer(game_id: str):
    """Handle game timer countdown"""
    # game_id is already lowercase when passed from other functions
    if game_id not in games:
        return
    
    game = games[game_id]
    
    while game.state == GameState.PLAYING and game.time_left > 0:
        await asyncio.sleep(1)
        if game.state == GameState.PLAYING:
            game.time_left -= 1
            
            # Broadcast time update every 5 seconds or when low
            if game.time_left % 5 == 0 or game.time_left <= 10:
                await connection_manager.broadcast_to_game(game_id, {
                    "type": "time_update",
                    "time_left": game.time_left
                })
    
    # Time's up
    if game.state == GameState.PLAYING and game.time_left <= 0:
        game.end_round()
        
        await connection_manager.broadcast_to_game(game_id, {
            "type": "time_up",
            "word": game.current_word
        })
        
        # Start next round after delay
        asyncio.create_task(next_round_delay(game_id))

async def next_round_delay(game_id: str):
    """Wait before starting next round"""
    await asyncio.sleep(3)  # 3 second delay
    
    # game_id is already lowercase when passed from other functions
    if game_id not in games:
        return
    
    game = games[game_id]
    
    if len(game.players) >= 2:
        game.next_turn()
        
        await connection_manager.broadcast_to_game(game_id, {
            "type": "next_round",
            "state": game.state.value,
            "current_word": game.current_word,
            "current_player_index": game.current_player_index,
            "time_left": game.time_left,
            "round_number": game.round_number
        })
        
        # Start timer for new round
        asyncio.create_task(game_timer(game_id))

# Word management endpoints
@app.get("/api/words")
async def get_words():
    """Get list of available words"""
    return {"words": get_word_list()}

@app.get("/api/words/random")
async def get_random_word_endpoint():
    """Get a random word"""
    return {"word": get_random_word()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 