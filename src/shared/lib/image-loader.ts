import type { ImageLoaderProps } from 'next/image'

const DEFAULT_QUALITY = 75

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (process.env.NODE_ENV === 'development' || !src.startsWith('/')) return src
  return `/cdn-cgi/image/width=${width},quality=${quality ?? DEFAULT_QUALITY},format=auto${src}`
}
