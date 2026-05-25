import { NextRequest } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'

const hashBodySchema = z.object({
  password: z.string().min(1)
})

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody(request, hashBodySchema)
    if (body instanceof Response) return body

    const hash = await bcrypt.hash(body.password.toUpperCase(), 10)
    return ok({ hash })
  } catch (error) {
    return serverError('rooms/hash-password:POST', error)
  }
}
