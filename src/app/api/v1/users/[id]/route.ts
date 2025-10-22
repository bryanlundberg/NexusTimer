import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/db/mongodb'
import User from '@/models/user'
import { auth } from '@/auth'
import { applyRateLimit, readLimiter, writeLimiter } from '@/lib/rate-limiter'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, writeLimiter)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const userId = (await params).id

    const session = await auth()
    if (!session || session.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 404 })
    }

    await connectDB()

    const { email, createdAt, updatedAt, __v, ...rest } = body
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { ...rest }, { new: true })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, readLimiter)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const userId = (await params).id

    if (!userId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 404 })
    }

    await connectDB()
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { email, createdAt, updatedAt, __v, ...rest } = user.toObject()

    return NextResponse.json(rest)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
