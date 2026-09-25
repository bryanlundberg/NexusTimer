import { DIAGNOSTICS_KEY, DIAGNOSTICS_SCRIPT } from '@/shared/lib/diagnostics'

type Listener = (event: Record<string, unknown>) => void
type Run = { url: string; events: { type: string; detail: string }[] }

const load = (stored?: string) => {
  const storage = new Map<string, string>(stored ? [[DIAGNOSTICS_KEY, stored]] : [])
  const listeners: Record<string, Listener> = {}
  const fakeWindow: Record<string, unknown> = {
    addEventListener: (type: string, listener: Listener) => (listeners[type] = listener)
  }
  const fakeConsole = { error: vi.fn() }

  new Function('window', 'document', 'localStorage', 'location', 'console', DIAGNOSTICS_SCRIPT)(
    fakeWindow,
    { body: { innerText: '' }, addEventListener: vi.fn() },
    {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value)
    },
    { href: 'https://nexustimer.com/es/app' },
    fakeConsole
  )

  const runs = (): Run[] => JSON.parse(storage.get(DIAGNOSTICS_KEY) ?? '[]')
  return { listeners, fakeWindow, fakeConsole, runs }
}

describe('diagnostics script', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('records errors, rejections and console errors for the current load', () => {
    const { listeners, fakeWindow, fakeConsole, runs } = load()
    const { error: wrappedError } = fakeConsole

    listeners.error({ target: fakeWindow, message: 'boom', filename: 'app.js', lineno: 3 })
    listeners.unhandledrejection({ reason: new Error('db blocked') })
    wrappedError('hydration failed', { code: 1 })
    const types = runs()[0].events.map((event) => event.type)

    expect(runs()[0].url).toBe('https://nexustimer.com/es/app')
    expect(types).toEqual(['html', 'error', 'rejection', 'console'])
    expect(runs()[0].events[1].detail).toContain('boom @ app.js:3')
    expect(runs()[0].events[2].detail).toContain('db blocked')
    expect(runs()[0].events[3].detail).toBe('hydration failed {"code":1}')
  })

  it('still forwards console errors to the real console', () => {
    const original = vi.fn()
    const storage = new Map<string, string>()
    const fakeConsole = { error: original }

    new Function('window', 'document', 'localStorage', 'location', 'console', DIAGNOSTICS_SCRIPT)(
      { addEventListener: vi.fn() },
      { body: { innerText: '' }, addEventListener: vi.fn() },
      {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value)
      },
      { href: '/app' },
      fakeConsole
    )
    fakeConsole.error('oops')

    expect(original).toHaveBeenCalledWith('oops')
  })

  it('logs failed resources separately from script errors', () => {
    const { listeners, runs } = load()

    listeners.error({ target: { src: 'https://nexustimer.com/_next/static/chunks/missing.js' } })

    expect(runs()[0].events.at(-1)).toMatchObject({ type: 'resource', detail: expect.stringContaining('missing.js') })
  })

  it('keeps only the last three page loads', () => {
    const previous = JSON.stringify([1, 2, 3].map((n) => ({ url: `/old/${n}`, start: n, events: [] })))
    const { runs } = load(previous)

    expect(runs().map((run) => run.url)).toEqual(['/old/2', '/old/3', 'https://nexustimer.com/es/app'])
  })
})
