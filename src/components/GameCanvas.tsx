import React, { useRef, useEffect, useCallback } from 'react';

interface Props {
  onPressDown: () => void;
  onPressUp: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const GameCanvas: React.FC<Props> = ({ onPressDown, onPressUp, canvasRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 컨테이너 크기에 맞게 canvas 리사이즈
  useEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [canvasRef]);

  const handleDown = useCallback(
    (e: React.PointerEvent) => { e.preventDefault(); onPressDown(); },
    [onPressDown],
  );
  const handleUp = useCallback(
    (e: React.PointerEvent) => { e.preventDefault(); onPressUp(); },
    [onPressUp],
  );

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', flex: 1, touchAction: 'none' }}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
    >
      <canvas
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        style={{ display: 'block', width: '100%', height: '100%', imageRendering: 'pixelated' }}
      />
      <div style={styles.hint}>짧게 누르면 낮게 · 길게 누르면 높게 점프</div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  hint: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#c2c8d0',
    pointerEvents: 'none',
  },
};

export default GameCanvas;
