from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
import uuid
from utils.words import get_random_word

class GameState(Enum):
    WAITING = "waiting"
    PLAYING = "playing"
    ENDED = "ended"

class Player(BaseModel):
    id: str
    name: str
    score: int = 0
    is_connected: bool = True

class DrawingPoint(BaseModel):
    x: float
    y: float

class DrawingStroke(BaseModel):
    points: List[DrawingPoint]
    color: str
    width: float

class Game(BaseModel):
    id: str
    state: GameState = GameState.WAITING
    players: List[Player] = []
    current_player_index: int = 0
    current_word: str = ""
    time_left: int = 60
    round_number: int = 0
    max_rounds: int = 10
    strokes: List[DrawingStroke] = []

    def add_player(self, player: Player) -> bool:
        """Add a player to the game"""
        if len(self.players) >= 8:  # Max players
            return False
        
        # Check if player name already exists
        existing_names = [p.name for p in self.players]
        if player.name in existing_names:
            # Add number suffix if name exists
            counter = 1
            base_name = player.name
            while f"{base_name} ({counter})" in existing_names:
                counter += 1
            player.name = f"{base_name} ({counter})"
        
        self.players.append(player)
        return True

    def remove_player(self, player_id: str) -> bool:
        """Remove a player from the game"""
        for i, player in enumerate(self.players):
            if player.id == player_id:
                self.players.pop(i)
                
                # Adjust current player index if needed
                if i < self.current_player_index:
                    self.current_player_index -= 1
                elif i == self.current_player_index and self.current_player_index >= len(self.players):
                    self.current_player_index = 0
                
                return True
        return False

    def get_player(self, player_id: str) -> Optional[Player]:
        """Get a player by ID"""
        for player in self.players:
            if player.id == player_id:
                return player
        return None

    def get_current_player(self) -> Optional[Player]:
        """Get the current drawing player"""
        if 0 <= self.current_player_index < len(self.players):
            return self.players[self.current_player_index]
        return None

    def start_round(self):
        """Start a new round"""
        if len(self.players) < 2:
            raise ValueError("Need at least 2 players to start")
        
        self.state = GameState.PLAYING
        self.current_word = get_random_word()
        self.time_left = 60
        self.round_number += 1
        self.strokes = []

    def end_round(self):
        """End the current round"""
        self.state = GameState.ENDED
        self.time_left = 0

    def next_turn(self):
        """Move to the next player's turn"""
        if len(self.players) < 2:
            self.state = GameState.WAITING
            return
        
        self.current_player_index = (self.current_player_index + 1) % len(self.players)
        self.start_round()

    def reset(self):
        """Reset the entire game"""
        self.state = GameState.WAITING
        self.current_player_index = 0
        self.current_word = ""
        self.time_left = 60
        self.round_number = 0
        self.strokes = []
        
        # Reset all player scores
        for player in self.players:
            player.score = 0

    def add_stroke(self, stroke: DrawingStroke):
        """Add a drawing stroke"""
        self.strokes.append(stroke)

    def clear_canvas(self):
        """Clear all drawing strokes"""
        self.strokes = []

    def get_leaderboard(self) -> List[Player]:
        """Get players sorted by score (descending)"""
        return sorted(self.players, key=lambda p: p.score, reverse=True)

    def is_game_finished(self) -> bool:
        """Check if the game should end (max rounds reached)"""
        return self.round_number >= self.max_rounds

    class Config:
        use_enum_values = True 