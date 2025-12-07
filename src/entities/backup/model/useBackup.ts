import { useEffect, useState } from 'react'
import { decompressSync, strFromU8 } from 'fflate'
import { Cube } from '@/entities/cube/model/types'

export const useBackup = (url: string) => {
  const [isLoading, setIsLoading] = useState(true)
  const [backup, setBackup] = useState<Cube[] | null>(null)

  useEffect(() => {
    if (!url) {
      setIsLoading(false)
      return
    }

    const fetchBackup = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Network response was not ok')

        const compressed = new Uint8Array(await response.arrayBuffer())
        const decompressed = decompressSync(compressed)
        const data = strFromU8(decompressed)

        setBackup(JSON.parse(data) as Cube[])
      } catch (error) {
        console.error('Error fetching backup:', error)
        setBackup(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBackup()
  }, [url])

  return {
    backup,
    isLoading
  }
}
