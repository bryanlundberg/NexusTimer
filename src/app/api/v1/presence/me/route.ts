import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'
import { PRESENCE_STATUSES, type PresenceStatus } from '@/shared/lib/realtime/events'
import { writePresenceStatus } from '@/shared/lib/realtime/presence'

const statusSchema = z.object({ status: z.enum(PRESENCE_STATUSES as [PresenceStatus, ...PresenceStatus[]]) })

export type PresenceStatusResponse = { status: PresenceStatus }

export async function PATCH(request: NextRequest) {
  const userId = await requireUser()
  if (userId instanceof Response) return userId

  const body = await parseJsonBody(request, statusSchema)
  if (body instanceof Response) return body

  try {
    await writePresenceStatus(userId, body.status)
    return ok<PresenceStatusResponse>({ status: body.status })
  } catch (error) {
    return serverError('presence:me:PATCH', error)
  }
}
