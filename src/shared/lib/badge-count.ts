const MAX_BADGE_COUNT = 99

export const formatBadgeCount = (count: number) => (count > MAX_BADGE_COUNT ? `+${MAX_BADGE_COUNT}` : String(count))
