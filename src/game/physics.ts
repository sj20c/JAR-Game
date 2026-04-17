import { Player } from './types';
import { GRAVITY, JUMP_CUT } from './constants';

export function applyGravity(
  player: Player,
  pressing: boolean,
  pressStart: number | null,
  holdMax: number,
): number {
  if (pressing && player.isJumping && player.vy < 0 && pressStart !== null) {
    const held = Math.min(Date.now() - pressStart, holdMax);
    return GRAVITY * (1 - (held / holdMax) * 0.35);
  }

  if (!pressing && player.vy < 0) {
    // 버튼을 뗀 순간 상승 감쇠
    return 0; // vy 는 caller 에서 *= JUMP_CUT 처리
  }

  return GRAVITY;
}

export function updatePlayerPosition(
  player: Player,
  groundY: number,
  playerHeight: number,
  pressing: boolean,
  pressStart: number | null,
  holdMax: number,
): Player {
  let vy = player.vy;

  if (pressing && player.isJumping && vy < 0 && pressStart !== null) {
    const held = Math.min(Date.now() - pressStart, holdMax);
    vy += GRAVITY * (1 - (held / holdMax) * 0.35);
  } else {
    vy += GRAVITY;
    if (!pressing && vy < 0) {
      vy *= JUMP_CUT;
      if (vy > -0.5) vy = 0;
    }
  }

  let y = player.y + vy;
  let isJumping = player.isJumping;

  if (y >= groundY - playerHeight) {
    y = groundY - playerHeight;
    vy = 0;
    isJumping = false;
  }

  return { ...player, y, vy, isJumping };
}
