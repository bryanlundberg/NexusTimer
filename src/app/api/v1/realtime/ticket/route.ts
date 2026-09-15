import { NextResponse } from 'next/server'
import { requireUser } from '@/shared/api/require-user'
import { ok } from '@/shared/api/responses'
import { createTicket } from '@/shared/lib/realtime/ticket'
import type { RealtimeTicketResponse } from '@/shared/lib/realtime/events'

export async function POST() {
  const userId = await requireUser()
  if (userId instanceof Response) return userId

  const url = process.env.REALTIME_URL
  const secret = process.env.REALTIME_SECRET
  // Realtime is optional; the client stops trying on 503
  if (!url || !secret) return NextResponse.json({ message: 'Realtime is not configured' }, { status: 503 })

  return ok<RealtimeTicketResponse>({ url, ticket: createTicket(userId, secret) })
}
