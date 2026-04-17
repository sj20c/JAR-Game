import { GameState } from './types';
import { JUMP_UP_FRAME, JUMP_DOWN_FRAME, RUN_FRAMES, HOLD_MAX, SPRITE_SCALE } from './constants';

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  spriteImgs: HTMLImageElement[],
  screenWidth: number,
  screenHeight: number,
  groundY: number,
  playerWidth: number,
  playerHeight: number,
  pressing: boolean,
  pressStart: number | null,
): void {
  ctx.clearRect(0, 0, screenWidth, screenHeight);
  ctx.imageSmoothingEnabled = false;

  // 하늘 배경
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrad.addColorStop(0, '#ddeeff');
  skyGrad.addColorStop(1, '#f8f9fa');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, screenWidth, groundY);

  // 구름
  for (const c of state.clouds) {
    ctx.fillStyle = `rgba(255,255,255,${c.opacity})`;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x - c.w * 0.38, c.y + 4, c.w * 0.52, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x + c.w * 0.38, c.y + 4, c.w * 0.48, 11, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 산 실루엣
  ctx.fillStyle = 'rgba(195,215,240,0.35)';
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(0, groundY - 30);
  ctx.lineTo(55, groundY - 85);
  ctx.lineTo(120, groundY - 45);
  ctx.lineTo(185, groundY - 105);
  ctx.lineTo(255, groundY - 65);
  ctx.lineTo(320, groundY - 95);
  ctx.lineTo(screenWidth, groundY - 50);
  ctx.lineTo(screenWidth, groundY);
  ctx.closePath();
  ctx.fill();

  // 지면
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, screenHeight);
  groundGrad.addColorStop(0, '#e4eefe');
  groundGrad.addColorStop(1, '#d8e6fd');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, screenWidth, screenHeight - groundY);

  // 지면 선
  ctx.strokeStyle = '#bdd0f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(screenWidth, groundY);
  ctx.stroke();

  // 지면 대시
  ctx.fillStyle = 'rgba(150,180,220,0.45)';
  for (const d of state.groundDashes) {
    ctx.fillRect(d.x, d.y, d.w, 2);
  }

  // 장애물 (대나무)
  for (const obs of state.obstacles) {
    ctx.fillStyle = '#3d5a40';
    ctx.beginPath();
    (ctx as any).roundRect(obs.x, obs.y, obs.width, obs.height, [3, 3, 0, 0]);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let s = obs.height / 3; s < obs.height; s += obs.height / 3) {
      ctx.fillRect(obs.x, obs.y + s - 2, obs.width, 3);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(obs.x + 2, obs.y + 2, 3, obs.height - 4);
    ctx.fillStyle = '#2d4a30';
    ctx.beginPath();
    ctx.moveTo(obs.x + obs.width / 2 - 4, obs.y);
    ctx.lineTo(obs.x + obs.width / 2, obs.y - 8);
    ctx.lineTo(obs.x + obs.width / 2 + 4, obs.y);
    ctx.closePath();
    ctx.fill();
  }

  // 캐릭터 스프라이트
  const p = state.player;
  const isJump = p.isJumping;
  const frameIdx = isJump ? (p.vy < 0 ? JUMP_UP_FRAME : JUMP_DOWN_FRAME) : p.frame % RUN_FRAMES;
  const img = spriteImgs[frameIdx];

  if (img && img.complete && img.naturalWidth) {
    const sw = Math.round(img.naturalWidth * SPRITE_SCALE);
    const sh = Math.round(img.naturalHeight * SPRITE_SCALE);
    // 발 기준 정렬
    const dy = p.y + playerHeight - sh;
    ctx.drawImage(img, Math.round(p.x), Math.round(dy), sw, sh);

    // 점프 그림자
    if (isJump) {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.beginPath();
      ctx.ellipse(p.x + sw / 2, groundY + 4, sw * 0.4, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 속도선
    if (!isJump) {
      ctx.strokeStyle = 'rgba(150,185,230,0.35)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x - 2, p.y + playerHeight * 0.35);
      ctx.lineTo(p.x - 18, p.y + playerHeight * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p.x - 2, p.y + playerHeight * 0.6);
      ctx.lineTo(p.x - 12, p.y + playerHeight * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p.x - 2, p.y + playerHeight * 0.82);
      ctx.lineTo(p.x - 8, p.y + playerHeight * 0.82);
      ctx.stroke();
    }
  } else {
    // 스프라이트 로딩 전 폴백
    ctx.fillStyle = '#222';
    ctx.fillRect(p.x, p.y, playerWidth, playerHeight);
  }

  // 점프 게이지
  if (pressing && p.isJumping && pressStart !== null) {
    const ratio = Math.min(Date.now() - pressStart, HOLD_MAX) / HOLD_MAX;
    const bx = p.x;
    const by = p.y - 16;
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.beginPath();
    (ctx as any).roundRect(bx, by, 36, 5, 3);
    ctx.fill();
    ctx.fillStyle = ratio > 0.7 ? '#ef4444' : '#3182f6';
    ctx.beginPath();
    (ctx as any).roundRect(bx, by, 36 * ratio, 5, 3);
    ctx.fill();
  }

  // 파티클
  for (const pt of state.particles) {
    ctx.globalAlpha = pt.life;
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
