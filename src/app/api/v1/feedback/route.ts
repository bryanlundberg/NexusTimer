import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import Feedback from '@/entities/feedback/model/feedback'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { created, serverError } from '@/shared/api/responses'

const feedbackBodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, feedbackBodySchema)
    if (body instanceof Response) return body

    await connectDB()

    const feedback = await Feedback.create({
      userId,
      rating: body.rating,
      comment: body.comment || ''
    })

    return created(feedback)
  } catch (error) {
    return serverError('feedback:POST', error)
  }
}
