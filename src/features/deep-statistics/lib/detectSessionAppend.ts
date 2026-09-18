import { Cube } from '@/entities/cube/model/types'
import { Solve } from '@/entities/solve/model/types'

export type SessionAppend = { cubeId: string; solves: Solve[] }

export function detectSessionAppend(
  previousCubes: Cube[] | null,
  previousSelected: Cube | null,
  cubes: Cube[] | null,
  selected: Cube | null
): SessionAppend | null {
  if (!previousCubes || !previousSelected || !cubes || !selected) return null
  if (previousSelected.id !== selected.id || cubes.length !== previousCubes.length) return null

  let changed = -1
  for (let i = 0; i < cubes.length; i++) {
    if (cubes[i] === previousCubes[i]) continue
    if (changed !== -1 || cubes[i].id !== selected.id || previousCubes[i].id !== selected.id) return null
    changed = i
  }
  if (changed === -1) return null

  const before = previousCubes[changed]
  const after = cubes[changed]
  if (after !== selected || before.name !== after.name || before.category !== after.category) return null

  const allBefore = before.solves.all
  const allAfter = after.solves.all
  if (allBefore.length !== allAfter.length) return null
  for (let i = 0; i < allAfter.length; i++) if (allAfter[i] !== allBefore[i]) return null

  const sessionBefore = before.solves.session
  const sessionAfter = after.solves.session
  const added = sessionAfter.length - sessionBefore.length
  if (added <= 0) return null
  for (let i = 0; i < sessionBefore.length; i++) if (sessionAfter[added + i] !== sessionBefore[i]) return null

  return { cubeId: after.id, solves: sessionAfter.slice(0, added) }
}
