import { useState, useEffect, useRef } from 'react';
import SPRITE_FRAMES from '../assets/sprites';

export function useSprites(): HTMLImageElement[] {
  const imgsRef = useRef<HTMLImageElement[]>([]);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    let loaded = 0;
    const imgs = SPRITE_FRAMES.map((src) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === SPRITE_FRAMES.length) {
          forceUpdate((n) => n + 1);
        }
      };
      img.src = src;
      return img;
    });
    imgsRef.current = imgs;
  }, []);

  return imgsRef.current;
}
