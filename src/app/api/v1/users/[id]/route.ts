import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { auth } from '@/shared/config/auth/auth'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { email, __v, ...rest } = user.toObject()

    return NextResponse.json(rest)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
