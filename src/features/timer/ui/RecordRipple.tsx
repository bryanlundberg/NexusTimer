import { useEffect, useState } from 'react'
import styles from './record-ripple.module.css'

interface RecordRippleProps {
  active: boolean
  solveId?: string
}

export default function RecordRipple({ active, solveId }: RecordRippleProps) {
  const [pulseId, setPulseId] = useState<string | null>(null)

  useEffect(() => {
    if (active && solveId) setPulseId(solveId)
  }, [active, solveId])

  if (!pulseId) return null

  return (
    <div className={styles.overlay} aria-hidden>
      <span key={pulseId} className={styles.ripple} onAnimationEnd={() => setPulseId(null)} />
    </div>
  )
}
