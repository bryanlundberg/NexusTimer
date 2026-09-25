import { BOOT_RECOVERY_SCRIPT, BOOT_TIMEOUT_MS, RECOVERY_KEY } from '@/shared/lib/bootRecovery'
import { AUTH_SESSION_CACHE } from '@/shared/lib/authSessionCache'

type Env = {
  booted?: boolean
  online?: boolean
  alreadyRecovered?: boolean
}

const run = async ({ booted = false, online = true, alreadyRecovered = false }: Env) => {
  const storage = new Map<string, string>(alreadyRecovered ? [[RECOVERY_KEY, '1']] : [])
  const unregister = vi.fn(async () => true)
  const deleted: string[] = []
  const reload = vi.fn()

  const fakeWindow = {
    __nxBooted: booted,
    caches: {
      keys: async () => ['serwist-precache-v2-https://nexustimer.com/', 'others', AUTH_SESSION_CACHE],
      delete: async (key: string) => {
        deleted.push(key)
        return true
      }
    }
  }
  const fakeNavigator = {
    onLine: online,
    serviceWorker: { getRegistrations: async () => [{ unregister }, { unregister }] }
  }
  const fakeSessionStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value)
  }

  new Function('window', 'navigator', 'sessionStorage', 'location', BOOT_RECOVERY_SCRIPT)(
    fakeWindow,
    fakeNavigator,
    fakeSessionStorage,
    { reload }
  )
  await vi.advanceTimersByTimeAsync(BOOT_TIMEOUT_MS)

  return { unregister, deleted, reload, storage }
}

describe('boot recovery script', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('drops service workers and their caches, keeps the offline session and reloads once', async () => {
    const { unregister, deleted, reload, storage } = await run({})

    expect(unregister).toHaveBeenCalledTimes(2)
    expect(deleted).toEqual(['serwist-precache-v2-https://nexustimer.com/', 'others'])
    expect(reload).toHaveBeenCalledTimes(1)
    expect(storage.get(RECOVERY_KEY)).toBe('1')
  })

  it('does nothing once the app has booted', async () => {
    const { unregister, reload } = await run({ booted: true })

    expect(unregister).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })

  it('keeps offline support when there is no connection', async () => {
    const { unregister, reload } = await run({ online: false })

    expect(unregister).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })

  it('never reloads twice in the same tab session', async () => {
    const { unregister, reload } = await run({ alreadyRecovered: true })

    expect(unregister).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })
})
