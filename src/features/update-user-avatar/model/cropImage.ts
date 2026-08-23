import type { Area } from 'react-easy-crop'

export const AVATAR_OUTPUT_SIZE = 512
export const AVATAR_OUTPUT_TYPE = 'image/webp'
export const AVATAR_OUTPUT_QUALITY = 0.9

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error('Failed to load image')))
    image.src = url
  })
}

export async function getCroppedAvatarFile(imageSrc: string, pixelCrop: Area): Promise<File> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = AVATAR_OUTPUT_SIZE
  canvas.height = AVATAR_OUTPUT_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    AVATAR_OUTPUT_SIZE,
    AVATAR_OUTPUT_SIZE
  )

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('Canvas toBlob failed'))),
      AVATAR_OUTPUT_TYPE,
      AVATAR_OUTPUT_QUALITY
    )
  })

  // Browsers that cannot encode the requested type silently fall back to png,
  // so the extension and mime type are derived from the blob itself.
  const type = blob.type || AVATAR_OUTPUT_TYPE
  const extension = type.split('/')[1] ?? 'webp'

  return new File([blob], `avatar.${extension}`, { type })
}
