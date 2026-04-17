import React from 'react';

interface Props {
  bestScore: number;
  onStart: () => void;
}

const StartScreen: React.FC<Props> = ({ bestScore, onStart }) => (
  <div style={styles.container}>
    <div style={styles.cloudOne} />
    <div style={styles.cloudTwo} />
    <div style={styles.cloudThree} />
    <div style={styles.mountains} />
    <div style={styles.ground} />
    <div style={styles.content}>
      <img src="/JAR_logo.png" alt="JAR" style={styles.logo} />
      <div style={styles.title}>JAR</div>
      <div style={styles.subtitle}>장애물을 피해 최고 기록을 세워보세요</div>
      <div style={styles.scoreCard}>
        <div style={styles.scoreLabel}>최고 기록</div>
        <div style={styles.scoreValue}>{bestScore}</div>
      </div>
      <button style={styles.btn} onPointerDown={(e) => { e.stopPropagation(); onStart(); }}>
        시작하기
      </button>
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #ddeeff 0%, #f8f9fa 72%, #e4eefe 72%, #d8e6fd 100%)',
    zIndex: 10,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 30px',
  },
  title: {
    fontSize: 58,
    fontWeight: 900,
    color: '#191f28',
    lineHeight: 1,
    marginBottom: 8,
    letterSpacing: -3,
  },
  logo: {
    width: 128,
    height: 128,
    objectFit: 'contain',
    imageRendering: 'pixelated',
    marginBottom: 18,
  },
  subtitle: {
    fontSize: 15,
    color: '#8b95a1',
    fontWeight: 500,
    marginBottom: 52,
  },
  scoreCard: {
    background: '#fff',
    borderRadius: 20,
    padding: '24px 40px',
    textAlign: 'center',
    marginBottom: 40,
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    width: '100%',
    maxWidth: 280,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#8b95a1',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 44,
    fontWeight: 900,
    color: '#3182f6',
    letterSpacing: -2,
    lineHeight: 1,
  },
  btn: {
    backgroundColor: '#3182f6',
    color: '#fff',
    border: 'none',
    padding: '18px 0',
    width: '100%',
    maxWidth: 280,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    borderRadius: 14,
    fontFamily: 'inherit',
  },
  cloudOne: {
    position: 'absolute',
    top: '12%',
    left: '8%',
    width: 108,
    height: 34,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.82)',
    boxShadow: '34px 8px 0 -6px rgba(255,255,255,0.82), -28px 10px 0 -8px rgba(255,255,255,0.82)',
  },
  cloudTwo: {
    position: 'absolute',
    top: '24%',
    right: '7%',
    width: 92,
    height: 28,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.62)',
    boxShadow: '26px 6px 0 -7px rgba(255,255,255,0.62), -22px 8px 0 -8px rgba(255,255,255,0.62)',
  },
  cloudThree: {
    position: 'absolute',
    top: '47%',
    left: '14%',
    width: 74,
    height: 22,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.5)',
    boxShadow: '21px 5px 0 -6px rgba(255,255,255,0.5), -18px 7px 0 -7px rgba(255,255,255,0.5)',
  },
  mountains: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '28%',
    height: 118,
    background: 'rgba(195,215,240,0.35)',
    clipPath: 'polygon(0 100%, 0 68%, 14% 22%, 31% 55%, 47% 4%, 65% 42%, 82% 18%, 100% 56%, 100% 100%)',
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '28%',
    background: 'linear-gradient(to bottom, #e4eefe 0%, #d8e6fd 100%)',
    borderTop: '1.5px solid #bdd0f0',
  },
};

export default StartScreen;
