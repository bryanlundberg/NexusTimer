import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { makeCube } from './fixtures/cube'
import { makeSolve } from './fixtures/solve'

const ids = () => useTimerStore.getState().cubes?.map((cube) => cube.id)

beforeEach(() => {
  useTimerStore.setState({ cubes: null, selectedCube: null })
})

describe('timer store cube patches', () => {
  it('replaces a cube in place and refreshes the selection in one update', () => {
    const a = makeCube({ id: 'a' })
    const b = makeCube({ id: 'b' })
    useTimerStore.setState({ cubes: [a, b], selectedCube: b })
    const updates: unknown[] = []
    const unsubscribe = useTimerStore.subscribe((state) => updates.push(state))

    const next = makeCube({ id: 'b', name: 'Renamed' })
    useTimerStore.getState().patchCube(next)
    unsubscribe()

    expect(updates).toHaveLength(1)
    expect(ids()).toEqual(['a', 'b'])
    expect(useTimerStore.getState().cubes![1].name).toBe('Renamed')
    expect(useTimerStore.getState().selectedCube!.name).toBe('Renamed')
  })

  it('leaves the selection alone when another cube changes', () => {
    const a = makeCube({ id: 'a' })
    useTimerStore.setState({ cubes: [a, makeCube({ id: 'b' })], selectedCube: a })
    useTimerStore.getState().patchCube(makeCube({ id: 'b', name: 'Other' }))
    expect(useTimerStore.getState().selectedCube).toBe(a)
  })

  it('inserts new cubes in id order, as a full reload would list them', () => {
    useTimerStore.setState({ cubes: [makeCube({ id: 'b' }), makeCube({ id: 'd' })] })
    useTimerStore.getState().patchCubes([makeCube({ id: 'c' }), makeCube({ id: 'a' })])
    expect(ids()).toEqual(['a', 'b', 'c', 'd'])
  })

  it('drops deleted solves from what it stores', () => {
    useTimerStore.setState({ cubes: [makeCube({ id: 'a' })] })
    useTimerStore
      .getState()
      .patchCube(makeCube({ id: 'a', sessionSolves: [makeSolve({ id: 'live' }), makeSolve({ isDeleted: true })] }))
    expect(useTimerStore.getState().cubes![0].solves.session.map((solve) => solve.id)).toEqual(['live'])
  })

  it('does not invent a list before the cubes are loaded', () => {
    useTimerStore.getState().patchCube(makeCube({ id: 'a' }))
    expect(useTimerStore.getState().cubes).toBeNull()
  })

  it('removes a cube', () => {
    useTimerStore.setState({ cubes: [makeCube({ id: 'a' }), makeCube({ id: 'b' })] })
    useTimerStore.getState().removeCube('a')
    expect(ids()).toEqual(['b'])
  })
})
