import type { PuzzleKey } from '@nexustimer/tnoodle-lib-rs'
import { createScramblePool } from '@/shared/lib/timer/scramblePool'

function fakeWorker() {
  const calls: { puzzle: PuzzleKey; resolve: (scramble: string | null) => void }[] = []
  const request = vi.fn(
    (puzzle: PuzzleKey) =>
      new Promise<string | null>((resolve) => {
        calls.push({ puzzle, resolve })
      })
  )
  const answer = async (scramble: string | null) => {
    calls.shift()?.resolve(scramble)
    await Promise.resolve()
    await Promise.resolve()
  }
  return { calls, request, answer }
}

describe('scramblePool', () => {
  it('returns null on a cold category and fills the pool in the background', () => {
    const worker = fakeWorker()
    const pool = createScramblePool(worker.request)

    expect(pool.takeScramble('4x4')).toBeNull()
    expect(worker.calls.map((call) => call.puzzle)).toEqual(['444', '444'])
  })

  it('hands out ready scrambles synchronously and asks for a replacement', async () => {
    const worker = fakeWorker()
    const pool = createScramblePool(worker.request)
    pool.takeScramble('3x3')
    await worker.answer('R U')
    await worker.answer('F D')

    expect(pool.takeScramble('3x3')).toBe('R U')
    expect(worker.request).toHaveBeenCalledTimes(3)
    expect(pool.takeScramble('3x3')).toBe('F D')
    expect(worker.request).toHaveBeenCalledTimes(4)
  })

  it('shares one queue between categories of the same puzzle', async () => {
    const worker = fakeWorker()
    const pool = createScramblePool(worker.request)
    pool.takeScramble('3x3 OH')
    await worker.answer('L B')

    expect(pool.takeScramble('3x3 Virtual')).toBe('L B')
    expect(worker.calls.every((call) => call.puzzle === '333')).toBe(true)
  })

  it('notifies listeners when a scramble arrives until they unsubscribe', async () => {
    const worker = fakeWorker()
    const pool = createScramblePool(worker.request)
    const listener = vi.fn()
    const unsubscribe = pool.onScrambleReady(listener)
    pool.takeScramble('FTO')

    await worker.answer('R L')
    expect(listener).toHaveBeenCalledWith('fto')

    unsubscribe()
    await worker.answer('B U')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('drops failed requests and retries on the next take', async () => {
    const worker = fakeWorker()
    const pool = createScramblePool(worker.request, 1)
    const listener = vi.fn()
    pool.onScrambleReady(listener)
    pool.takeScramble('SQ1')

    await worker.answer(null)
    expect(listener).not.toHaveBeenCalled()

    expect(pool.takeScramble('SQ1')).toBeNull()
    expect(worker.request).toHaveBeenCalledTimes(2)
  })
})
