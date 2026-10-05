import type { Storage, StoredObject, UploadOptions } from '../src/infra/storage'

const STORED_AT = Date.UTC(2026, 9, 4, 10, 0, 0)

export function fakeStorage() {
  const objects = new Map<string, { body: Uint8Array; options: UploadOptions; lastModified: number }>()
  const storage: Storage = {
    async upload(key, body, options) {
      objects.set(key, { body, options, lastModified: STORED_AT })
    },
    url: (key) => `https://files.test/${key}`,
    async exists(key) {
      return objects.has(key)
    },
    async delete(keys) {
      for (const key of typeof keys === 'string' ? [keys] : keys) objects.delete(key)
    },
    async list(prefix) {
      return [...objects.entries()]
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, { body, lastModified }]): StoredObject => ({ key, size: body.byteLength, lastModified }))
    }
  }
  return { storage, objects }
}
