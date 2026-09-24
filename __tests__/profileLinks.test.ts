import { normalizeProfileLink, parseProfileLink } from '@/shared/lib/profile-links'

describe('normalizeProfileLink', () => {
  it('adds https to bare hosts', () => {
    expect(normalizeProfileLink('twitch.tv/nexus')).toBe('https://twitch.tv/nexus')
    expect(normalizeProfileLink('  example.com  ')).toBe('https://example.com/')
  })

  it('keeps explicit http and https links', () => {
    expect(normalizeProfileLink('http://example.com/a')).toBe('http://example.com/a')
    expect(normalizeProfileLink('https://www.youtube.com/@nexus')).toBe('https://www.youtube.com/@nexus')
  })

  it('treats host:port without a scheme as a host', () => {
    expect(normalizeProfileLink('example.com:8080/x')).toBe('https://example.com:8080/x')
  })

  it.each(['javascript:alert(1)', 'data:text/html,hi', 'mailto:a@b.co', 'ftp://example.com'])(
    'rejects non-web scheme %s',
    (input) => {
      expect(normalizeProfileLink(input)).toBeNull()
    }
  )

  it.each(['', 'nexus', 'https://localhost', 'https://user:pass@example.com', 'exa mple.com'])(
    'rejects %j',
    (input) => {
      expect(normalizeProfileLink(input)).toBeNull()
    }
  )

  it('rejects links over the length limit', () => {
    expect(normalizeProfileLink(`example.com/${'a'.repeat(200)}`)).toBeNull()
  })
})

describe('parseProfileLink', () => {
  it.each([
    ['instagram.com/nexus.timer', 'instagram', '@nexus.timer'],
    ['https://www.youtube.com/@nexus', 'youtube', '@nexus'],
    ['https://m.youtube.com/channel/UC123', 'youtube', null],
    ['https://youtu.be/dQw4w9WgXcQ', 'youtube', null],
    ['https://www.tiktok.com/@nexus', 'tiktok', '@nexus'],
    ['https://vm.tiktok.com/ZMabc/', 'tiktok', null],
    ['twitch.tv/nexus', 'twitch', '@nexus'],
    ['https://thecubeindex.com/user/nexus', 'cubeindex', '@nexus'],
    ['https://beta.thecubeindex.com/user/nexus/collection', 'cubeindex', '@nexus'],
    ['https://thecubeindex.com/explore/cubes', 'cubeindex', null],
    ['https://www.instagram.com/p/abc123/', 'instagram', null]
  ])('detects %s', (input, platform, handle) => {
    expect(parseProfileLink(input)).toMatchObject({ platform, handle })
  })

  it('does not match lookalike domains', () => {
    expect(parseProfileLink('https://notinstagram.com/nexus')?.platform).toBeNull()
    expect(parseProfileLink('https://instagram.com.evil.io/nexus')?.platform).toBeNull()
  })

  it('falls back to the bare hostname for other sites', () => {
    expect(parseProfileLink('https://www.nexustimer.com/about')).toMatchObject({
      platform: null,
      host: 'nexustimer.com',
      handle: null
    })
  })
})
