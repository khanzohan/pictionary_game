import React, { useState, useEffect, useRef, useCallback } from 'react';
import DrawingCanvas, { DrawingCanvasRef } from './components/DrawingCanvas';
import GameHeader from './components/GameHeader';
import WordDisplay from './components/WordDisplay';
import PlayerList from './components/PlayerList';
import GameControls from './components/GameControls';
import GameLobby from './components/GameLobby';
import { GameState as GameStateType, Player } from './types/game';
import { apiService, webSocketService, GameState } from './services/api';

interface AppState {
  screen: 'lobby' | 'game';
  gameId: string;
  playerId: string;
  playerName: string;
  gameState: GameState | null;
  error: string;
  isLoading: boolean;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    screen: 'lobby',
    gameId: '',
    playerId: '',
    playerName: '',
    gameState: null,
    error: '',
    isLoading: false,
  });

  const [guess, setGuess] = useState<string>('');
  const [showWord, setShowWord] = useState<boolean>(false);
  const canvasRef = useRef<DrawingCanvasRef>(null);

  // Get current player data
  const currentPlayer = appState.gameState?.players.find(p => p.id === appState.playerId);
  const isCurrentDrawer = appState.gameState?.current_player_index !== undefined && 
    appState.gameState.players[appState.gameState.current_player_index]?.id === appState.playerId;

  // Convert backend game state to frontend format
  const convertGameState = (backendState: string): GameStateType => {
    switch (backendState) {
      case 'waiting': return 'waiting';
      case 'playing': return 'playing';
      case 'ended': return 'ended';
      default: return 'waiting';
    }
  };

  // Handle WebSocket game events
  useEffect(() => {
    const handleGameStarted = (message: any) => {
      console.log('Game started:', message);
      refreshGameState();
      setShowWord(false);
      // Clear canvas when game starts
      setTimeout(() => {
        canvasRef.current?.clearCanvas();
      }, 100);
    };

    const handlePlayerJoined = (message: any) => {
      console.log('Player joined:', message);
      refreshGameState();
    };

    const handleCorrectGuess = (message: any) => {
      console.log('Correct guess:', message);
      refreshGameState();
      setGuess('');
    };

    const handleTimeUpdate = (message: any) => {
      setAppState(prev => ({
        ...prev,
        gameState: prev.gameState ? {
          ...prev.gameState,
          time_left: message.time_left
        } : null
      }));
    };

    const handleTimeUp = (message: any) => {
      console.log('Time up:', message);
      refreshGameState();
    };

    const handleNextRound = (message: any) => {
      console.log('Next round:', message);
      refreshGameState();
      setShowWord(false);
      // Clear canvas for next round
      setTimeout(() => {
        canvasRef.current?.clearCanvas();
      }, 100);
    };

    const handleGameReset = (message: any) => {
      console.log('Game reset:', message);
      refreshGameState();
      setShowWord(false);
      setGuess('');
      // Clear canvas when game resets
      setTimeout(() => {
        canvasRef.current?.clearCanvas();
      }, 100);
    };

    const handleGuess = (message: any) => {
      console.log('Player guess:', message);
      // Could show guess in chat or UI
    };

    // Subscribe to WebSocket events
    webSocketService.on('game_started', handleGameStarted);
    webSocketService.on('player_joined', handlePlayerJoined);
    webSocketService.on('correct_guess', handleCorrectGuess);
    webSocketService.on('time_update', handleTimeUpdate);
    webSocketService.on('time_up', handleTimeUp);
    webSocketService.on('next_round', handleNextRound);
    webSocketService.on('game_reset', handleGameReset);
    webSocketService.on('guess_made', handleGuess);

    return () => {
      webSocketService.off('game_started', handleGameStarted);
      webSocketService.off('player_joined', handlePlayerJoined);
      webSocketService.off('correct_guess', handleCorrectGuess);
      webSocketService.off('time_update', handleTimeUpdate);
      webSocketService.off('time_up', handleTimeUp);
      webSocketService.off('next_round', handleNextRound);
      webSocketService.off('game_reset', handleGameReset);
      webSocketService.off('guess_made', handleGuess);
    };
  }, []);

  const refreshGameState = useCallback(async () => {
    if (appState.gameId) {
      try {
        const gameState = await apiService.getGameState(appState.gameId);
        setAppState(prev => ({ ...prev, gameState }));
      } catch (error) {
        console.error('Failed to refresh game state:', error);
      }
    }
  }, [appState.gameId]);

  // Create a new game
  const handleCreateGame = async (playerName: string) => {
    setAppState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      // Create game
      const createResponse = await apiService.createGame();
      const gameId = createResponse.game_id;

      // Join the created game
      const joinResponse = await apiService.joinGame(gameId, playerName);
      const playerId = joinResponse.player_id;

      // Connect to WebSocket
      await webSocketService.connect(gameId, playerId);

      // Get initial game state
      const gameState = await apiService.getGameState(gameId);

      setAppState(prev => ({
        ...prev,
        screen: 'game',
        gameId,
        playerId,
        playerName,
        gameState,
        isLoading: false,
        error: ''
      }));

    } catch (error) {
      console.error('Failed to create game:', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create game'
      }));
    }
  };

  // Join an existing game
  const handleJoinGame = async (gameId: string, playerName: string) => {
    setAppState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      // Join the game
      const joinResponse = await apiService.joinGame(gameId, playerName);
      const playerId = joinResponse.player_id;

      // Connect to WebSocket
      await webSocketService.connect(gameId, playerId);

      // Get initial game state
      const gameState = await apiService.getGameState(gameId);

      setAppState(prev => ({
        ...prev,
        screen: 'game',
        gameId,
        playerId,
        playerName,
        gameState,
        isLoading: false,
        error: ''
      }));

    } catch (error) {
      console.error('Failed to join game:', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to join game'
      }));
    }
  };

  // Start the game
  const handleStartGame = async () => {
    if (!appState.gameId) return;

    try {
      await apiService.startGame(appState.gameId);
      // Game state will be updated via WebSocket event
    } catch (error) {
      console.error('Failed to start game:', error);
      setAppState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start game'
      }));
    }
  };

  // Make a guess
  const handleGuess = async () => {
    if (!guess.trim() || !appState.gameId || !appState.playerId) return;

    try {
      const response = await apiService.makeGuess(appState.gameId, appState.playerId, guess);
      setGuess('');
      
      if (response.correct) {
        // Game state will be updated via WebSocket event
        console.log('Correct guess!');
      }
    } catch (error) {
      console.error('Failed to make guess:', error);
      setGuess('');
    }
  };

  // Reset the game
  const handleResetGame = async () => {
    if (!appState.gameId) return;

    try {
      await apiService.resetGame(appState.gameId);
      // Game state will be updated via WebSocket event
    } catch (error) {
      console.error('Failed to reset game:', error);
      setAppState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to reset game'
      }));
    }
  };

  // Leave game and return to lobby
  const handleLeaveGame = () => {
    webSocketService.disconnect();
    setAppState({
      screen: 'lobby',
      gameId: '',
      playerId: '',
      playerName: '',
      gameState: null,
      error: '',
      isLoading: false,
    });
    setGuess('');
    setShowWord(false);
  };

  // Show lobby screen
  if (appState.screen === 'lobby') {
    return (
      <GameLobby
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        isLoading={appState.isLoading}
        error={appState.error}
      />
    );
  }

  // Show game screen
  if (!appState.gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  const frontendGameState = convertGameState(appState.gameState.state);
  const players: Player[] = appState.gameState.players.map(p => ({
    id: parseInt(p.id.slice(-3)), // Convert ID for display
    name: p.name,
    score: p.score
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <GameHeader />
        
        {/* Game Info Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-600">Game ID:</span>
                <span className="ml-2 font-mono font-bold text-lg">{appState.gameId}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Round:</span>
                <span className="ml-2 font-bold">{appState.gameState.round_number}</span>
              </div>
            </div>
            <button
              onClick={handleLeaveGame}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Leave Game
            </button>
          </div>
        </div>

        {/* Error Display */}
        {appState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{appState.error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <WordDisplay 
                word={appState.gameState.word || ''}
                gameState={frontendGameState}
                showWord={showWord || !isCurrentDrawer}
                isCurrentPlayer={isCurrentDrawer}
                timeLeft={appState.gameState.time_left}
              />
              
              <DrawingCanvas 
                ref={canvasRef}
                gameState={frontendGameState}
                isDrawer={isCurrentDrawer}
              />
              
              {/* Guess Input - only show for non-drawers during playing state */}
              {frontendGameState === 'playing' && !isCurrentDrawer && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                    placeholder="Enter your guess..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleGuess}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Guess
                  </button>
                </div>
              )}

              {/* Drawer message */}
              {frontendGameState === 'playing' && isCurrentDrawer && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 font-medium text-center">
                    🎨 It's your turn to draw! Draw the word above for others to guess.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <PlayerList 
              players={players}
              currentPlayerIndex={appState.gameState.current_player_index}
            />
          </div>
        </div>
        
        <GameControls
          gameState={frontendGameState}
          onStartGame={handleStartGame}
          onResetGame={handleResetGame}
          onShowWord={() => setShowWord(!showWord)}
          showWord={showWord}
        />
        
        {/* Game Status Messages */}
        {frontendGameState === 'ended' && appState.gameState.word && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Round Over!</h2>
              <p className="text-xl text-gray-600 mb-2">The word was:</p>
              <p className="text-4xl font-bold text-blue-600 mb-4">{appState.gameState.word}</p>
              <p className="text-lg text-gray-600">Next player's turn coming up...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 