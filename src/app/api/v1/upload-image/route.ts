import { v2 as cloudinary } from 'cloudinary'
import { badRequest, ok, serverError } from '@/shared/api/responses'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  upload_prefix: 'https://api-eu.cloudinary.com'
})

type CloudinaryUploadOptions = {
  folder: string
  resource_type: 'auto'
  public_id?: string
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const path = formData.get('path') as string
  const filename = formData.get('filename') as string | null

  if (!file) return badRequest('No file provided')
  if (!path) return badRequest('No path provided')

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const dataURI = `data:${file.type};base64,${buffer.toString('base64')}`

    const uploadOptions: CloudinaryUploadOptions = {
      folder: path,
      resource_type: 'auto'
    }

    if (filename) {
      uploadOptions.public_id = filename
    }

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions)

    return ok({
      url: result.secure_url,
      public_id: result.public_id
    })
  } catch (error) {
    return serverError('upload-image:POST', error)
  }
}
