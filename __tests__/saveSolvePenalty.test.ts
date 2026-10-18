import { act, renderHook } from '@testing-library/react'
import type { Cube } from '@/entities/cube/model/types'
import { makeCube } from './fixtures/cube'

vi.mock('@/entities/cube/api/indexdb', () => ({
  cubesDB: { update: vi.fn(async (cube: Cube) => cube) }
}))

import { cubesDB } from '@/entities/cube/api/indexdb'
import useSolveData from '@/features/timer/model/useSolveData'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

const savedSolve = () => vi.mocked(cubesDB.update).mock.calls.at(-1)![0].solves.session[0]

describe('saveSolveMainTimer', () => {
  beforeEach(() => {
    vi.mocked(cubesDB.update).mockClear()
    useTimerStore.setState({ selectedCube: makeCube({ id: 'cube' }), scramble: "R U R' U'", solvingTime: 9000 })
  })

  const save = async (penalty?: 'none' | 'plus2' | 'dnf') => {
    const { result } = renderHook(() => useSolveData())
    await act(() => result.current.saveSolveMainTimer(penalty))
    return savedSolve()
  }

  it('saves a clean solve as timed', async () => {
    expect(await save()).toMatchObject({ time: 9000, plus2: false, dnf: false })
  })

  it('adds the inspection +2 to the saved time', async () => {
    expect(await save('plus2')).toMatchObject({ time: 11_000, plus2: true, dnf: false })
  })

  it('saves an inspection DNF with the time the clock read', async () => {
    expect(await save('dnf')).toMatchObject({ time: 9000, plus2: false, dnf: true })
  })
})
