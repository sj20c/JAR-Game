import React from 'react';

interface Props {
  score: number;
  bestScore: number;
}

const ScoreHud: React.FC<Props> = ({ score, bestScore }) => (
  <div style={styles.hud}>
    <div style={styles.pill}>
      <span style={styles.label}>점수</span>
      <span style={styles.value}>{score}</span>
    </div>
    <div style={styles.pill}>
      <span style={styles.label}>최고</span>
      <span style={{ ...styles.value, color: '#3182f6' }}>{bestScore}</span>
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  hud: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px 16px',
    zIndex: 5,
    pointerEvents: 'none',
    background: 'linear-gradient(to bottom, rgba(248,249,250,1) 60%, rgba(248,249,250,0))',
  },
  pill: {
    background: '#fff',
    borderRadius: 100,
    padding: '8px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
  },
  label: {
    fontSize: 9,
    fontWeight: 700,
    color: '#b0b8c1',
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  value: {
    fontSize: 20,
    fontWeight: 900,
    color: '#191f28',
    letterSpacing: -1,
    lineHeight: 1.2,
  },
};

export default ScoreHud;
