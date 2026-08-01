import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import Feedback from '@/entities/feedback/model/feedback'
import User from '@/entities/user/model/user'
import Log, { LogType } from '@/entities/log/model/log'
import { sendFeedbackEmail } from '@/features/feedback/server/feedback-email'
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

    const user = await User.findById(userId, { email: 1, name: 1 }).lean<{ email: string; name: string }>()

    if (user) {
      sendFeedbackEmail({
        email: user.email,
        name: user.name,
        rating: body.rating,
        comment: body.comment
      }).catch(async (err) => {
        try {
          await Log.create({
            type: LogType.ApiError,
            message: err instanceof Error ? err.message : String(err),
            metadata: {
              source: 'feedback-email',
              email: user.email,
              stack: err instanceof Error ? err.stack : undefined
            }
          })
        } catch (logErr) {
          console.error('Failed to log feedback email error:', logErr)
        }
      })
    }

    return created(feedback)
  } catch (error) {
    return serverError('feedback:POST', error)
  }
}
