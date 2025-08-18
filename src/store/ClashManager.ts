import { create } from 'zustand';
import { Room } from '@/interfaces/Room';
import { RoomMessage } from '@/interfaces/RoomMessage';

interface ClashManager {
  room: Room | null;
  messages: RoomMessage[]

  setRoom: (room: Room) => void;
  setMessages: (messages: RoomMessage[]) => void;
}

export const useClashManager = create<ClashManager>((set) => ({
  room: null,
  messages: [],

  setRoom: (room: Room) => {set({ room });},
  setMessages: (messages: RoomMessage[]) => set({ messages: messages })
}));
