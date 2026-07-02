import { NextRequest } from 'next/server'
import { z } from 'zod'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'
import { parseJsonBody } from '@/shared/api/parse-json'
import { ok, serverError } from '@/shared/api/responses'

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  image: z.string().min(1),
  provider: z.string().optional(),
  providerId: z.string().optional()
})

const PER_PAGE = 25

const LIST_PROJECTION = 'name image bio pronoun country goal wcaId wcaVerifiedAt lastSeenAt backup.updatedAt createdAt'

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const name = (searchParams.get('name') || '').trim()
    const country = (searchParams.get('country') || '').trim().toUpperCase()

    const query: Record<string, unknown> = {}

    if (name) {
      const regex = { $regex: escapeRegex(name), $options: 'i' }
      query.$or = [{ name: regex }, { wcaId: regex }]
    }

    if (country) {
      query.country = country
    }

    const [users, docsCount] = await Promise.all([
      User.find(query)
        .select(LIST_PROJECTION)
        .sort({ 'backup.updatedAt': -1, createdAt: -1 })
        .skip((page - 1) * PER_PAGE)
        .limit(PER_PAGE)
        .lean(),
      User.countDocuments(query)
    ])

    return ok({
      events: users,
      page,
      pages: Math.ceil(docsCount / PER_PAGE),
      docs: docsCount
    })
  } catch (error) {
    return serverError('users:GET', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await parseJsonBody(request, createUserSchema)
    if (body instanceof Response) return body

    const { email, name, image, provider, providerId } = body

    await connectDB()

    let user = await User.findOne({
      providers: {
        $elemMatch: { provider, providerId }
      }
    })

    if (user) return ok(user)

    user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { providers: { provider, providerId } } },
      {
        upsert: false,
        returnDocument: 'after'
      }
    )

    if (!user) {
      user = await User.create({ email, name, image, providers: [{ provider, providerId }] })
    }

    return ok(user)
  } catch (error) {
    return serverError('users:POST', error)
  }
}
