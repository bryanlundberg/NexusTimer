import { NextResponse } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { requireUser } from '@/shared/api/require-user'
import { ok } from '@/shared/api/responses'
import { createTicket } from '@/shared/lib/realtime/ticket'
import { isPresenceStatus, type RealtimeTicketResponse } from '@/shared/lib/realtime/events'
import { primePresenceStatus } from '@/shared/lib/realtime/presence'

export async function POST() {
  const userId = await requireUser()
  if (userId instanceof Response) return userId

  const url = process.env.REALTIME_URL
  const secret = process.env.REALTIME_SECRET
  // Realtime is optional; the client stops trying on 503
  if (!url || !secret) return NextResponse.json({ message: 'Realtime is not configured' }, { status: 503 })

  await primeStatus(userId)

  return ok<RealtimeTicketResponse>({ url, ticket: createTicket(userId, secret) })
}

async function primeStatus(userId: string): Promise<void> {
  try {
    await connectDB()
    const user = await User.findById(userId).select('presenceStatus').lean<{ presenceStatus?: string } | null>()
    await primePresenceStatus(userId, isPresenceStatus(user?.presenceStatus) ? user.presenceStatus : 'online')
  } catch (error) {
    console.error('ticket:primeStatus failed:', error)
  }
}
