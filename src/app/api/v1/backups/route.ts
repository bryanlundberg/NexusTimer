import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/db/mongodb'
import User from '@/models/user'
import Backup from '@/models/backup'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    const { _id, data } = await request.json()
    if (!_id || !data) return NextResponse.json({ error: 'Incorrect params' }, { status: 400 })
    await connectDB()

    const session = await auth()
    if (!session || session.user.id !== _id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await User.findById(_id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const CHUNK_SIZE = 8 * 1024 * 1024
    const chunks: Buffer[] = []

    for (let i = 0; i < dataBuffer.length; i += CHUNK_SIZE) {
      chunks.push(Buffer.from(dataBuffer.slice(i, i + CHUNK_SIZE)))
    }

    await Backup.deleteMany({ user: _id })

    await Promise.all(
      chunks.map(async (chunk, index) => {
        return await Backup.create({
          user: _id,
          data: chunk,
          index: index
        })
      })
    )

    return NextResponse.json({
      user: _id,
      data
    })
  } catch (error) {
    console.error('Error creating backup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
