'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import genScramble from '@/shared/lib/timer/genScramble'
import {
  LaneStatus,
  VersusCategory,
  VersusPlayer,
  VersusPlayerCount,
  VERSUS_CATEGORIES,
  VERSUS_PLAYER_COUNTS
} from '@/features/versus/model/types'

const PLAYER_COLORS = ['var(--cube-blue)', 'var(--cube-red)', 'var(--cube-green)', 'var(--cube-yellow)']

function pickValid<T>(options: readonly T[], value: unknown, fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback
}

function createPlayers(count: VersusPlayerCount, previous: VersusPlayer[] = []): VersusPlayer[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: previous[index]?.name ?? '',
    color: PLAYER_COLORS[index],
    status: LaneStatus.IDLE,
    timeMs: null,
    history: []
  }))
}

interface VersusState {
  category: VersusCategory
  playerCount: VersusPlayerCount
  scramble: string
  round: number
  players: VersusPlayer[]
  setCategory: (category: VersusCategory) => void
  setPlayerCount: (playerCount: VersusPlayerCount) => void
  setPlayerName: (id: number, name: string) => void
  setLaneStatus: (id: number, status: LaneStatus) => void
  finishLane: (id: number, timeMs: number) => void
  nextRound: () => void
  resetMatch: () => void
}

export const useVersusStore = create<VersusState>()(
  persist(
    (set, get) => ({
      category: '3x3',
      playerCount: 2,
      scramble: '',
      round: 1,
      players: createPlayers(2),
      setCategory: (category: VersusCategory) => {
        if (category === get().category) return
        set({ category })
        get().resetMatch()
      },
      setPlayerCount: (playerCount: VersusPlayerCount) => {
        if (playerCount === get().playerCount) return
        set({ playerCount })
        get().resetMatch()
      },
      setPlayerName: (id: number, name: string) => {
        set((state) => ({
          players: state.players.map((player) => (player.id === id ? { ...player, name } : player))
        }))
      },
      setLaneStatus: (id: number, status: LaneStatus) => {
        set((state) => ({
          players: state.players.map((player) => (player.id === id ? { ...player, status } : player))
        }))
      },
      finishLane: (id: number, timeMs: number) => {
        set((state) => ({
          players: state.players.map((player) =>
            player.id === id ? { ...player, status: LaneStatus.DONE, timeMs } : player
          )
        }))
      },
      nextRound: () => {
        set((state) => ({
          round: state.round + 1,
          scramble: genScramble(state.category),
          players: state.players.map((player) => ({
            ...player,
            status: LaneStatus.IDLE,
            timeMs: null,
            history: player.timeMs === null ? player.history : [...player.history, player.timeMs]
          }))
        }))
      },
      resetMatch: () => {
        set((state) => ({
          round: 1,
          scramble: genScramble(state.category),
          players: createPlayers(state.playerCount, state.players)
        }))
      }
    }),
    {
      name: 'versus-preferences',
      partialize: (state) => ({ category: state.category, playerCount: state.playerCount }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<VersusState>
        const playerCount = pickValid(VERSUS_PLAYER_COUNTS, saved.playerCount, current.playerCount)

        return {
          ...current,
          category: pickValid(VERSUS_CATEGORIES, saved.category, current.category),
          playerCount,
          players: createPlayers(playerCount)
        }
      }
    }
  )
)
