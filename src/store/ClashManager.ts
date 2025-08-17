import { create } from 'zustand';
import { Room } from '@/interfaces/Room';

interface ClashManager {
  room: Room | null;

  setRoom: (room: Room) => void;
}

export const useClashManager = create<ClashManager>((set) => ({
  room: null,

  setRoom: (room: Room) => {
    set({ room });
  },
}));
