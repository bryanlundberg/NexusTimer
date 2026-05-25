import { z } from 'zod'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'

export const deleteCollectionSchema = z.object({
  confirmationName: z.string().trim().min(1, 'You must enter the collection name')
})

export const updateCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
  category: z.enum(CUBE_CATEGORIES)
})

export type UpdateCollectionFormData = z.infer<typeof updateCollectionSchema>
export type DeleteCollectionFormData = z.infer<typeof deleteCollectionSchema>
