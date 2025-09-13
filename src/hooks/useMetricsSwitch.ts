import {
  defaultChartAoValues,
  defaultChartValuesA,
  defaultChartValuesN,
  defaultChartValuesS,
} from '@/lib/const/defaultChartValues';
import { useTimerStore } from '@/store/timerStore';
import { useEffect, useState } from 'react';

export default function useMetricsSwitch() {
  const selectedCube = useTimerStore(store => store.selectedCube);
  const cubes = useTimerStore(store => store.cubes);
  const [isLoading, setIsLoading] = useState(true);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [stats, setStats] = useState({
    average: defaultChartValuesN,
    timeSpent: defaultChartValuesS,
    counter: defaultChartValuesN,
    stats: defaultChartAoValues,
    deviation: defaultChartValuesN,
    successRate: defaultChartValuesS,
    best: defaultChartValuesN,
    data: defaultChartValuesA,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const w = new Worker(
      new URL('../worker/deep-statistics.worker.ts', import.meta.url),
      { type: 'module' }
    );

    setWorker(w);

    w.onmessage = (e: MessageEvent) => {
      setStats(e.data.result);
      setIsLoading(false);
    };

    w.onerror = (err) => {
      console.error('Worker error:', err);
    };

    w.postMessage({
      command: 'start',
      data: {
        cubes: cubes || [],
        selectedCube: selectedCube || null
      }
    })

    return () => {
      w.terminate();
    };
  }, []);

  useEffect(() => {
    if (!worker) return;
    if (!cubes || !selectedCube) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    worker.postMessage({
      command: 'start', data: {
        cubes: cubes || [],
        selectedCube: selectedCube || null
      }
    });
  }, [cubes, selectedCube, worker]);

  return {
    stats,
    isLoading
  };
}
