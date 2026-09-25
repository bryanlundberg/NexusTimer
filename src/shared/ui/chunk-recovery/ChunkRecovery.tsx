'use client'

import { CHUNK_RECOVERY_SCRIPT } from '@/shared/lib/chunkRecovery'

// Executes only from the server HTML; on a client render React would warn about an executable script.
const scriptType = typeof window === 'undefined' ? undefined : 'text/plain'

export function ChunkRecovery() {
  return (
    <script type={scriptType} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: CHUNK_RECOVERY_SCRIPT }} />
  )
}
