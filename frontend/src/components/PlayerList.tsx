import React from 'react';
import { Crown, User } from 'lucide-react';
import { Player } from '../types/game';

interface PlayerListProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerIndex }) => {
  const getLeadingPlayer = (): Player | null => {
    if (players.length === 0) return null;
    return players.reduce((leader, player) => 
      player.score > leader.score ? player : leader
    );
  };

  const leadingPlayer = getLeadingPlayer();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-6 h-6" />
        Players
      </h3>
      
      <div className="space-y-3">
        {players.map((player, index) => {
          const isCurrentPlayer = index === currentPlayerIndex;
          const isLeading = leadingPlayer && player.id === leadingPlayer.id && player.score > 0;
          
          return (
            <div
              key={player.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentPlayer 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isLeading && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className={`font-semibold ${
                    isCurrentPlayer ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {player.name}
                  </span>
                  {isCurrentPlayer && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                      Drawing
                    </span>
                  )}
                </div>
                <div className={`text-xl font-bold ${
                  isCurrentPlayer ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {player.score}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {leadingPlayer && leadingPlayer.score > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            🏆 {leadingPlayer.name} is leading with {leadingPlayer.score} points!
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerList; 