import { z } from 'zod'
import { CUBE_CATEGORIES } from '@/shared/config/cube-categories'
import { RoomStatus } from '@/entities/free-play-mode/model/enums'

const roomSchema = z.object({
  roomId: z.string(),
  status: z.nativeEnum(RoomStatus),
  createdAt: z.number(),
  maxRoundTime: z.number(),
  createdBy: z.string(),
  authority: z.string(),
  scramble: z.string(),
  currentRoundTimeLimit: z.number(),
  name: z.string(),
  event: z.enum(CUBE_CATEGORIES)
})

export type Room = z.infer<typeof roomSchema>
