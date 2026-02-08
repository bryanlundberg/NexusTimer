import { AchievementItem } from '@/entities/achievement/ui/achievement-item'
import { Cube } from '@/entities/cube/model/types'
import { UserDocument } from '@/entities/user/model/user'
import { Achievement } from '@/entities/achievement/model/types'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'

interface BadgesProps {
  cubes: Array<Cube>
  user: UserDocument
}

export default function Badges({ cubes, user }: BadgesProps) {
  const achievementsData = { cubes, user }

  const ACHIEVEMENTS_CONFIG: Achievement[] = [
    {
      id: 'first-blood',
      title: 'Alpha Tester',
      description: 'Became a user in 2024',
      icon: 'icons8-animated-50.png',
      condition: (data) => data.cubes.length >= 1
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Fast as lightning! You registered your first sub-10 solve.',
      icon: 'icons8-lightning-48.png',
      condition: (data) => data.cubes.length >= 1
    },
    {
      id: 'over-9999-3x3',
      title: "It's over 9000!",
      description: 'You have completed over 9,999 solves on 3x3 cubes.',
      icon: 'icons8-mana-50.png',
      condition: (data) => data.cubes.length >= 1
    },
    {
      id: 'career-100k',
      title: 'Cube Legend',
      description: 'A journey of a thousand miles begins with a single solve... you already have 100,000.',
      icon: 'icons8-trophy-50.png',
      condition: (data) => data.cubes.length >= 1
    },
    {
      id: 'collector',
      title: 'Puzzle Collector',
      description: 'Own at least 25 cubes.',
      icon: 'icons8-money-box-50.png',
      condition: (data) => data.cubes.length >= 5
    },
    {
      id: 'eventglot',
      title: 'Eventglot',
      description: 'You own and have solved all available categories.',
      icon: 'icons8-diversity-50.png',
      condition: (data) => {
        const categories = new Set(data.cubes.map((cube) => cube.category))
        return categories.size >= CUBE_CATEGORIES.length
      }
    },
    {
      id: 'early-adopter',
      title: 'Nexus Pioneer',
      description: 'You were here before it was cool.',
      icon: 'icons8-virtual-reality-50.png',
      condition: (data) => new Date(data.user.createdAt) < new Date('2025-01-01')
    },
    {
      id: 'public-sponsor',
      title: 'Project Patron',
      description: 'A sponsor helping keep the engine running.',
      icon: 'icons8-favorite-50.png',
      condition: (data) => false
    },
    {
      id: 'bug-hunter',
      title: 'Bug Hunter',
      description: 'You found a glitch in the Matrix.',
      icon: 'icons8-bug-50.png',
      condition: (data) => false
    },
    {
      id: 'marathonist',
      title: 'Marathonist',
      description: 'Performed more than 500 solves in a single day.',
      icon: 'icons8-finish-flag-50.png',
      condition: (data) => false
    },
    {
      id: 'consistency-is-key',
      title: 'Consistency is Key',
      description: 'You have maintained a solve streak for 365 consecutive days.',
      icon: 'icons8-workflow-50.png',
      condition: (data) => false
    },
    {
      id: 'zen-master',
      title: 'Zen Master',
      description: 'You performed 100 solves without a single penalty (+2/DNF).',
      icon: 'icons8-wizard-50.png',
      condition: (data) => false
    }
  ]

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
        {ACHIEVEMENTS_CONFIG.map((achievement) => {
          const isUnlocked = false // achievement.condition(achievementsData);
          return <AchievementItem key={achievement.id} achievement={achievement} />
        })}
      </div>
    </div>
  )
}
