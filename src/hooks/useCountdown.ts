import { useEffect, useMemo, useState } from 'react';

export interface UseCountdownOptions {
  intervalMs?: number;
  clampAtZero?: boolean;
}

export interface UseCountdownResult {
  remainingMs: number | undefined;
  isFinished: boolean;
  mmss: string; // UTC mm:ss
  totalSeconds: number | undefined;
}

/**
 * A small countdown hook.
 * - Pass a future timestamp in milliseconds (Date.now() based).
 * - Returns remainingMs, isFinished, and a formatted mm:ss string using UTC base.
 */
export function useCountdown(targetTimeMs?: number, options: UseCountdownOptions = {}): UseCountdownResult {
  const { intervalMs = 1000, clampAtZero = true } = options;
  const [remainingMs, setRemainingMs] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!targetTimeMs || targetTimeMs <= 0) {
      setRemainingMs(undefined);
      return;
    }

    const tick = () => {
      const now = Date.now();
      let diff = targetTimeMs - now;
      if (clampAtZero) diff = Math.max(0, diff);
      setRemainingMs(diff);
    };

    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [targetTimeMs, intervalMs, clampAtZero]);

  const isFinished = useMemo(() => {
    return typeof remainingMs === 'number' && remainingMs <= 0;
  }, [remainingMs]);

  const totalSeconds = useMemo(() => {
    if (remainingMs === undefined) return undefined;
    return Math.floor(remainingMs / 1000);
  }, [remainingMs]);

  const mmss = useMemo(() => {
    if (remainingMs === undefined) return '--:--';
    const d = new Date(remainingMs);
    return d.toISOString().slice(14, 19);
  }, [remainingMs]);

  return { remainingMs, isFinished, mmss, totalSeconds };
}
