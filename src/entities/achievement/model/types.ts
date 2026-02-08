import { Cube } from '@/entities/cube/model/types'
import { UserDocument } from '@/entities/user/model/user'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (data: AchievementData) => boolean
}

export interface AchievementData {
  cubes: Cube[]
  user: UserDocument
}
