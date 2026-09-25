import {
  CHUNK_RECOVERY_BATCH_MS,
  CHUNK_RECOVERY_KEY,
  CHUNK_RECOVERY_MAX_ATTEMPTS,
  CHUNK_RECOVERY_SCRIPT
} from '@/shared/lib/chunkRecovery'

const CHUNK = 'https://nexustimer.com/_next/static/chunks/7290-e65f879712afbe15.js'

const setup = ({ online = true, attempts = 0 } = {}) => {
  const storage = new Map<string, string>(attempts ? [[CHUNK_RECOVERY_KEY, String(attempts)]] : [])
  let onError: (event: { target: unknown }) => void = () => {}
  const fakeWindow = {
    addEventListener: (type: string, listener: typeof onError) => {
      if (type === 'error') onError = listener
    }
  }
  const fetch = vi.fn(async () => new Response('ok'))
  const reload = vi.fn()

  new Function('window', 'navigator', 'sessionStorage', 'fetch', 'location', CHUNK_RECOVERY_SCRIPT)(
    fakeWindow,
    { onLine: online },
    {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value)
    },
    fetch,
    { reload }
  )

  const fail = (target: unknown) => onError({ target })
  const settle = () => vi.advanceTimersByTimeAsync(CHUNK_RECOVERY_BATCH_MS)
  return { fakeWindow, fetch, reload, storage, fail, settle }
}

describe('chunk recovery script', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('refetches failed build assets past the cached 404 and reloads once', async () => {
    const { fetch, reload, storage, fail, settle } = setup()

    fail({ tagName: 'SCRIPT', src: CHUNK })
    fail({ tagName: 'LINK', href: 'https://nexustimer.com/_next/static/css/app.css' })
    await settle()

    expect(fetch).toHaveBeenCalledWith(CHUNK, { cache: 'reload' })
    expect(fetch).toHaveBeenCalledWith('https://nexustimer.com/_next/static/css/app.css', { cache: 'reload' })
    expect(reload).toHaveBeenCalledTimes(1)
    expect(storage.get(CHUNK_RECOVERY_KEY)).toBe('1')
  })

  it('ignores failures that are not build assets or not resources', async () => {
    const { fakeWindow, fetch, reload, fail, settle } = setup()

    fail({ tagName: 'IMG', src: 'https://nexustimer.com/avatar.png' })
    fail({ tagName: 'SCRIPT', src: 'https://www.googletagmanager.com/gtag/js' })
    fail(fakeWindow)
    await settle()

    expect(fetch).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })

  it('does nothing offline, where a failed chunk is expected', async () => {
    const { fetch, reload, fail, settle } = setup({ online: false })

    fail({ tagName: 'SCRIPT', src: CHUNK })
    await settle()

    expect(fetch).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })

  it('stops after the maximum attempts so it can never loop', async () => {
    const { fetch, reload, fail, settle } = setup({ attempts: CHUNK_RECOVERY_MAX_ATTEMPTS })

    fail({ tagName: 'SCRIPT', src: CHUNK })
    await settle()

    expect(fetch).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })
})
