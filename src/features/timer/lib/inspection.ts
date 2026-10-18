export type InspectionPenalty = 'none' | 'plus2' | 'dnf'

const PLUS2_WINDOW_SECONDS = 2

export function inspectionPenalty(remainingSeconds: number): InspectionPenalty {
  if (remainingSeconds >= 0) return 'none'
  return remainingSeconds >= -PLUS2_WINDOW_SECONDS ? 'plus2' : 'dnf'
}

export function inspectionLabel(remainingSeconds: number): string {
  const penalty = inspectionPenalty(remainingSeconds)
  if (penalty === 'plus2') return '+2'
  if (penalty === 'dnf') return 'DNF'
  return String(Math.max(1, Math.ceil(remainingSeconds)))
}
