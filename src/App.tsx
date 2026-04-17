import React, { useRef, useState } from 'react';
import StartScreen from './components/StartScreen';
import GameCanvas from './components/GameCanvas';
import ScoreHud from './components/ScoreHud';
import GameOverModal from './components/GameOverModal';
import { useGameState } from './hooks/useGameState';
import { useSprites } from './hooks/useSprites';
import { useBestScore } from './hooks/useBestScore';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spriteImgs = useSprites();
  const { bestScore, updateBestScore } = useBestScore();
  const [isNewBest, setIsNewBest] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const { phase, score, startGame, handlePressDown, handlePressUp } = useGameState(
    canvasRef,
    spriteImgs,
  );

  const handleStart = () => {
    setIsNewBest(false);
    startGame(bestScore);
  };

  // gameover 진입 시 best score 갱신
  const prevPhaseRef = React.useRef(phase);
  React.useEffect(() => {
    if (prevPhaseRef.current === 'playing' && phase === 'gameover') {
      setFinalScore(score);
      const isNew = updateBestScore(score);
      setIsNewBest(isNew);
    }
    prevPhaseRef.current = phase;
  }, [phase, score, updateBestScore]);

  return (
    <div style={styles.root}>
      <GameCanvas
        canvasRef={canvasRef}
        onPressDown={phase === 'playing' ? handlePressDown : () => {}}
        onPressUp={phase === 'playing' ? handlePressUp : () => {}}
      />

      {phase === 'ready' && (
        <StartScreen bestScore={bestScore} onStart={handleStart} />
      )}

      {phase === 'playing' && (
        <ScoreHud score={score} bestScore={bestScore} />
      )}

      {phase === 'gameover' && (
        <>
          <GameOverModal
            score={finalScore}
            bestScore={bestScore}
            isNewBest={isNewBest}
            onRestart={handleStart}
          />
        </>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: '100%',
    maxWidth: 390,
    margin: '0 auto',
    minHeight: '100dvh',
    background: '#f8f9fa',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'none',
  },
};

export default App;
