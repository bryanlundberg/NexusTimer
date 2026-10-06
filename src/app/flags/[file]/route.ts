import { countries } from 'country-flag-icons'
import * as flags from 'country-flag-icons/string/3x2'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return countries.map((country) => ({ file: `${country}.svg` }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  const svg = (flags as Record<string, string | undefined>)[file.replace(/\.svg$/, '').replace('-', '_')]
  if (!svg) return new Response(null, { status: 404 })

  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } })
}
