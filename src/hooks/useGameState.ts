import { useState, useRef, useCallback, useEffect } from 'react';
import { Phase, GameState } from '../game/types';
import { createInitialState, updateEngine } from '../game/engine';
import { renderGame } from '../game/renderer';
import { SPRITE_SCALE, GROUND_RATIO, JUMP_VY_MIN } from '../game/constants';
import { vibrate } from '../lib/haptic';

export function useGameState(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  spriteImgs: HTMLImageElement[],
) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [score, setScore] = useState(0);

  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const pressingRef = useRef(false);
  const pressStartRef = useRef<number | null>(null);
  const distRef = useRef(0);
  const nextDistRef = useRef(220);

  // 플레이어 크기 계산 (첫 스프라이트 기준)
  const getPlayerSize = useCallback(() => {
    const img = spriteImgs[0];
    if (img && img.naturalWidth) {
      return {
        w: Math.round(img.naturalWidth * SPRITE_SCALE),
        h: Math.round(img.naturalHeight * SPRITE_SCALE),
      };
    }
    return { w: 50, h: 62 }; // fallback
  }, [spriteImgs]);

  const getCanvasSize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return { w: 390, h: 844 };
    return { w: c.width, h: c.height };
  }, [canvasRef]);

  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !stateRef.current) return;

    const dt = Math.min(timestamp - lastTimeRef.current, 50);
    lastTimeRef.current = timestamp;

    const { w, h } = getCanvasSize();
    const groundY = h * GROUND_RATIO;
    const { w: pw, h: ph } = getPlayerSize();

    const result = updateEngine(
      stateRef.current,
      dt,
      { screenWidth: w, screenHeight: h, playerWidth: pw, playerHeight: ph },
      pressingRef.current,
      pressStartRef.current,
      distRef.current,
      nextDistRef.current,
    );

    stateRef.current = result.state;
    distRef.current = result.distSinceSpawn;
    nextDistRef.current = result.nextSpawnDist;

    // 렌더
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderGame(
        ctx,
        result.state,
        spriteImgs,
        w, h, groundY, pw, ph,
        pressingRef.current,
        pressStartRef.current,
      );
    }

    setScore(Math.floor(result.state.score));

    if (result.collision) {
      vibrate('collision');
      setPhase('gameover');
      return; // 루프 종료
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [canvasRef, spriteImgs, getCanvasSize, getPlayerSize]);

  const startGame = useCallback((currentBest: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { w, h } = getCanvasSize();
    const { w: pw, h: ph } = getPlayerSize();

    const initial = createInitialState({
      screenWidth: w,
      screenHeight: h,
      playerWidth: pw,
      playerHeight: ph,
    });
    initial.bestScore = currentBest;

    stateRef.current = initial;
    distRef.current = 0;
    nextDistRef.current = 220;
    pressingRef.current = false;
    pressStartRef.current = null;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = performance.now();
    setScore(0);
    setPhase('playing');
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [canvasRef, gameLoop, getCanvasSize, getPlayerSize]);

  const handlePressDown = useCallback(() => {
    if (phase !== 'playing') return;
    if (pressingRef.current) return;
    pressingRef.current = true;
    pressStartRef.current = Date.now();

    const s = stateRef.current;
    if (s && !s.player.isJumping) {
      stateRef.current = {
        ...s,
        player: { ...s.player, vy: JUMP_VY_MIN, isJumping: true },
      };
    }
  }, [phase]);

  const handlePressUp = useCallback(() => {
    pressingRef.current = false;
    pressStartRef.current = null;
  }, []);

  const resetToReady = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    stateRef.current = null;
    pressingRef.current = false;
    pressStartRef.current = null;
    setScore(0);
    setPhase('ready');
  }, []);

  // cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    phase,
    score,
    startGame,
    resetToReady,
    handlePressDown,
    handlePressUp,
  };
}
