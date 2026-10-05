import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'

const DELETE_BATCH_LIMIT = 1000

export type StoredObject = { key: string; size: number; lastModified?: number }

export type UploadOptions = { contentType: string; cacheControl?: string }

export type Storage = {
  upload(key: string, body: Uint8Array, options: UploadOptions): Promise<void>
  url(key: string): string
  exists(key: string): Promise<boolean>
  delete(keys: string | string[]): Promise<void>
  list(prefix: string): Promise<StoredObject[]>
}

export type StorageConfig = {
  bucket?: string
  accessKeyId?: string
  secretAccessKey?: string
  publicBaseUrl?: string
  region?: string
  emulator: boolean
  endpoint?: string
}

const isNotFound = (error: unknown) => {
  const e = error as { name?: string; $metadata?: { httpStatusCode?: number } }
  return e?.name === 'NotFound' || e?.name === 'NoSuchKey' || e?.$metadata?.httpStatusCode === 404
}

function notConfigured(): Storage {
  const fail = () => {
    throw new Error('File storage is not configured (FILES_* variables)')
  }
  return {
    upload: async () => fail(),
    url: fail,
    exists: async () => fail(),
    delete: async () => fail(),
    list: async () => fail()
  }
}

export function createStorage(config: StorageConfig): Storage {
  const { bucket, accessKeyId, secretAccessKey, emulator, endpoint } = config
  const publicBaseUrl = config.publicBaseUrl?.replace(/\/+$/, '')
  const region = emulator ? 'us-east-1' : config.region
  if (!bucket || !accessKeyId || !secretAccessKey || !publicBaseUrl || !region || (emulator && !endpoint)) {
    return notConfigured()
  }

  const client = new S3Client(
    emulator
      ? { region, endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } }
      : { region, endpoint: `https://s3.${region}.backblazeb2.com`, credentials: { accessKeyId, secretAccessKey } }
  )

  return {
    async upload(key, body, { contentType, cacheControl }) {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentLength: body.byteLength,
          ContentType: contentType,
          ...(cacheControl && { CacheControl: cacheControl })
        })
      )
    },

    url(key) {
      return `${publicBaseUrl}/${key.split('/').map(encodeURIComponent).join('/')}`
    },

    async exists(key) {
      try {
        await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
        return true
      } catch (error) {
        if (isNotFound(error)) return false
        throw error
      }
    },

    async delete(keys) {
      if (typeof keys === 'string') {
        await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: keys }))
        return
      }

      for (let start = 0; start < keys.length; start += DELETE_BATCH_LIMIT) {
        const batch = keys.slice(start, start + DELETE_BATCH_LIMIT)
        const result = await client.send(
          new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: batch.map((key) => ({ Key: key })) } })
        )
        const failed = result.Errors ?? []
        if (failed.length > 0) {
          const detail = failed.map((error) => `${error.Key}: ${error.Code ?? error.Message}`).join(', ')
          throw new Error(`Failed to delete ${failed.length} object(s): ${detail}`)
        }
      }
    },

    async list(prefix) {
      const objects: StoredObject[] = []
      let token: string | undefined
      do {
        const page = await client.send(
          new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ...(token && { ContinuationToken: token }) })
        )
        for (const object of page.Contents ?? []) {
          if (!object.Key) continue
          objects.push({
            key: object.Key,
            size: Number(object.Size ?? 0),
            lastModified: object.LastModified?.getTime()
          })
        }
        token = page.IsTruncated ? page.NextContinuationToken : undefined
      } while (token)
      return objects
    }
  }
}
