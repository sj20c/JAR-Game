type HapticType = 'collision';

const PATTERNS: Record<HapticType, number[]> = {
  collision: [100, 40, 80],
};

export function vibrate(type: HapticType): void {
  try {
    navigator.vibrate?.(PATTERNS[type]);
  } catch {
    // ignore — not supported
  }
}
