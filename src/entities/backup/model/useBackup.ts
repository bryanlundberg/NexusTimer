import { useEffect, useState } from 'react'
import { Cube } from '@/entities/cube/model/types'
import { normalizeOldData, preventDuplicateDeleteStatus } from '@/features/manage-backup/lib/importDataFromFile'

export const useBackup = (url: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false)
  const [backup, setBackup] = useState<Cube[]>([])

  useEffect(() => {
    setBackup([])
    if (!url) {
      setIsLoading(false)
      return
    }

    const fetchBackup = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Network response was not ok')

        setBackup(preventDuplicateDeleteStatus(normalizeOldData(await response.json())))
      } catch {
        setBackup([])
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
