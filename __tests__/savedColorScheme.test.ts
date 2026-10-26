import { applySavedColorScheme, savedColorSchemeConfig } from '@/shared/lib/savedColorScheme'

const settings = (colorTheme: string, vivid: boolean) =>
  JSON.stringify({ state: { settings: { preferences: { colorTheme, vivid } } }, version: 3 })

const FLAT = settings('indigo', false)

const setup = (items: Record<string, string>, prefersDark = true) => {
  const painted: Record<string, string> = {}
  const storage = {
    getItem: (key: string) => items[key] ?? null,
    setItem: (key: string, value: string) => (items[key] = value)
  }
  const root = { style: { setProperty: (name: string, value: string) => (painted[name] = value) } }
  return { items, painted, run: () => applySavedColorScheme(storage, root, () => prefersDark, savedColorSchemeConfig) }
}

const cache = (mode: string) =>
  JSON.stringify({ mode, tokens: { background: 'oklch(0.4 0.2 25)', primary: 'oklch(0.98 0.01 25)' } })

describe('applySavedColorScheme', () => {
  it('paints the cached tokens when the saved theme matches', () => {
    const { painted, run } = setup({ 'settings-modal-store': FLAT, 'color-scheme-cache': cache('dark'), theme: 'dark' })
    run()
    expect(painted).toEqual({ '--background': 'oklch(0.4 0.2 25)', '--primary': 'oklch(0.98 0.01 25)' })
  })

  it('resolves system through the media query', () => {
    const light = setup({ 'settings-modal-store': FLAT, 'color-scheme-cache': cache('light'), theme: 'system' }, false)
    light.run()
    expect(light.painted['--background']).toBe('oklch(0.4 0.2 25)')

    const dark = setup({ 'settings-modal-store': FLAT, 'color-scheme-cache': cache('light'), theme: 'system' }, true)
    dark.run()
    expect(dark.painted).toEqual({})
  })

  it('leaves the CSS defaults alone when the cache is for the other mode or missing', () => {
    const other = setup({ 'settings-modal-store': FLAT, 'color-scheme-cache': cache('light'), theme: 'dark' })
    other.run()
    expect(other.painted).toEqual({})

    const empty = setup({ 'settings-modal-store': FLAT, theme: 'dark' })
    empty.run()
    expect(empty.painted).toEqual({})
  })

  it('lands a brand-new visitor in vivid indigo even on a light system', () => {
    const { items, run } = setup({}, false)
    run()
    expect(items.theme).toBe('dark')
  })

  it('pins a vivid user to the polarity of their color', () => {
    const blue = setup({ 'settings-modal-store': settings('blue', true), theme: 'light' })
    blue.run()
    expect(blue.items.theme).toBe('dark')

    const yellow = setup({ 'settings-modal-store': settings('yellow', true), theme: 'dark' })
    yellow.run()
    expect(yellow.items.theme).toBe('light')
  })

  it('never touches the theme of a color without vivid or a user who left vivid', () => {
    const slate = setup({ 'settings-modal-store': settings('slate', true), theme: 'system' }, false)
    slate.run()
    expect(slate.items.theme).toBe('system')

    const flat = setup({ 'settings-modal-store': settings('blue', false), theme: 'light' })
    flat.run()
    expect(flat.items.theme).toBe('light')
  })

  it('treats saved settings from before vivid existed as vivid', () => {
    const legacy = JSON.stringify({ state: { settings: { preferences: { colorTheme: 'rose' } } }, version: 3 })
    const { items, run } = setup({ 'settings-modal-store': legacy, theme: 'light' })
    run()
    expect(items.theme).toBe('dark')
  })

  it('survives being stringified into the inline script', () => {
    const painted: Record<string, string> = {}
    const items: Record<string, string> = { 'color-scheme-cache': cache('dark') }
    const revived = new Function(`return (${applySavedColorScheme.toString()})`)()
    revived(
      { getItem: (key: string) => items[key] ?? null, setItem: (key: string, value: string) => (items[key] = value) },
      { style: { setProperty: (name: string, value: string) => (painted[name] = value) } },
      () => false,
      savedColorSchemeConfig
    )
    expect(items.theme).toBe('dark')
    expect(painted['--primary']).toBe('oklch(0.98 0.01 25)')
  })
})
