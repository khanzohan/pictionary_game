export type GameState = 'waiting' | 'playing' | 'ended';

export interface Player {
  id: number;
  name: string;
  score: number;
}

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingStroke {
  points: DrawingPoint[];
  color: string;
  width: number;
} 