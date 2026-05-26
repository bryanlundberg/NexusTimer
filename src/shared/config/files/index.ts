import { Files } from 'files-sdk'
import { backblazeB2 } from 'files-sdk/backblaze-b2'

export const files = new Files({
  adapter: backblazeB2({
    bucket: process.env.B2_BUCKET as string,
    region: process.env.B2_REGION as string,
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
    publicBaseUrl: `https://${process.env.B2_BUCKET}.s3.${process.env.B2_REGION}.backblazeb2.com`
  })
})

export default files
