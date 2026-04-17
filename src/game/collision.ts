import { Player, Obstacle } from './types';

const COLLISION_MARGIN = 4;

export function checkCollision(
  player: Player,
  playerWidth: number,
  playerHeight: number,
  obstacle: Obstacle,
): boolean {
  const m = COLLISION_MARGIN;
  return (
    player.x + playerWidth - m > obstacle.x + m &&
    player.x + m < obstacle.x + obstacle.width - m &&
    player.y + playerHeight - m > obstacle.y + m &&
    player.y + m < obstacle.y + obstacle.height - m
  );
}
