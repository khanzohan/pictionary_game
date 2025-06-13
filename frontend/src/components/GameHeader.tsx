import React from 'react';
import { Palette } from 'lucide-react';

const GameHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Palette className="w-12 h-12 text-blue-500" />
        <h1 className="text-5xl font-bold text-gray-800">Pictionary</h1>
      </div>
      <p className="text-xl text-gray-600">Draw, Guess, and Have Fun!</p>
    </div>
  );
};

export default GameHeader; 