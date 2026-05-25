import { create } from 'zustand'
import { UserDocument } from '@/entities/user/model/user'

type CompareUsersProps = {
  isOpenOverlay: boolean
  openOverlay: () => void
  closeOverlay: () => void

  users: UserDocument[]
  addUser: (user: UserDocument) => void
  removeUser: (userId: string) => void
}

export const useCompareUsersStore = create<CompareUsersProps>((set) => ({
  isOpenOverlay: false,
  openOverlay: () => set({ isOpenOverlay: true }),
  closeOverlay: () => set({ isOpenOverlay: false }),

  users: [],
  addUser: (user: UserDocument) =>
    set((state) => {
      const exists = state.users.find((u) => u._id === user._id)
      if (exists) {
        return { users: state.users.filter((u) => u._id !== user._id) }
      } else {
        return { users: [...state.users, user] }
      }
    }),
  removeUser: (userId: string) =>
    set((state) => ({
      users: state.users.filter((u) => u._id !== userId)
    }))
}))
