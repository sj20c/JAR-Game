import React from 'react';

interface Props {
  bestScore: number;
  onStart: () => void;
}

const StartScreen: React.FC<Props> = ({ bestScore, onStart }) => (
  <div style={styles.container}>
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
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 30px',
    background: '#f8f9fa',
    zIndex: 10,
  },
  title: {
    fontSize: 72,
    fontWeight: 900,
    color: '#191f28',
    lineHeight: 1,
    marginBottom: 8,
    letterSpacing: -3,
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
};

export default StartScreen;
