import { create } from 'zustand';
import { Room } from '@/interfaces/Room';
import { ChatMessageContent } from '@/interfaces/ChatMessageContent';
import { Entry } from '@/interfaces/Entry';

interface ClashManager {
  room: Room | null;
  messages: ChatMessageContent[]

  logs: Entry[];
  setLogs: (logs: Entry[]) => void;
  addLog: (log: Entry) => void;

  setRoom: (room: Room) => void;
  setMessages: (messages: ChatMessageContent[]) => void;

  reset: () => void;
}

export const useClashManager = create<ClashManager>((set) => ({
  room: null,
  messages: [],

  logs: [],
  setLogs: (logs: Entry[]) => set({ logs }),
  addLog: (log) => set((prev) => ({ ...prev, logs: [...prev.logs, log] })),

  setRoom: (room: Room) => {
    set({ room });
  },
  setMessages: (messages: ChatMessageContent[]) => set({ messages: messages }),

  reset: () => set({ room: null, messages: [], logs: [] })
}));
