import { mergeAndUniqData } from '@/shared/model/backup/mergeAndUniqData'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

describe('mergeAndUniqData', () => {
  describe('empty and disjoint inputs', () => {
    it('returns an empty array when both inputs are empty', async () => {
      expect(await mergeAndUniqData([], [])).toEqual([])
    })

    it('keeps a cube that only exists in the backup', async () => {
      const result = await mergeAndUniqData([makeCube({ id: 'a', updatedAt: 100 })], [])
      expect(result.map((c) => c.id)).toEqual(['a'])
    })

    it('keeps a cube that only exists locally', async () => {
      const result = await mergeAndUniqData([], [makeCube({ id: 'b', updatedAt: 100 })])
      expect(result.map((c) => c.id)).toEqual(['b'])
    })

    it('keeps both cubes when their ids do not overlap', async () => {
      const result = await mergeAndUniqData(
        [makeCube({ id: 'a', updatedAt: 100 })],
        [makeCube({ id: 'b', updatedAt: 100 })]
      )
      expect(result.map((c) => c.id).sort()).toEqual(['a', 'b'])
    })
  })

  describe('conflict resolution by updatedAt', () => {
    it('keeps the local cube metadata when it has the newer updatedAt', async () => {
      const backup = [makeCube({ id: 'a', name: 'Backup', updatedAt: 100 })]
      const local = [makeCube({ id: 'a', name: 'Local', updatedAt: 200 })]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.name).toBe('Local')
      expect(result.updatedAt).toBe(200)
    })

    it('keeps the backup cube metadata when it has the newer updatedAt', async () => {
      const backup = [makeCube({ id: 'a', name: 'Backup', updatedAt: 200 })]
      const local = [makeCube({ id: 'a', name: 'Local', updatedAt: 100 })]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.name).toBe('Backup')
      expect(result.updatedAt).toBe(200)
    })

    it('collapses a duplicated cube id into a single entry', async () => {
      const backup = [makeCube({ id: 'a', updatedAt: 100 })]
      const local = [makeCube({ id: 'a', updatedAt: 200 })]
      const result = await mergeAndUniqData(backup, local)
      expect(result).toHaveLength(1)
    })

    it('treats a missing updatedAt as 0 (the version with a real timestamp wins)', async () => {
      const backup = [makeCube({ id: 'a', name: 'Backup' })] // no updatedAt -> 0
      const local = [makeCube({ id: 'a', name: 'Local', updatedAt: 1 })]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.name).toBe('Local')
    })

    it('lets the most recently updated version win even when it is the deleted one', async () => {
      const backup = [makeCube({ id: 'a', name: 'Backup', updatedAt: 200, isDeleted: true })]
      const local = [makeCube({ id: 'a', name: 'Local', updatedAt: 100, isDeleted: false })]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.name).toBe('Backup')
      expect(result.isDeleted).toBe(true)
    })
  })

  describe('tie on updatedAt falls back to delete status', () => {
    it('prefers the non-deleted version when only the backup is deleted', async () => {
      const backup = [makeCube({ id: 'a', name: 'Backup', updatedAt: 100, isDeleted: true })]
      const local = [makeCube({ id: 'a', name: 'Local', updatedAt: 100, isDeleted: false })]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.name).toBe('Local')
      expect(result.isDeleted).toBe(false)
    })

    it('prefers the non-deleted version when only the local is deleted', async () => {
      const backup = [makeCube({ id: 'a', name: 'Backup', updatedAt: 100, isDeleted: false })]
      const local = [makeCube({ id: 'a', name: 'Local', updatedAt: 100, isDeleted: true })]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.name).toBe('Backup')
      expect(result.isDeleted).toBe(false)
    })

    it('keeps the result deleted when both versions are deleted', async () => {
      const backup = [makeCube({ id: 'a', name: 'Backup', updatedAt: 100, isDeleted: true })]
      const local = [makeCube({ id: 'a', name: 'Local', updatedAt: 100, isDeleted: true })]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.isDeleted).toBe(true)
    })

    it('falls back to the local version when both share the same (non-deleted) status', async () => {
      const backup = [makeCube({ id: 'a', name: 'Backup', updatedAt: 100, isDeleted: false })]
      const local = [makeCube({ id: 'a', name: 'Local', updatedAt: 100, isDeleted: false })]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.name).toBe('Local')
    })
  })

  describe('solves are unioned across both versions', () => {
    it('combines distinct solves from backup and local into one cube', async () => {
      const backup = [makeCube({ id: 'a', updatedAt: 100, allSolves: [makeSolve({ id: 's1', startTime: 10 })] })]
      const local = [makeCube({ id: 'a', updatedAt: 200, allSolves: [makeSolve({ id: 's2', startTime: 20 })] })]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.solves.all.map((s) => s.id).sort()).toEqual(['s1', 's2'])
    })

    it('deduplicates a solve present in both versions, keeping the newer updatedAt', async () => {
      const backup = [
        makeCube({
          id: 'a',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 's1', time: 1000, startTime: 10, updatedAt: 50 })]
        })
      ]
      const local = [
        makeCube({
          id: 'a',
          updatedAt: 200,
          allSolves: [makeSolve({ id: 's1', time: 9999, startTime: 10, updatedAt: 80 })]
        })
      ]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.solves.all).toHaveLength(1)
      expect(result.solves.all[0].time).toBe(9999)
    })

    it('sorts the merged solves by startTime ascending', async () => {
      const backup = [makeCube({ id: 'a', updatedAt: 200, allSolves: [makeSolve({ id: 's-late', startTime: 300 })] })]
      const local = [
        makeCube({
          id: 'a',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 's-early', startTime: 100 }), makeSolve({ id: 's-mid', startTime: 200 })]
        })
      ]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.solves.all.map((s) => s.startTime)).toEqual([100, 200, 300])
    })

    it('merges the session and all buckets independently', async () => {
      const backup = [
        makeCube({
          id: 'a',
          updatedAt: 100,
          sessionSolves: [makeSolve({ id: 'sess1', startTime: 10 })],
          allSolves: [makeSolve({ id: 'all1', startTime: 10 })]
        })
      ]
      const local = [
        makeCube({
          id: 'a',
          updatedAt: 200,
          sessionSolves: [makeSolve({ id: 'sess2', startTime: 20 })],
          allSolves: [makeSolve({ id: 'all2', startTime: 20 })]
        })
      ]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.solves.session.map((s) => s.id).sort()).toEqual(['sess1', 'sess2'])
      expect(result.solves.all.map((s) => s.id).sort()).toEqual(['all1', 'all2'])
    })

    it('takes the cube metadata from the winner but still keeps the loser solves', async () => {
      const backup = [
        makeCube({
          id: 'a',
          name: 'Backup',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'from-backup', startTime: 1 })]
        })
      ]
      const local = [
        makeCube({ id: 'a', name: 'Local', updatedAt: 200, allSolves: [makeSolve({ id: 'from-local', startTime: 2 })] })
      ]
      const [result] = await mergeAndUniqData(backup, local)
      expect(result.name).toBe('Local')
      expect(result.solves.all.map((s) => s.id).sort()).toEqual(['from-backup', 'from-local'])
    })
  })

  describe('multiple cubes in one pass', () => {
    it('merges overlapping cubes while preserving the unique ones', async () => {
      const backup = [
        makeCube({
          id: 'shared',
          name: 'Backup shared',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'b1', startTime: 1 })]
        }),
        makeCube({ id: 'backup-only', name: 'Backup only', updatedAt: 100 })
      ]
      const local = [
        makeCube({
          id: 'shared',
          name: 'Local shared',
          updatedAt: 200,
          allSolves: [makeSolve({ id: 'l1', startTime: 2 })]
        }),
        makeCube({ id: 'local-only', name: 'Local only', updatedAt: 100 })
      ]
      const result = await mergeAndUniqData(backup, local)
      const byId = Object.fromEntries(result.map((c) => [c.id, c]))
      expect(Object.keys(byId).sort()).toEqual(['backup-only', 'local-only', 'shared'])
      expect(byId.shared.name).toBe('Local shared')
      expect(byId.shared.solves.all.map((s) => s.id).sort()).toEqual(['b1', 'l1'])
    })
  })

  describe('purity', () => {
    it('does not mutate the input cubes', async () => {
      const backupCube = makeCube({ id: 'a', updatedAt: 100, allSolves: [makeSolve({ id: 's1', startTime: 1 })] })
      const localCube = makeCube({ id: 'a', updatedAt: 200, allSolves: [makeSolve({ id: 's2', startTime: 2 })] })
      await mergeAndUniqData([backupCube], [localCube])
      expect(backupCube.solves.all.map((s) => s.id)).toEqual(['s1'])
      expect(localCube.solves.all.map((s) => s.id)).toEqual(['s2'])
    })
  })

  // A solve id can live in more than one cube after a transfer between cubes. The
  // merge must keep a single live copy (the most recently updated one) and mark
  // every other instance isDeleted:true, whether it sits in session or all.
  describe('cross-cube reconciliation of a solve id (transferred solves)', () => {
    const instancesOf = (cubes: Awaited<ReturnType<typeof mergeAndUniqData>>, solveId: string) => {
      const out: Array<{ cubeId: string; bucket: 'session' | 'all'; isDeleted: boolean }> = []
      for (const cube of cubes) {
        for (const s of cube.solves.session)
          if (s.id === solveId) out.push({ cubeId: cube.id, bucket: 'session', isDeleted: !!s.isDeleted })
        for (const s of cube.solves.all)
          if (s.id === solveId) out.push({ cubeId: cube.id, bucket: 'all', isDeleted: !!s.isDeleted })
      }
      return out
    }
    const live = (instances: ReturnType<typeof instancesOf>) => instances.filter((i) => !i.isDeleted)

    it('keeps a single live copy in the destination cube after a transfer A -> B', async () => {
      const backup = [
        makeCube({
          id: 'A',
          updatedAt: 100,
          sessionSolves: [makeSolve({ id: 'x', cubeId: 'A', isDeleted: false, updatedAt: 50, startTime: 1 })]
        })
      ]
      const local = [
        makeCube({
          id: 'A',
          updatedAt: 200,
          sessionSolves: [makeSolve({ id: 'x', cubeId: 'A', isDeleted: true, updatedAt: 200, startTime: 1 })]
        }),
        makeCube({
          id: 'B',
          updatedAt: 200,
          sessionSolves: [makeSolve({ id: 'x', cubeId: 'B', isDeleted: false, updatedAt: 201, startTime: 1 })]
        })
      ]
      const result = await mergeAndUniqData(backup, local)
      const liveOnes = live(instancesOf(result, 'x'))
      expect(liveOnes).toHaveLength(1)
      expect(liveOnes[0].cubeId).toBe('B')
    })

    it('keeps the most recently updated copy live when the same id is live in two cubes', async () => {
      const backup = [
        makeCube({
          id: 'A',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', isDeleted: false, updatedAt: 100, startTime: 1 })]
        })
      ]
      const local = [
        makeCube({
          id: 'B',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', isDeleted: false, updatedAt: 200, startTime: 1 })]
        })
      ]
      const result = await mergeAndUniqData(backup, local)
      const liveOnes = live(instancesOf(result, 'x'))
      expect(liveOnes).toHaveLength(1)
      expect(liveOnes[0].cubeId).toBe('B')
    })

    it('marks the losing instance deleted even when it lives in the session bucket', async () => {
      const backup = [
        makeCube({
          id: 'A',
          updatedAt: 100,
          sessionSolves: [makeSolve({ id: 'x', isDeleted: false, updatedAt: 100, startTime: 1 })]
        })
      ]
      const local = [
        makeCube({
          id: 'B',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', isDeleted: false, updatedAt: 200, startTime: 1 })]
        })
      ]
      const result = await mergeAndUniqData(backup, local)
      const loser = instancesOf(result, 'x').find((i) => i.cubeId === 'A')
      expect(loser).toMatchObject({ bucket: 'session', isDeleted: true })
    })

    it('marks the losing instance deleted even when it lives in the all bucket', async () => {
      const backup = [
        makeCube({
          id: 'A',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', isDeleted: false, updatedAt: 100, startTime: 1 })]
        })
      ]
      const local = [
        makeCube({
          id: 'B',
          updatedAt: 100,
          sessionSolves: [makeSolve({ id: 'x', isDeleted: false, updatedAt: 200, startTime: 1 })]
        })
      ]
      const result = await mergeAndUniqData(backup, local)
      const loser = instancesOf(result, 'x').find((i) => i.cubeId === 'A')
      expect(loser).toMatchObject({ bucket: 'all', isDeleted: true })
    })

    it('keeps the non-deleted instance live when updatedAt ties', async () => {
      const backup = [
        makeCube({
          id: 'A',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', isDeleted: true, updatedAt: 100, startTime: 1 })]
        })
      ]
      const local = [
        makeCube({
          id: 'B',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', isDeleted: false, updatedAt: 100, startTime: 1 })]
        })
      ]
      const result = await mergeAndUniqData(backup, local)
      const liveOnes = live(instancesOf(result, 'x'))
      expect(liveOnes).toHaveLength(1)
      expect(liveOnes[0].cubeId).toBe('B')
    })

    it('leaves solve ids that appear in only one cube untouched', async () => {
      const backup = [
        makeCube({
          id: 'A',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', isDeleted: false, updatedAt: 100, startTime: 1 })]
        })
      ]
      const local = [
        makeCube({
          id: 'B',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'y', isDeleted: false, updatedAt: 100, startTime: 1 })]
        })
      ]
      const result = await mergeAndUniqData(backup, local)
      expect(live(instancesOf(result, 'x'))).toHaveLength(1)
      expect(live(instancesOf(result, 'y'))).toHaveLength(1)
    })

    it('preserves the winner data and only flips isDeleted on the loser', async () => {
      const backup = [
        makeCube({
          id: 'A',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', time: 1111, isDeleted: false, updatedAt: 100, startTime: 1 })]
        })
      ]
      const local = [
        makeCube({
          id: 'B',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', time: 2222, isDeleted: false, updatedAt: 200, startTime: 1 })]
        })
      ]
      const result = await mergeAndUniqData(backup, local)
      const winner = result.find((c) => c.id === 'B')!.solves.all.find((s) => s.id === 'x')!
      const loser = result.find((c) => c.id === 'A')!.solves.all.find((s) => s.id === 'x')!
      expect(winner).toMatchObject({ time: 2222, isDeleted: false })
      expect(loser).toMatchObject({ time: 1111, isDeleted: true })
    })

    it('does not mutate the losing input solve', async () => {
      const loserSolve = makeSolve({ id: 'x', isDeleted: false, updatedAt: 100, startTime: 1 })
      const backup = [makeCube({ id: 'A', updatedAt: 100, allSolves: [loserSolve] })]
      const local = [
        makeCube({
          id: 'B',
          updatedAt: 100,
          allSolves: [makeSolve({ id: 'x', isDeleted: false, updatedAt: 200, startTime: 1 })]
        })
      ]
      await mergeAndUniqData(backup, local)
      expect(loserSolve.isDeleted).toBe(false)
    })
  })
})
