import { GameState, Obstacle, Particle, Cloud, GroundDash } from './types';
import { updatePlayerPosition } from './physics';
import { getSpeed, getSpawnInterval, spawnObstacle } from './spawn';
import { checkCollision } from './collision';
import {
  BASE_SPEED,
  PLAYER_X,
  FRAME_INTERVAL_MS,
  RUN_FRAMES,
  HOLD_MAX,
  GROUND_RATIO,
} from './constants';

export interface EngineConfig {
  screenWidth: number;
  screenHeight: number;
  playerWidth: number;
  playerHeight: number;
}

function makeGroundDashes(count: number, screenWidth: number, groundY: number): GroundDash[] {
  return Array.from({ length: count }, (_, i) => ({
    x: i * (screenWidth / 10),
    y: groundY + 5,
    w: 20,
  }));
}

function makeClouds(count: number, screenWidth: number): Cloud[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * screenWidth,
    y: 50 + Math.random() * 120,
    w: 55 + Math.random() * 45,
    speed: 0.35 + Math.random() * 0.3,
    opacity: 0.65 + Math.random() * 0.25,
  }));
}

function addParticles(x: number, y: number): Particle[] {
  const colors = ['#ffffff', '#ff4444', '#ffaaaa'];
  return Array.from({ length: 10 }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 7,
    vy: (Math.random() - 0.5) * 7 - 3,
    life: 1,
    size: 2 + Math.random() * 2.5,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

export function createInitialState(cfg: EngineConfig): GameState {
  const groundY = cfg.screenHeight * GROUND_RATIO;
  return {
    phase: 'playing',
    score: 0,
    bestScore: 0,
    elapsedMs: 0,
    speed: BASE_SPEED,
    player: {
      x: PLAYER_X,
      y: groundY - cfg.playerHeight,
      vy: 0,
      isJumping: false,
      frame: 0,
      frameTimer: 0,
    },
    obstacles: [],
    particles: [],
    clouds: makeClouds(5, cfg.screenWidth),
    groundDashes: makeGroundDashes(24, cfg.screenWidth, groundY),
  };
}

export interface UpdateResult {
  state: GameState;
  collision: boolean;
}

export function updateEngine(
  prev: GameState,
  dt: number,
  cfg: EngineConfig,
  pressing: boolean,
  pressStart: number | null,
  distSinceSpawn: number,
  nextSpawnDist: number,
): {
  state: GameState;
  collision: boolean;
  distSinceSpawn: number;
  nextSpawnDist: number;
} {
  const groundY = cfg.screenHeight * GROUND_RATIO;
  const elapsedMs = prev.elapsedMs + dt;
  const speed = getSpeed(elapsedMs, BASE_SPEED);
  const score = prev.score + dt * 0.01;

  // 플레이어 물리
  const player = updatePlayerPosition(
    prev.player,
    groundY,
    cfg.playerHeight,
    pressing,
    pressStart,
    HOLD_MAX,
  );

  // 프레임 애니메이션
  let frameTimer = player.frameTimer + dt;
  let frame = player.frame;
  if (frameTimer > FRAME_INTERVAL_MS) {
    frame = (frame + 1) % RUN_FRAMES;
    frameTimer = 0;
  }
  const animatedPlayer = { ...player, frame, frameTimer };

  // 구름 이동
  const clouds: Cloud[] = prev.clouds.map((c) => ({
    ...c,
    x: c.x - c.speed < -120 ? cfg.screenWidth + 30 : c.x - c.speed,
  }));

  // 장애물 스폰
  let newDistSinceSpawn = distSinceSpawn + speed;
  let newNextSpawnDist = nextSpawnDist;
  let spawnedObs: Obstacle[] = [];
  if (newDistSinceSpawn >= newNextSpawnDist) {
    spawnedObs = spawnObstacle(cfg.screenWidth, groundY, elapsedMs);
    newDistSinceSpawn = 0;
    newNextSpawnDist = getSpawnInterval(elapsedMs);
  }

  // 장애물 이동 + 통과 점수
  let extraScore = 0;
  let newParticles: Particle[] = [];
  const obstacles: Obstacle[] = [
    ...prev.obstacles.map((o) => {
      const moved = { ...o, x: o.x - speed };
      if (!moved.passed && moved.x + moved.width < animatedPlayer.x) {
        extraScore += 5;
        newParticles = [
          ...newParticles,
          ...addParticles(animatedPlayer.x + cfg.playerWidth / 2, animatedPlayer.y + cfg.playerHeight / 2),
        ];
        return { ...moved, passed: true };
      }
      return moved;
    }),
    ...spawnedObs,
  ].filter((o) => o.x > -60);

  // 파티클 업데이트
  const particles: Particle[] = [
    ...prev.particles
      .map((pt) => ({ ...pt, x: pt.x + pt.vx, y: pt.y + pt.vy, vy: pt.vy + 0.18, life: pt.life - 0.032 }))
      .filter((pt) => pt.life > 0),
    ...newParticles,
  ];

  // 지면 대시 이동
  const groundDashes: GroundDash[] = prev.groundDashes.map((d) => ({
    ...d,
    x: d.x - speed < -30 ? d.x - speed + cfg.screenWidth + 30 : d.x - speed,
  }));

  // 충돌 판정
  const collision = obstacles.some((o) =>
    checkCollision(animatedPlayer, cfg.playerWidth, cfg.playerHeight, o),
  );

  return {
    state: {
      ...prev,
      elapsedMs,
      speed,
      score: score + extraScore,
      player: animatedPlayer,
      obstacles,
      particles,
      clouds,
      groundDashes,
    },
    collision,
    distSinceSpawn: newDistSinceSpawn,
    nextSpawnDist: newNextSpawnDist,
  };
}
