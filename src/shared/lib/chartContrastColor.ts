import type { Colors } from '@/shared/types/colors'

export interface ChartContrast {
  bg: string
  stroke: string
  hex: string
}

export const CHART_CONTRAST: Record<Colors, ChartContrast> = {
  green: { bg: 'bg-violet-500', stroke: 'stroke-violet-500', hex: '#8b5cf6' },
  violet: { bg: 'bg-emerald-500', stroke: 'stroke-emerald-500', hex: '#10b981' },
  blue: { bg: 'bg-orange-500', stroke: 'stroke-orange-500', hex: '#f97316' },
  orange: { bg: 'bg-sky-500', stroke: 'stroke-sky-500', hex: '#0ea5e9' },
  red: { bg: 'bg-emerald-500', stroke: 'stroke-emerald-500', hex: '#10b981' },
  rose: { bg: 'bg-teal-500', stroke: 'stroke-teal-500', hex: '#14b8a6' },
  yellow: { bg: 'bg-violet-500', stroke: 'stroke-violet-500', hex: '#8b5cf6' },
  neutral: { bg: 'bg-sky-500', stroke: 'stroke-sky-500', hex: '#0ea5e9' },
  amber: { bg: 'bg-indigo-500', stroke: 'stroke-indigo-500', hex: '#6366f1' },
  lime: { bg: 'bg-fuchsia-500', stroke: 'stroke-fuchsia-500', hex: '#d946ef' },
  emerald: { bg: 'bg-rose-500', stroke: 'stroke-rose-500', hex: '#f43f5e' },
  teal: { bg: 'bg-orange-500', stroke: 'stroke-orange-500', hex: '#f97316' },
  cyan: { bg: 'bg-pink-500', stroke: 'stroke-pink-500', hex: '#ec4899' },
  sky: { bg: 'bg-amber-500', stroke: 'stroke-amber-500', hex: '#f59e0b' },
  indigo: { bg: 'bg-lime-500', stroke: 'stroke-lime-500', hex: '#84cc16' },
  purple: { bg: 'bg-yellow-500', stroke: 'stroke-yellow-500', hex: '#eab308' },
  fuchsia: { bg: 'bg-emerald-500', stroke: 'stroke-emerald-500', hex: '#10b981' },
  pink: { bg: 'bg-teal-500', stroke: 'stroke-teal-500', hex: '#14b8a6' },
  slate: { bg: 'bg-blue-500', stroke: 'stroke-blue-500', hex: '#3b82f6' },
  zinc: { bg: 'bg-violet-500', stroke: 'stroke-violet-500', hex: '#8b5cf6' },
  gray: { bg: 'bg-orange-500', stroke: 'stroke-orange-500', hex: '#f97316' },
  stone: { bg: 'bg-sky-500', stroke: 'stroke-sky-500', hex: '#0ea5e9' }
}

export const DEFAULT_CHART_CONTRAST: ChartContrast = CHART_CONTRAST.green
