import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ClashAuthState {
  authorizedByRoom: Record<string, string>;

  authorize: (roomId: string, password: string) => void;
  revoke: (roomId: string) => void;
}

export const useClashAuth = create<ClashAuthState>()(
  persist(
    (set) => ({
      authorizedByRoom: {},
      authorize: (roomId: string, password: string) =>
        set((state) => ({
          authorizedByRoom: { ...state.authorizedByRoom, [roomId]: password },
        })),
      revoke: (roomId: string) =>
        set((state) => {
          const copy = { ...state.authorizedByRoom };
          delete copy[roomId];
          return { authorizedByRoom: copy };
        }),
    }),
    {
      name: 'clash-room-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ authorizedByRoom: state.authorizedByRoom }),
      version: 1,
    }
  )
);
