import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import Backup from '@/entities/backup/model/backup'
import { requireUser } from '@/shared/api/require-user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { notFound, ok, serverError, unauthorized } from '@/shared/api/responses'

const backupBodySchema = z.object({
  _id: z.string().min(1),
  data: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const body = await parseJsonBody(request, backupBodySchema)
    if (body instanceof Response) return body

    if (userId !== body._id) return unauthorized()

    await connectDB()

    const user = await User.findById(body._id)
    if (!user) return notFound('User not found')

    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(body.data)
    const CHUNK_SIZE = 8 * 1024 * 1024
    const chunks: Buffer[] = []

    for (let i = 0; i < dataBuffer.length; i += CHUNK_SIZE) {
      chunks.push(Buffer.from(dataBuffer.slice(i, i + CHUNK_SIZE)))
    }

    await Backup.deleteMany({ user: body._id })

    await Promise.all(
      chunks.map(async (chunk, index) => {
        return await Backup.create({
          user: body._id,
          data: chunk,
          index: index
        })
      })
    )

    return ok({
      user: body._id,
      data: body.data
    })
  } catch (error) {
    return serverError('backups:POST', error)
  }
}
