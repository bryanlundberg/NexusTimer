import { z } from 'zod'

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional()
})

export type FeedbackInput = z.infer<typeof feedbackSchema>

export interface FeedbackResponse {
  _id: string
  userId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}
