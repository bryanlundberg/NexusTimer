import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { FRIEND_REQUEST_POLICIES, STATS_VISIBILITIES } from '@/entities/privacy/model/types'
import { getPrivacy } from '@/entities/privacy/server/privacy'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { badRequest, ok, serverError } from '@/shared/api/responses'

const updateSchema = z
  .object({
    friendRequests: z.enum(FRIEND_REQUEST_POLICIES),
    statsVisibility: z.enum(STATS_VISIBILITIES),
    readReceipts: z.boolean(),
    typingIndicator: z.boolean()
  })
  .partial()
  .strict()

export async function GET() {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    await connectDB()
    return ok(await getPrivacy(userId))
  } catch (error) {
    return serverError('privacy:GET', error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, updateSchema)
    if (body instanceof Response) return body

    const entries = Object.entries(body).filter(([, value]) => value !== undefined)
    if (entries.length === 0) return badRequest('Nothing to update')

    await connectDB()
    await User.updateOne(
      { _id: userId },
      { $set: Object.fromEntries(entries.map(([key, value]) => [`privacy.${key}`, value])) }
    )

    return ok(await getPrivacy(userId))
  } catch (error) {
    return serverError('privacy:PATCH', error)
  }
}
