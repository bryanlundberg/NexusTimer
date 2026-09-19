export const UPLOAD_TIMEOUT_MS = 30_000

export const uploadWithProgress = (
  url: string,
  blob: Blob,
  onProgress: (percent: number) => void,
  headers: Record<string, string> = {}
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-Type', blob.type || 'application/octet-stream')
    for (const [name, value] of Object.entries(headers)) xhr.setRequestHeader(name, value)
    xhr.timeout = UPLOAD_TIMEOUT_MS

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      resolve(new Response(xhr.response, { status: xhr.status }))
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.ontimeout = () => reject(new Error('Upload timed out'))
    xhr.onabort = () => reject(new Error('Upload aborted'))

    xhr.send(blob)
  })
}
