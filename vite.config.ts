import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // 스프라이트 base64 데이터가 크므로 청크 경고 임계치 올림
    chunkSizeWarningLimit: 2000,
  },
});
