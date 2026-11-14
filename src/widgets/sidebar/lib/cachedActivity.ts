import { activityStreak } from '@/widgets/sidebar/lib/activityStreak'
import { monthActivity } from '@/widgets/sidebar/lib/monthActivity'
import { memoByCubesAndDay } from '@/widgets/sidebar/lib/memoByCubesAndDay'

export const cachedActivityStreak = memoByCubesAndDay((cubes) => activityStreak(cubes))
export const cachedMonthActivity = memoByCubesAndDay((cubes) => monthActivity(cubes))
