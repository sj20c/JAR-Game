export type Phase = 'ready' | 'playing' | 'gameover';

export interface Player {
  x: number;
  y: number;
  vy: number;
  isJumping: boolean;
  frame: number;
  frameTimer: number;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export interface Cloud {
  x: number;
  y: number;
  w: number;
  speed: number;
  opacity: number;
}

export interface GroundDash {
  x: number;
  y: number;
  w: number;
}

export interface GameState {
  phase: Phase;
  score: number;
  bestScore: number;
  elapsedMs: number;
  speed: number;
  player: Player;
  obstacles: Obstacle[];
  particles: Particle[];
  clouds: Cloud[];
  groundDashes: GroundDash[];
}
