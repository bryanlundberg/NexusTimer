import { useTimerStore } from "@/store/timerStore";
import { Solve } from "@/interfaces/Solve";
import genId from "@/lib/genId";
import { useNXData } from '@/hooks/useNXData';
import { useSettingsModalStore } from '@/store/SettingsModalStore';
import convertToMs from '@/lib/convertToMs';
import { useState } from 'react';

export default function useSolveData() {
  const { saveCube } = useNXData();
  const solvingTime = useTimerStore(store => store.solvingTime);
  const selectedCube = useTimerStore(store => store.selectedCube);
  const scramble = useTimerStore(store => store.scramble);
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);
  const setLastSolve = useTimerStore(store => store.setLastSolve);
  const setNewScramble = useTimerStore(store => store.setNewScramble);
  const updateSetting = useSettingsModalStore(state => state.updateSetting)
  const solvesSinceLastSync = useSettingsModalStore(state => state.settings.sync.totalSolves)
  const [value, setValue] = useState<string>("");

  const saveSolveMainTimer = async () => {
    if (selectedCube && scramble) {
      const lastSolve: Solve = {
        id: genId(),
        startTime: Date.now() - solvingTime,
        endTime: Date.now(),
        scramble: scramble,
        bookmark: false,
        time: solvingTime,
        dnf: false,
        plus2: false,
        rating: Math.floor(Math.random() * 20) + scramble.length,
        cubeId: selectedCube.id,
        comment: "",
        isDeleted: false,
        updatedAt: Date.now(),
      };

      setLastSolve({ ...lastSolve });

      const updatedCube = {
        ...selectedCube,
        solves: {
          ...selectedCube.solves,
          session: [lastSolve, ...selectedCube.solves.session],
        },
      }

      saveCube(updatedCube);
      setSelectedCube(updatedCube);
      updateSetting('sync.totalSolves', 1 + solvesSinceLastSync)
    }

    setNewScramble(selectedCube);
  };

  const saveSolveManualMode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCube) return;
    if (!scramble) return;
    if (parseInt(value) === 0 || value === "") return;

    const msTime = convertToMs(value);
    const now = Date.now();

    const newSolve: Solve = {
      id: genId(),
      startTime: now - msTime,
      endTime: Date.now(),
      scramble: scramble,
      bookmark: false,
      time: msTime,
      dnf: false,
      plus2: false,
      rating: Math.floor(Math.random() * 20) + scramble.length,
      cubeId: selectedCube.id,
      comment: "",
      updatedAt: now,
      isDeleted: false,
    };

    const updatedCube = {
      ...selectedCube,
      solves: {
        ...selectedCube.solves,
        session: [newSolve, ...selectedCube.solves.session],
      },
    }

    saveCube(updatedCube);
    setSelectedCube(updatedCube);
    setLastSolve({ ...newSolve });
    setNewScramble(selectedCube);
    setValue("");
    updateSetting('sync.totalSolves', 1 + solvesSinceLastSync)
  }

  return {
    saveSolveMainTimer,
    value,
    setValue,
    saveSolveManualMode
  };
}
