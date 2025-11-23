import { z } from 'zod'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'

export const createCubeFormSchema = z.object({
  name: z.string().min(1, 'Required collection name').max(50, 'Maximum length is 50 characters'),
  category: z.enum(CUBE_CATEGORIES)
})

export const editCubeFormSchema = createCubeFormSchema.extend({
  id: z.string().min(1, 'Invalid cube ID')
})

export type CreateCubeFormData = z.infer<typeof createCubeFormSchema>
export type EditCubeFormData = z.infer<typeof editCubeFormSchema>
