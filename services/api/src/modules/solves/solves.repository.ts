import type { LeaderboardPuzzle, SolveReplayPayload } from '@nexustimer/contracts'
import type { Types } from 'mongoose'
import { userDocuments } from '../../infra/user-documents'
import { SolveModel } from './solves.model'

export type StoredSolve = {
  id: string
  userId: string
  time: number
  scramble: string
  solution?: string | null
  puzzle: LeaderboardPuzzle
  smart: boolean
  replay?: SolveReplayPayload | null
  createdAt: Date
  updatedAt: Date
}

export type SolveFilter = { puzzle?: LeaderboardPuzzle; smart?: boolean }

export type NewSolve = {
  userId: string
  time: number
  scramble: string
  solution: string | null
  puzzle: LeaderboardPuzzle
  smart: boolean
  replay: SolveReplayPayload | null
}

export type SolvesRepository = {
  fastest(filter: SolveFilter, limit: number): Promise<StoredSolve[]>
  fastestPerUser(filter: SolveFilter, limit: number): Promise<StoredSolve[]>
  insert(solve: NewSolve): Promise<void>
}

type RawSolve = {
  _id: Types.ObjectId
  user: Types.ObjectId
  time: number
  scramble: string
  solution?: string | null
  puzzle: LeaderboardPuzzle
  smart?: boolean | null
  replay?: SolveReplayPayload | null
  createdAt: Date
  updatedAt: Date
}

const FASTEST_FIRST = { time: 1, createdAt: 1 } as const

function toStoredSolve(doc: RawSolve): StoredSolve {
  return {
    id: String(doc._id),
    userId: String(doc.user),
    time: doc.time,
    scramble: doc.scramble,
    ...(doc.solution !== undefined ? { solution: doc.solution } : {}),
    puzzle: doc.puzzle,
    smart: doc.smart ?? false,
    ...(doc.replay !== undefined ? { replay: doc.replay } : {}),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }
}

export const solvesRepository: SolvesRepository = {
  async fastest(filter, limit) {
    const docs = await SolveModel.find(filter).sort(FASTEST_FIRST).limit(limit).lean<RawSolve[]>()
    return docs.map(toStoredSolve)
  },
  async fastestPerUser(filter, limit) {
    const docs = await SolveModel.aggregate<RawSolve>([
      { $match: filter },
      { $sort: FASTEST_FIRST },
      { $group: { _id: '$user', solve: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$solve' } },
      { $sort: FASTEST_FIRST },
      { $limit: limit }
    ])
    return docs.map(toStoredSolve)
  },
  async insert({ userId, ...solve }) {
    await SolveModel.create({ user: userId, ...solve })
  }
}

export const solvesUserData = userDocuments(SolveModel, ({ id }) => ({ user: id }))
