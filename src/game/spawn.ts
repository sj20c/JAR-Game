import { Obstacle } from './types';

const OBSTACLE_TYPES = [
  { w: 18, h: 30 },
  { w: 22, h: 46 },
  { w: 16, h: 22 },
] as const;

export function getSpawnInterval(elapsedMs: number): number {
  if (elapsedMs < 10_000) return 170 + Math.random() * 80;
  if (elapsedMs < 25_000) return 130 + Math.random() * 70;
  return 85 + Math.random() * 65;
}

export function getSpeed(elapsedMs: number, baseSpeed: number): number {
  if (elapsedMs < 10_000) return baseSpeed;
  if (elapsedMs < 25_000) return baseSpeed + ((elapsedMs - 10_000) / 15_000) * 3;
  return baseSpeed + 3 + ((elapsedMs - 25_000) / 20_000) * 4;
}

export function spawnObstacle(screenWidth: number, groundY: number, elapsedMs: number): Obstacle[] {
  const t = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
  const results: Obstacle[] = [
    {
      id: Date.now(),
      x: screenWidth + 20,
      y: groundY - t.h,
      width: t.w,
      height: t.h,
      passed: false,
    },
  ];

  // 25초 이후 30% 확률로 연속 장애물
  if (elapsedMs > 25_000 && Math.random() < 0.3) {
    const t2 = OBSTACLE_TYPES[0];
    results.push({
      id: Date.now() + 1,
      x: screenWidth + 20 + t.w + 28,
      y: groundY - t2.h,
      width: t2.w,
      height: t2.h,
      passed: false,
    });
  }

  return results;
}
