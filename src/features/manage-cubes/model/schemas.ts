import { z } from 'zod'

export const deleteCollectionSchema = z.object({
  confirmationName: z
    .string()
    .min(1, 'You must enter the collection name')
    .transform((val) => val.trim())
})

export type DeleteCollectionFormData = z.infer<typeof deleteCollectionSchema>
