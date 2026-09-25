'use client'

import { useEffect } from 'react'
import { DIAGNOSTICS_SCRIPT } from '@/shared/lib/diagnostics'

// Executes only from the server HTML; on a client render React would warn about an executable script.
const scriptType = typeof window === 'undefined' ? undefined : 'text/plain'

export function DiagnosticsRecorder() {
  useEffect(() => {
    window.__nxDiag?.('hydrated', window.location.pathname)
  }, [])

  return <script type={scriptType} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: DIAGNOSTICS_SCRIPT }} />
}
