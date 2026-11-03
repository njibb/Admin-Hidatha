import { useEffect, type RefObject } from "react";

export function useVisibleLoop(
  ref: RefObject<HTMLElement | null>,
  callback: (dt: number) => void,
  { enabled }: { enabled: boolean }
) {
  useEffect(() => {
    if (!enabled || !ref.current) return;

    let frameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      // Batasi dt maksimal 50ms agar animasi tidak loncat jika tab ditinggal lama
      const dt = Math.min(1 / 20, (time - lastTime) / 1000);
      lastTime = time;
      callback(dt);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [enabled, callback, ref]);
}