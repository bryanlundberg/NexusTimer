'use client'

import { useEffect } from 'react'
import { BOOT_RECOVERY_SCRIPT, markBooted } from '@/shared/lib/bootRecovery'

// Executes only from the server HTML; on a client render React would warn about an executable script.
const scriptType = typeof window === 'undefined' ? undefined : 'text/plain'

export function BootWatchdog() {
  useEffect(() => {
    markBooted()
  }, [])

  return (
    <script type={scriptType} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: BOOT_RECOVERY_SCRIPT }} />
  )
}
