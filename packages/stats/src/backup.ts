import type { Cube, Solve } from './types'

export function normalizeOldData(cubes: Cube[]): Cube[] {
  return cubes.map((cube) => {
    return {
      ...cube,
      isDeleted: cube.isDeleted ?? false,
      updatedAt: cube.updatedAt ?? cube.createdAt,
      solves: {
        session: cube.solves.session.map((solve: Solve) => ({
          ...solve,
          isDeleted: solve.isDeleted ?? false,
          updatedAt: solve.updatedAt ?? solve.startTime
        })),
        all: cube.solves.all.map((solve: Solve) => ({
          ...solve,
          isDeleted: solve.isDeleted ?? false,
          updatedAt: solve.updatedAt ?? solve.startTime
        }))
      }
    }
  })
}

export const preventDuplicateDeleteStatus = (cubes: Cube[]): Cube[] => {
  return cubes.map((cube) => {
    const solveMap = new Map<string, Solve & { _wasInSession?: boolean }>()

    const processSolve = (solve: Solve, fromSession: boolean) => {
      const existing = solveMap.get(solve.id)
      if (!existing || (solve.updatedAt ?? 0) > (existing.updatedAt ?? 0)) {
        solveMap.set(solve.id, { ...solve, _wasInSession: fromSession })
      } else if (existing && (solve.updatedAt ?? 0) === (existing.updatedAt ?? 0)) {
        if (fromSession && !existing._wasInSession) {
          solveMap.set(solve.id, { ...solve, _wasInSession: fromSession })
        }
      }
    }

    cube.solves.session.forEach((s) => processSolve(s, true))
    cube.solves.all.forEach((s) => processSolve(s, false))

    const newSessionSolves: Solve[] = []
    const newAllSolves: Solve[] = []

    solveMap.forEach((solveWithMeta) => {
      const { _wasInSession, ...solve } = solveWithMeta

      if (_wasInSession) {
        newSessionSolves.push(solve)
      } else {
        newAllSolves.push(solve)
      }
    })

    return {
      ...cube,
      solves: {
        session: newSessionSolves,
        all: newAllSolves
      }
    }
  })
}

export function filterCubes(backup?: Cube[] | null): Cube[] {
  const list = backup || []
  return list.filter((cube) => {
    if (cube.isDeleted) return false
    const allSolves = cube.solves.all.filter((solve) => !solve.isDeleted)
    const allSessions = cube.solves.session.filter((solve) => !solve.isDeleted)
    cube.solves.all = allSolves
    cube.solves.session = allSessions
    return true
  })
}

export function prepareBackupCubes(backup: unknown): Cube[] {
  if (!Array.isArray(backup)) throw new Error('Backup is not an array of cubes')
  return filterCubes(preventDuplicateDeleteStatus(normalizeOldData(backup as Cube[])))
}
