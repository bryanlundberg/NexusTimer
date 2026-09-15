const MAX_BADGE_COUNT = 99

/** Caps counters at "+99" so badges never grow past three characters. */
export const formatBadgeCount = (count: number) => (count > MAX_BADGE_COUNT ? `+${MAX_BADGE_COUNT}` : String(count))
