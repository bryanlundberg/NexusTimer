/**
 * Backups are only compressed to fit under Vercel's ~4.5 MB function body limit - TODO: Find a better way
 */
export async function gzipJson(text: string): Promise<Blob> {
  if (typeof CompressionStream === 'undefined') {
    return new Blob([text], { type: 'application/json' })
  }

  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))
  const buffer = await new Response(stream).arrayBuffer()
  return new Blob([buffer], { type: 'application/gzip' })
}
