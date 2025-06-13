import React from 'react';
import { Play, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { GameState } from '../types/game';

interface GameControlsProps {
  gameState: GameState;
  onStartGame: () => void;
  onResetGame: () => void;
  onShowWord: () => void;
  showWord: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onStartGame,
  onResetGame,
  onShowWord,
  showWord
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {gameState === 'waiting' && (
        <button
          onClick={onStartGame}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg"
        >
          <Play className="w-5 h-5" />
          Start Game
        </button>
      )}

      {gameState === 'playing' && (
        <button
          onClick={onShowWord}
          className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors shadow-lg ${
            showWord 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {showWord ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          {showWord ? 'Hide Word' : 'Show Word'}
        </button>
      )}

      <button
        onClick={onResetGame}
        className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-lg"
      >
        <RotateCcw className="w-5 h-5" />
        Reset Game
      </button>
    </div>
  );
};

export default GameControls; 