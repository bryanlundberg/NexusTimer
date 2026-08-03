import { CUBE_CATEGORIES, CubeCategory } from '@/shared/const/cube-categories'
import { Achievement, TieredAchievement } from './types'

const SPEED_MS: Partial<Record<CubeCategory, [number, number, number, number]>> = {
  '2x2': [6_000, 3_000, 2_000, 1_000],
  '3x3 BLD': [120_000, 90_000, 60_000, 30_000],
  '4x4': [90_000, 60_000, 45_000, 30_000],
  '4x4 BLD': [500_000, 300_000, 200_000, 100_000],
  '5x5': [150_000, 110_000, 80_000, 65_000],
  '6x6': [180_000, 160_000, 140_000, 120_000],
  '7x7': [230_000, 200_000, 170_000, 140_000],
  SQ1: [110_000, 45_000, 20_000, 10_000],
  Skewb: [20_000, 12_000, 8_000, 4_000],
  Pyraminx: [20_000, 12_000, 6_000, 3_000],
  Megaminx: [120_000, 100_000, 60_000, 40_000],
  Clock: [90_000, 45_000, 20_000, 10_000],
  FTO: [300_000, 150_000, 75_000, 35_000],
  '2x2 Virtual': [30_000, 15_000, 5_000, 2_000],
  '3x3 Virtual': [120_000, 45_000, 20_000, 10_000]
}

const VOLUME_THRESHOLDS = [50, 250, 1_000, 10_000]

const SPEED_RANKS = ['Rookie', 'Runner', 'Sprinter', 'Master']
const VOLUME_RANKS = ['Dabbler', 'Regular', 'Devotee', 'Specialist']

function puzzleIcon(category: CubeCategory): string {
  return `puzzle-${slug(category)}.svg`
}

/** Lowercased, spaces to dashes: `3x3 BLD` -> `3x3-bld`. */
function slug(category: CubeCategory): string {
  return category.toLowerCase().replace(/\s+/g, '-')
}

/** Whole minutes above a minute, seconds below it - `4:00` reads worse than `4 min`. */
function duration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)} seconds`

  const minutes = ms / 60_000
  return `${Number.isInteger(minutes) ? minutes : minutes.toFixed(1)} minutes`
}

const clock = (ms: number) => (Number.isFinite(ms) ? duration(ms) : '--')

function speedFamily(category: CubeCategory, thresholds: number[]): TieredAchievement {
  return {
    id: `speed-${slug(category)}`,
    icon: puzzleIcon(category),
    type: 'tiered',
    metric: ({ stats }) => stats.bestByCategory.get(category) ?? Infinity,
    compare: 'lt',
    formatValue: clock,
    tiers: thresholds.map((threshold, index) => ({
      id: `speed-${slug(category)}-${threshold / 1000}`,
      level: index + 1,
      title: `${category} ${SPEED_RANKS[index]}`,
      description: `Solved a ${category} in under ${duration(threshold)}.`,
      threshold
    }))
  }
}

function volumeFamily(category: CubeCategory): TieredAchievement {
  return {
    id: `volume-${slug(category)}`,
    icon: puzzleIcon(category),
    type: 'tiered',
    metric: ({ stats }) => stats.countByCategory.get(category) ?? 0,
    compare: 'gte',
    unit: `${category} solves`,
    tiers: VOLUME_THRESHOLDS.map((threshold, index) => ({
      id: `volume-${slug(category)}-${threshold}`,
      level: index + 1,
      title: `${category} ${VOLUME_RANKS[index]}`,
      description: `Completed ${threshold.toLocaleString('en-US')} ${category} solves.`,
      threshold
    }))
  }
}

export const CATEGORY_ACHIEVEMENTS: Achievement[] = [
  ...CUBE_CATEGORIES.flatMap((category) => {
    const thresholds = SPEED_MS[category]
    return thresholds ? [speedFamily(category, thresholds)] : []
  }),
  ...CUBE_CATEGORIES.map(volumeFamily)
]
