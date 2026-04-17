import { useState, useCallback } from 'react';
import { loadBestScore, saveBestScore } from '../lib/storage';

export function useBestScore() {
  const [bestScore, setBestScore] = useState<number>(() => loadBestScore());

  const updateBestScore = useCallback((score: number): boolean => {
    if (score > bestScore) {
      setBestScore(score);
      saveBestScore(score);
      return true;
    }
    return false;
  }, [bestScore]);

  return { bestScore, updateBestScore };
}
