import { create } from 'zustand';
import { Room } from '@/interfaces/Room';
import { Entry } from '@/interfaces/Entry';

interface ClashManager {
  room: Room | null;

  logs: Entry[];
  setLogs: (logs: Entry[]) => void;
  addLog: (log: Entry) => void;

  setRoom: (room: Room) => void;

  reset: () => void;
}

export const useClashManager = create<ClashManager>((set) => ({
  room: null,

  logs: [],
  setLogs: (logs: Entry[]) => set({ logs }),
  addLog: (log) => set((prev) => ({ ...prev, logs: [...prev.logs, log] })),

  setRoom: (room: Room) => {
    set({ room });
  },


  reset: () => set({ room: null, logs: [] })
}));
