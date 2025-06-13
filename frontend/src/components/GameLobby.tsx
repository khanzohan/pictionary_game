import React, { useState } from 'react';
import { Users, Plus, ArrowRight, Gamepad2 } from 'lucide-react';

interface GameLobbyProps {
  onJoinGame: (gameId: string, playerName: string) => void;
  onCreateGame: (playerName: string) => void;
  isLoading: boolean;
  error?: string;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onJoinGame, onCreateGame, isLoading, error }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState<'join' | 'create'>('create');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      return;
    }

    if (mode === 'create') {
      onCreateGame(playerName.trim());
    } else {
      if (!gameId.trim()) {
        return;
      }
      onJoinGame(gameId.trim(), playerName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Gamepad2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Pictionary</h1>
          <p className="text-gray-600">Draw, guess, and have fun with friends!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Player Name Input */}
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
              maxLength={20}
            />
          </div>

          {/* Mode Selection */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('create')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  mode === 'create'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Plus className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Create Game</div>
              </button>
              
              <button
                type="button"
                onClick={() => setMode('join')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  mode === 'join'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Join Game</div>
              </button>
            </div>

            {/* Game ID Input (only for join mode) */}
            {mode === 'join' && (
              <div>
                <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 mb-2">
                  Game ID
                </label>
                <input
                  id="gameId"
                  type="text"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value.toUpperCase())}
                  placeholder="Enter game ID (e.g., ABC12345)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  required={mode === 'join'}
                  disabled={isLoading}
                  maxLength={8}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !playerName.trim() || (mode === 'join' && !gameId.trim())}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold transition-all hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === 'create' ? 'Creating Game...' : 'Joining Game...'}
              </>
            ) : (
              <>
                {mode === 'create' ? 'Create New Game' : 'Join Game'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">How to Play:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Players take turns drawing words</li>
            <li>• Other players guess what's being drawn</li>
            <li>• Correct guesses earn 10 points</li>
            <li>• Each round lasts 60 seconds</li>
            <li>• Up to 8 players per game</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameLobby; 