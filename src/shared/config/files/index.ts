import { Files } from 'files-sdk'
import { backblazeB2 } from 'files-sdk/backblaze-b2'
import { minio } from 'files-sdk/minio'

const useEmulator = process.env.FILES_EMULATOR === 'true'

const bucket = process.env.FILES_BUCKET as string
const accessKeyId = process.env.FILES_ACCESS_KEY_ID
const secretAccessKey = process.env.FILES_SECRET_ACCESS_KEY
const endpoint = process.env.FILES_ENDPOINT as string
const publicBaseUrl = process.env.FILES_PUBLIC_BASE_URL as string
const region = process.env.FILES_REGION as string

export const files = new Files({
  adapter: useEmulator
    ? minio({ bucket, endpoint, accessKeyId, secretAccessKey, publicBaseUrl })
    : backblazeB2({ bucket, region, accessKeyId, secretAccessKey, publicBaseUrl })
})

export default files
