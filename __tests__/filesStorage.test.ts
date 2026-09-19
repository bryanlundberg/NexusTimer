import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand
} from '@aws-sdk/client-s3'

const { send } = vi.hoisted(() => ({ send: vi.fn() }))

vi.mock('@aws-sdk/client-s3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@aws-sdk/client-s3')>()
  return {
    ...actual,
    S3Client: class {
      send = send
    }
  }
})

type Files = typeof import('@/shared/config/files').files

let files: Files

beforeAll(async () => {
  vi.stubEnv('FILES_EMULATOR', 'true')
  vi.stubEnv('FILES_BUCKET', 'bucket')
  vi.stubEnv('FILES_ACCESS_KEY_ID', 'key')
  vi.stubEnv('FILES_SECRET_ACCESS_KEY', 'secret')
  vi.stubEnv('FILES_ENDPOINT', 'http://localhost:9100')
  vi.stubEnv('FILES_PUBLIC_BASE_URL', 'https://cdn.example.com/bucket/')
  ;({ files } = await import('@/shared/config/files'))
})

afterAll(() => {
  vi.unstubAllEnvs()
})

beforeEach(() => {
  send.mockReset()
})

describe('files.url', () => {
  it('joins the public base url and encodes each key segment', () => {
    expect(files.url('avatars/user 1/a+b.png')).toBe('https://cdn.example.com/bucket/avatars/user%201/a%2Bb.png')
  })
})

describe('files.upload', () => {
  it('puts the blob bytes with content type and cache control', async () => {
    send.mockResolvedValue({})
    const body = new Blob(['{"a":1}'], { type: 'application/json' })

    await files.upload('backups/u/1.json', body, { cacheControl: 'public, max-age=60' })

    const command = send.mock.calls[0][0]
    expect(command).toBeInstanceOf(PutObjectCommand)
    expect(command.input).toMatchObject({
      Bucket: 'bucket',
      Key: 'backups/u/1.json',
      ContentType: 'application/json',
      ContentLength: 7,
      CacheControl: 'public, max-age=60'
    })
  })

  it('prefers the explicit content type over the blob type', async () => {
    send.mockResolvedValue({})

    await files.upload('avatars/u', new Blob(['x'], { type: 'image/png' }), { contentType: 'image/webp' })

    expect(send.mock.calls[0][0].input.ContentType).toBe('image/webp')
  })
})

describe('files.exists', () => {
  it('returns true when the head request succeeds', async () => {
    send.mockResolvedValue({})

    await expect(files.exists('a')).resolves.toBe(true)
    expect(send.mock.calls[0][0]).toBeInstanceOf(HeadObjectCommand)
  })

  it('returns false on a not found error', async () => {
    send.mockRejectedValue(Object.assign(new Error('nope'), { name: 'NotFound' }))

    await expect(files.exists('a')).resolves.toBe(false)
  })

  it('returns false on a 404 status', async () => {
    send.mockRejectedValue(Object.assign(new Error('nope'), { name: 'Unknown', $metadata: { httpStatusCode: 404 } }))

    await expect(files.exists('a')).resolves.toBe(false)
  })

  it('rethrows other errors', async () => {
    send.mockRejectedValue(Object.assign(new Error('denied'), { name: 'AccessDenied' }))

    await expect(files.exists('a')).rejects.toThrow('denied')
  })
})

describe('files.delete', () => {
  it('deletes a single key with DeleteObject', async () => {
    send.mockResolvedValue({})

    await files.delete('avatars/u')

    const command = send.mock.calls[0][0]
    expect(command).toBeInstanceOf(DeleteObjectCommand)
    expect(command.input).toEqual({ Bucket: 'bucket', Key: 'avatars/u' })
  })

  it('splits many keys into batches of 1000', async () => {
    send.mockResolvedValue({})
    const keys = Array.from({ length: 2500 }, (_, i) => `k${i}`)

    await files.delete(keys)

    expect(send).toHaveBeenCalledTimes(3)
    const sizes = send.mock.calls.map(([command]) => {
      expect(command).toBeInstanceOf(DeleteObjectsCommand)
      return command.input.Delete.Objects.length
    })
    expect(sizes).toEqual([1000, 1000, 500])
  })

  it('throws when the batch reports per-key errors', async () => {
    send.mockResolvedValue({ Errors: [{ Key: 'k1', Code: 'AccessDenied' }] })

    await expect(files.delete(['k1', 'k2'])).rejects.toThrow('k1: AccessDenied')
  })
})

describe('files.listAll', () => {
  it('follows continuation tokens and skips entries without a key', async () => {
    const modified = new Date(1_700_000_000_000)
    send
      .mockResolvedValueOnce({
        Contents: [{ Key: 'p/a', Size: 1, LastModified: modified }, { Size: 9 }],
        IsTruncated: true,
        NextContinuationToken: 'next'
      })
      .mockResolvedValueOnce({ Contents: [{ Key: 'p/b', Size: 2 }], IsTruncated: false })

    const listed = []
    for await (const object of files.listAll({ prefix: 'p/' })) listed.push(object)

    expect(listed).toEqual([
      { key: 'p/a', size: 1, lastModified: modified.getTime() },
      { key: 'p/b', size: 2, lastModified: undefined }
    ])
    expect(send.mock.calls[0][0]).toBeInstanceOf(ListObjectsV2Command)
    expect(send.mock.calls[0][0].input).toEqual({ Bucket: 'bucket', Prefix: 'p/' })
    expect(send.mock.calls[1][0].input).toEqual({ Bucket: 'bucket', Prefix: 'p/', ContinuationToken: 'next' })
  })
})
