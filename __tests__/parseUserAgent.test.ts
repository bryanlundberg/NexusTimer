import { parseUserAgent } from '@/features/nexus-connect/lib/parseUserAgent'

describe('parseUserAgent', () => {
  it('detects Chrome on Windows and maps the NT version', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
    expect(parseUserAgent(ua)).toEqual({
      os: { name: 'Windows', version: '10' },
      browser: { name: 'Chrome', version: '141.0.0.0' }
    })
  })

  it('prefers Edge over the Chrome token it also carries', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0'
    expect(parseUserAgent(ua).browser).toEqual({ name: 'Edge', version: '141.0.0.0' })
  })

  it('detects mobile Safari on iOS before the macOS token', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1'
    expect(parseUserAgent(ua)).toEqual({
      os: { name: 'iOS', version: '18.6.2' },
      browser: { name: 'Mobile Safari', version: '18.6' }
    })
  })

  it('detects Android before Linux and keeps Samsung Internet unprefixed', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36'
    expect(parseUserAgent(ua)).toEqual({
      os: { name: 'Android', version: '14' },
      browser: { name: 'Samsung Internet', version: '28.0' }
    })
  })

  it('returns empty results for an unknown agent', () => {
    expect(parseUserAgent('curl/8.4.0')).toEqual({ os: {}, browser: {} })
  })
})
