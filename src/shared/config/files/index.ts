import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'

const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

const useEmulator = process.env.FILES_EMULATOR === 'true'

const bucket = requireEnv('FILES_BUCKET')
const accessKeyId = requireEnv('FILES_ACCESS_KEY_ID')
const secretAccessKey = requireEnv('FILES_SECRET_ACCESS_KEY')
const publicBaseUrl = requireEnv('FILES_PUBLIC_BASE_URL').replace(/\/+$/, '')
const endpoint = useEmulator ? requireEnv('FILES_ENDPOINT') : undefined
const region = useEmulator ? 'us-east-1' : requireEnv('FILES_REGION')

const DELETE_BATCH_LIMIT = 1000

const client = new S3Client(
  useEmulator
    ? { region, endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } }
    : {
        region,
        endpoint: `https://s3.${region}.backblazeb2.com`,
        credentials: { accessKeyId, secretAccessKey }
      }
)

export interface StoredObject {
  key: string
  size: number
  lastModified?: number
}

const isNotFound = (error: unknown) => {
  const e = error as { name?: string; $metadata?: { httpStatusCode?: number } }
  return e?.name === 'NotFound' || e?.name === 'NoSuchKey' || e?.$metadata?.httpStatusCode === 404
}

async function upload(key: string, body: Blob, options: { contentType?: string; cacheControl?: string } = {}) {
  const data = new Uint8Array(await body.arrayBuffer())
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentLength: data.byteLength,
      ContentType: options.contentType ?? (body.type || 'application/octet-stream'),
      ...(options.cacheControl && { CacheControl: options.cacheControl })
    })
  )
}

function url(key: string): string {
  return `${publicBaseUrl}/${key.split('/').map(encodeURIComponent).join('/')}`
}

async function exists(key: string): Promise<boolean> {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return true
  } catch (error) {
    if (isNotFound(error)) return false
    throw error
  }
}

async function remove(keys: string | string[]) {
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
}

async function* listAll({ prefix }: { prefix: string }): AsyncGenerator<StoredObject> {
  let token: string | undefined

  do {
    const page = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ...(token && { ContinuationToken: token }) })
    )
    for (const object of page.Contents ?? []) {
      if (!object.Key) continue
      yield { key: object.Key, size: Number(object.Size ?? 0), lastModified: object.LastModified?.getTime() }
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined
  } while (token)
}

export const files = { upload, url, exists, delete: remove, listAll }
