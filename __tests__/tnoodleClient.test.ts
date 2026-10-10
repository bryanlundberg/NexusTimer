import type { PuzzleKey } from '@nexustimer/tnoodle-lib-rs'

type Request = { id: number; puzzle: PuzzleKey }

class FakeWorker {
  static instances: FakeWorker[] = []
  onmessage: ((event: MessageEvent<{ id: number; scramble: string | null }>) => void) | null = null
  onerror: (() => void) | null = null
  requests: Request[] = []
  terminated = false

  constructor() {
    FakeWorker.instances.push(this)
  }

  postMessage(request: Request) {
    this.requests.push(request)
  }

  terminate() {
    this.terminated = true
  }

  reply(index: number, scramble: string | null) {
    const { id } = this.requests[index]
    this.onmessage?.({ data: { id, scramble } } as MessageEvent<{ id: number; scramble: string | null }>)
  }
}

async function loadClient() {
  vi.resetModules()
  FakeWorker.instances = []
  vi.stubGlobal('Worker', FakeWorker)
  return import('@/shared/lib/timer/tnoodleClient')
}

describe('tnoodleClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reuses one worker while scrambles succeed', async () => {
    const { requestScramble } = await loadClient()
    const first = requestScramble('333')
    const second = requestScramble('444')
    const [worker] = FakeWorker.instances
    worker.reply(0, 'R U')
    worker.reply(1, 'Rw U')

    await expect(first).resolves.toBe('R U')
    await expect(second).resolves.toBe('Rw U')
    expect(FakeWorker.instances).toHaveLength(1)
  })

  it('replaces the worker after a failed scramble', async () => {
    const { requestScramble } = await loadClient()
    const failed = requestScramble('fto')
    const queued = requestScramble('333')
    const [broken] = FakeWorker.instances
    broken.reply(0, null)

    await expect(failed).resolves.toBeNull()
    await expect(queued).resolves.toBeNull()
    expect(broken.terminated).toBe(true)

    const retry = requestScramble('fto')
    const [, fresh] = FakeWorker.instances
    fresh.reply(0, 'R L')
    await expect(retry).resolves.toBe('R L')
  })

  it('ignores late messages and errors from a replaced worker', async () => {
    const { requestScramble } = await loadClient()
    requestScramble('fto')
    const [broken] = FakeWorker.instances
    broken.reply(0, null)

    const pending = requestScramble('333')
    const [, fresh] = FakeWorker.instances
    broken.reply(0, null)
    broken.onerror?.()

    expect(fresh.terminated).toBe(false)
    fresh.reply(0, 'U F')
    await expect(pending).resolves.toBe('U F')
  })
})
