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

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(0, Number(searchParams.get('page')) || 0)
    const PER_PAGE = 50
    const name = searchParams.get('name') || ''
    const region = searchParams.get('region') || ''

    const query: Record<string, unknown> = {}

    if (name) {
      query.name = { $regex: name, $options: 'i' }
    }

    if (region && region !== 'all') {
      query.timezone = { $regex: `^${region}`, $options: 'i' }
    }

    const [users, docsCount] = await Promise.all([
      User.find(query)
        .limit(PER_PAGE)
        .skip(page * PER_PAGE)
        .sort({ 'backup.updatedAt': -1, createdAt: -1 }),
      User.find(query).countDocuments()
    ])

    return ok({
      events: users,
      page: page,
      pages: Math.ceil(docsCount / PER_PAGE) - 1 > 0 ? Math.ceil(docsCount / PER_PAGE) - 1 : 0,
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
