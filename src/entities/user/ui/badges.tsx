import { AchievementItem } from '@/entities/achievement/ui/achievement-item'
import { Cube } from '@/entities/cube/model/types'
import { UserDocument } from '@/entities/user/model/user'
import useAchievements from '@/entities/achievement/model/useAchievements'

interface BadgesProps {
  cubes: Array<Cube>
  user: UserDocument
}

export default function Badges({ cubes, user }: BadgesProps) {
  const achievementsData = { cubes, user }
  const { ACHIEVEMENTS_CONFIG } = useAchievements()

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Achievements
        </h3>
        <span className="text-xs text-zinc-500">
          {ACHIEVEMENTS_CONFIG.filter((a) => a.condition(achievementsData)).length} / {ACHIEVEMENTS_CONFIG.length}
        </span>
      </div>
      <div className="grid grid-cols-5  gap-2">
        {ACHIEVEMENTS_CONFIG.filter((achievement) => achievement.condition(achievementsData)).map((achievement) => (
          <AchievementItem key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  )
}
