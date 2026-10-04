import { describe, expect, it } from 'vitest'
import { createStorage } from '../src/infra/storage'

const full = {
  bucket: 'nexustimer-dev',
  accessKeyId: 'key',
  secretAccessKey: 'secret',
  publicBaseUrl: 'https://files.test/bucket/',
  region: 'us-east-005',
  emulator: false
}

describe('storage', () => {
  it('fails each call instead of booting broken when a variable is missing', async () => {
    const storage = createStorage({ ...full, bucket: undefined })

    expect(() => storage.url('a')).toThrow(/not configured/)
    await expect(storage.upload('a', new Uint8Array(), { contentType: 'text/plain' })).rejects.toThrow(/not configured/)
    await expect(storage.list('a/')).rejects.toThrow(/not configured/)
  })

  it('needs an endpoint for the emulator', () => {
    expect(() => createStorage({ ...full, emulator: true }).url('a')).toThrow(/not configured/)
  })

  it('builds public urls with encoded segments and no double slash', () => {
    expect(createStorage(full).url('avatars/a b/ñ.png')).toBe('https://files.test/bucket/avatars/a%20b/%C3%B1.png')
  })
})
