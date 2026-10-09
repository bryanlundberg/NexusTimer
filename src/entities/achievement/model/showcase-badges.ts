import type { BadgeFamily } from './resolve-badges'

const completion = (family: BadgeFamily) => family.level / family.maxLevel

export function pickShowcaseBadges(families: BadgeFamily[], limit: number): BadgeFamily[] {
  const unlocked = families.filter((family) => family.unlocked)
  const special = unlocked.filter((family) => family.color)
  const ranked = unlocked
    .filter((family) => !family.color)
    .sort((a, b) => b.level - a.level || completion(b) - completion(a))

  return [...special, ...ranked].slice(0, limit)
}
