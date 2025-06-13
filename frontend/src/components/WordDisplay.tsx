import React from 'react';
import { Clock, Eye, EyeOff } from 'lucide-react';
import { GameState } from '../types/game';

interface WordDisplayProps {
  word: string;
  gameState: GameState;
  showWord: boolean;
  isCurrentPlayer: boolean;
  timeLeft: number;
}

const WordDisplay: React.FC<WordDisplayProps> = ({
  word,
  gameState,
  showWord,
  isCurrentPlayer,
  timeLeft
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (timeLeft > 30) return 'text-green-600';
    if (timeLeft > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className={`w-6 h-6 ${getTimeColor()}`} />
          <span className={`text-2xl font-bold ${getTimeColor()}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        {gameState === 'playing' && (
          <div className="flex items-center gap-2">
            {showWord ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            <span className="text-sm text-gray-600">
              {showWord ? 'Word Visible' : 'Word Hidden'}
            </span>
          </div>
        )}
      </div>

      <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        {gameState === 'waiting' && (
          <p className="text-2xl text-gray-600">Click "Start Game" to begin!</p>
        )}
        
        {gameState === 'playing' && (
          <div className="space-y-2">
            <p className="text-lg text-gray-600 mb-2">Draw this word:</p>
            <div className="text-4xl font-bold text-blue-600">
              {showWord || isCurrentPlayer ? word : '???'}
            </div>
          </div>
        )}
        
        {gameState === 'ended' && (
          <div className="space-y-2">
            <p className="text-lg text-gray-600">The word was:</p>
            <div className="text-4xl font-bold text-green-600">{word}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordDisplay; 