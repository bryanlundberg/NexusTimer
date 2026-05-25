import { Types } from 'mongoose'
import { z } from 'zod'

/** Validates a string as a MongoDB ObjectId. */
export const objectIdSchema = z.string().refine((v) => Types.ObjectId.isValid(v), 'Invalid ObjectId')
