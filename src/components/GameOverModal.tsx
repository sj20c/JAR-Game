import React from 'react';

interface Props {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onRestart: () => void;
  onHome: () => void;
}

const GameOverModal: React.FC<Props> = ({ score, bestScore, isNewBest, onRestart, onHome }) => (
  <div style={styles.container}>
    <div style={styles.badge}>게임 종료</div>
    <div style={styles.title}>끝!</div>
    <div style={styles.cards}>
      <div style={styles.card}>
        <div style={styles.cardLabel}>이번 점수</div>
        <div style={{ ...styles.cardValue, color: '#191f28' }}>{score}</div>
      </div>
      <div style={styles.card}>
        <div style={styles.cardLabel}>최고 기록</div>
        <div style={{ ...styles.cardValue, color: '#3182f6' }}>{bestScore}</div>
        {isNewBest && <div style={styles.newBest}>🏆 신기록!</div>}
      </div>
    </div>
    <button style={styles.btn} onPointerDown={(e) => { e.stopPropagation(); onRestart(); }}>
      다시 하기
    </button>
    <button style={styles.homeBtn} onPointerDown={(e) => { e.stopPropagation(); onHome(); }}>
      처음 화면으로
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
  badge: {
    background: '#fff2f0',
    color: '#f04452',
    fontSize: 12,
    fontWeight: 700,
    padding: '6px 16px',
    borderRadius: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 900,
    color: '#191f28',
    letterSpacing: -2,
    marginBottom: 36,
  },
  cards: {
    display: 'flex',
    gap: 16,
    marginBottom: 48,
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '20px 28px',
    textAlign: 'center',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    minWidth: 110,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#8b95a1',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: -2,
    lineHeight: 1,
  },
  newBest: {
    fontSize: 10,
    fontWeight: 700,
    color: '#3182f6',
    marginTop: 6,
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
  homeBtn: {
    marginTop: 14,
    background: 'transparent',
    color: '#aeb7c2',
    border: 'none',
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

export default GameOverModal;
