import { z } from 'zod'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'

export const deleteCollectionSchema = z.object({
  confirmDeletion: z.boolean().refine((value) => value, 'You must confirm before deleting')
})

export const updateCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  category: z.enum(CUBE_CATEGORIES)
})

export type UpdateCollectionFormData = z.infer<typeof updateCollectionSchema>
export type DeleteCollectionFormData = z.infer<typeof deleteCollectionSchema>
