export const GRAVITY = 0.65;
export const JUMP_VY_MIN = -9.6;
export const HOLD_MAX = 300;       // ms — 길게 누르기 최대 시간
export const JUMP_CUT = 0.45;      // 버튼 뗄 때 상승 감쇠
export const BASE_SPEED = 5.5;
export const PLAYER_X = 80;
export const SPRITE_SCALE = 0.29;  // 원본 ~173px → 게임 내 ~50px

// 달리기 5프레임 / 점프 상승 인덱스 5 / 점프 하강 인덱스 6
export const RUN_FRAMES = 5;
export const JUMP_UP_FRAME = 5;
export const JUMP_DOWN_FRAME = 6;

export const FRAME_INTERVAL_MS = 100; // 달리기 프레임 교체 간격

export const GROUND_RATIO = 0.72;     // 지면 y = H * GROUND_RATIO
