"use server";

import connectDB from "@/db/mongodb";
import type { Solve as ISolve } from '@/interfaces/Solve';
import Solve from '@/models/solve';

export async function sendSolveToServer({ solve, solution, userId }: { solve: Partial<ISolve>, userId?: string, solution?: string | never[] }): Promise<boolean> {
  try {
    await connectDB();

    if (!userId) return true;

    await Solve.create({
      user: userId,
      time: solve.time,
      scramble: solve.scramble,
      solution: solution ? cleanRotations(solution.toString()) : null,
      puzzle: '3x3x3'
    })

    return true;
  } catch (error) {
    return false;
  }
}

function cleanRotations(alg: string): string {
  const moves = alg.trim().split(/\s+/);
  const rotations = new Set(['x', "x'", 'y', "y'", 'z', "z'"]);
  const result = [];

  let seenNormalMove = false;

  for (const move of moves) {
    if (rotations.has(move)) {
      if (seenNormalMove) result.push(move);
    } else {
      result.push(move);
      seenNormalMove = true;
    }
  }

  return result.join(' ');
}
