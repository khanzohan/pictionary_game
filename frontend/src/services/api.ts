const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000';

export interface CreateGameResponse {
  game_id: string;
  message: string;
}

export interface JoinGameResponse {
  player_id: string;
  message: string;
}

export interface GameState {
  game_id: string;
  state: 'waiting' | 'playing' | 'ended';
  players: Array<{
    id: string;
    name: string;
    score: number;
    is_connected: boolean;
  }>;
  current_player_index: number;
  time_left: number;
  round_number: number;
  word?: string;
}

export interface GuessResponse {
  correct: boolean;
  message: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async createGame(): Promise<CreateGameResponse> {
    const response = await fetch(`${this.baseUrl}/api/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create game: ${response.statusText}`);
    }

    return response.json();
  }

  async joinGame(gameId: string, playerName: string): Promise<JoinGameResponse> {
    const response = await fetch(`${this.baseUrl}/api/games/${gameId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: playerName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to join game: ${response.statusText}`);
    }

    return response.json();
  }

  async getGameState(gameId: string): Promise<GameState> {
    const response = await fetch(`${this.baseUrl}/api/games/${gameId}`);

    if (!response.ok) {
      throw new Error(`Failed to get game state: ${response.statusText}`);
    }

    return response.json();
  }

  async startGame(gameId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/games/${gameId}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to start game: ${response.statusText}`);
    }
  }

  async makeGuess(gameId: string, playerId: string, guess: string): Promise<GuessResponse> {
    const response = await fetch(`${this.baseUrl}/api/games/${gameId}/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ player_id: playerId, guess }),
    });

    if (!response.ok) {
      throw new Error(`Failed to make guess: ${response.statusText}`);
    }

    return response.json();
  }

  async resetGame(gameId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/games/${gameId}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to reset game: ${response.statusText}`);
    }
  }

  async getRandomWord(): Promise<{ word: string }> {
    const response = await fetch(`${this.baseUrl}/api/words/random`);

    if (!response.ok) {
      throw new Error(`Failed to get random word: ${response.statusText}`);
    }

    return response.json();
  }
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface DrawingMessage extends WebSocketMessage {
  type: 'drawing';
  stroke: {
    points: Array<{ x: number; y: number }>;
    color: string;
    width: number;
  };
}

export interface ClearCanvasMessage extends WebSocketMessage {
  type: 'clear_canvas';
}

export type WebSocketEventHandler = (message: WebSocketMessage) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private gameId: string | null = null;
  private playerId: string | null = null;
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(gameId: string, playerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.gameId = gameId;
      this.playerId = playerId;

      const wsUrl = `${WS_BASE_URL}/ws/${gameId}/${playerId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.gameId && this.playerId) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(this.gameId!, this.playerId!).catch(console.error);
      }, 2000 * this.reconnectAttempts);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const handlers = this.eventHandlers.get(message.type) || [];
    handlers.forEach(handler => handler(message));

    // Handle ping/pong
    if (message.type === 'ping') {
      this.send({ type: 'pong' });
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  on(eventType: string, handler: WebSocketEventHandler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  off(eventType: string, handler: WebSocketEventHandler) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.gameId = null;
    this.playerId = null;
    this.eventHandlers.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instances
export const apiService = new ApiService();
export const webSocketService = new WebSocketService(); 