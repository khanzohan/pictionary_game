from fastapi import WebSocket
from typing import Dict, List, Optional
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Manages WebSocket connections for game rooms"""
    
    def __init__(self):
        # game_id -> {player_id -> websocket}
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, game_id: str, player_id: str):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        
        if game_id not in self.active_connections:
            self.active_connections[game_id] = {}
        
        self.active_connections[game_id][player_id] = websocket
        logger.info(f"Player {player_id} connected to game {game_id}")

    def disconnect(self, game_id: str, player_id: str):
        """Remove a WebSocket connection"""
        if game_id in self.active_connections:
            if player_id in self.active_connections[game_id]:
                del self.active_connections[game_id][player_id]
                logger.info(f"Player {player_id} disconnected from game {game_id}")
            
            # Clean up empty game rooms
            if not self.active_connections[game_id]:
                del self.active_connections[game_id]
                logger.info(f"Game room {game_id} cleaned up (no active connections)")

    async def send_personal_message(self, message: dict, game_id: str, player_id: str):
        """Send a message to a specific player"""
        if game_id in self.active_connections:
            if player_id in self.active_connections[game_id]:
                websocket = self.active_connections[game_id][player_id]
                try:
                    await websocket.send_text(json.dumps(message))
                except Exception as e:
                    logger.error(f"Error sending message to {player_id}: {e}")
                    # Connection might be dead, remove it
                    self.disconnect(game_id, player_id)

    async def broadcast_to_game(self, game_id: str, message: dict, exclude_player: Optional[str] = None):
        """Broadcast a message to all players in a game room"""
        if game_id not in self.active_connections:
            return

        disconnected_players = []
        
        for player_id, websocket in self.active_connections[game_id].items():
            if exclude_player and player_id == exclude_player:
                continue
            
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to {player_id}: {e}")
                disconnected_players.append(player_id)

        # Clean up disconnected players
        for player_id in disconnected_players:
            self.disconnect(game_id, player_id)

    def get_connected_players(self, game_id: str) -> List[str]:
        """Get list of connected player IDs for a game"""
        if game_id in self.active_connections:
            return list(self.active_connections[game_id].keys())
        return []

    def is_player_connected(self, game_id: str, player_id: str) -> bool:
        """Check if a specific player is connected"""
        return (game_id in self.active_connections and 
                player_id in self.active_connections[game_id])

    def get_connection_count(self, game_id: str) -> int:
        """Get number of active connections for a game"""
        if game_id in self.active_connections:
            return len(self.active_connections[game_id])
        return 0

    def get_all_games(self) -> List[str]:
        """Get list of all active game IDs"""
        return list(self.active_connections.keys()) 