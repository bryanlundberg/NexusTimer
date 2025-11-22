'use server'

import connectDB from '@/shared/config/mongodb/mongodb'
import type { Solve as ISolve } from '@/entities/solve/model/types'
import Solve from '@/models/solve'

interface SendSolveToServerParams {
  solve: Partial<ISolve>
  userId?: string
  solution?: string | never[]
  puzzle?: string
  smart?: boolean
}

export async function sendSolveToServer({
  solve,
  solution,
  userId,
  puzzle,
  smart = false
}: SendSolveToServerParams): Promise<boolean> {
  try {
    await connectDB()

    if (!userId) return true

    await Solve.create({
      user: userId,
      time: solve.time,
      scramble: solve.scramble,
      solution: solution ? cleanRotations(solution.toString()) : null,
      puzzle: puzzle,
      smart
    })

    return true
  } catch (error) {
    return false
  }
}

function cleanRotations(alg: string): string {
  const moves = alg.trim().split(/\s+/)
  const rotations = new Set(['x', "x'", 'y', "y'", 'z', "z'"])
  const result = []

  let seenNormalMove = false

  for (const move of moves) {
    if (rotations.has(move)) {
      if (seenNormalMove) result.push(move)
    } else {
      result.push(move)
      seenNormalMove = true
    }
  }

  return result.join(' ')
}
