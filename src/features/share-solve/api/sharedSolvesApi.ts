import type { CubeCategory } from '@/shared/const/cube-categories'
import type { Solve } from '@/entities/solve/model/types'
import type { SolveReplay } from '@/entities/replay/model/types'
import { REPLAY_MAX_MOVES, type ShareSolveInput } from '@/entities/shared-solve/model/types'

export class ShareSolveError extends Error {
  constructor(public status: number) {
    super(`Shared solve request failed (${status})`)
  }
}

function toShareReplay(replay: SolveReplay | undefined): SolveReplay | undefined {
  if (!replay?.moves.length || replay.moves.length > REPLAY_MAX_MOVES) return undefined
  return {
    version: 1,
    puzzle: replay.puzzle,
    scramble: replay.scramble,
    durationMs: Math.round(replay.durationMs),
    moves: replay.moves.map(({ m, t }) => ({ m, t: Math.round(t) }))
  }
}

export function toShareInput(solve: Solve, puzzle: CubeCategory): ShareSolveInput {
  const replay = toShareReplay(solve.replay)
  return {
    localSolveId: solve.id,
    puzzle,
    time: Math.round(solve.time),
    plus2: !!solve.plus2,
    dnf: !!solve.dnf,
    scramble: solve.scramble,
    solvedAt: Math.round(solve.endTime || Date.now()),
    replay
  }
}

async function request(url: string, init: RequestInit) {
  const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...init.headers } })
  if (!res.ok) throw new ShareSolveError(res.status)
  return res.status === 204 ? null : res.json()
}

export async function shareSolve(input: ShareSolveInput): Promise<string> {
  const data = await request('/api/v1/shared-solves', { method: 'POST', body: JSON.stringify(input) })
  return data.slug
}

export async function unshareSolve(slug: string): Promise<void> {
  await request(`/api/v1/shared-solves/${slug}`, { method: 'DELETE' })
}

export const sharedSolveUrl = (slug: string) => `${window.location.origin}/s/${slug}`
