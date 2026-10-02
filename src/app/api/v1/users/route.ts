import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import User, { type UserDocument } from '@/entities/user/model/user'
import { getSession } from '@/shared/config/auth/session'
import { getBlockedEitherWayIds } from '@/entities/block/server/blocks'
import { getFriendIds } from '@/entities/friendship/server/friends'
import { resolvePrivacy } from '@/entities/privacy/model/types'
import { canViewStats } from '@/entities/privacy/server/stats-visibility'
import { withoutStats } from '@/entities/privacy/lib/without-stats'
import { ok, serverError } from '@/shared/api/responses'

const PER_PAGE = 25

const PUBLIC_PROJECTION = '-email -emailVerified -providers -privacy -__v'

const LIST_PROJECTION = '-email -emailVerified -providers -__v'

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const name = (searchParams.get('name') || '').trim()
    const country = (searchParams.get('country') || '').trim().toUpperCase()

    const session = await getSession()
    const viewerId = session?.user?.id
    const [hiddenIds, friendIds] = viewerId
      ? await Promise.all([getBlockedEitherWayIds(viewerId), getFriendIds(viewerId)])
      : [[], []]

    const query: Record<string, unknown> = {}
    if (hiddenIds.length) query._id = { $nin: hiddenIds }

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
        .lean<UserDocument[]>(),
      User.countDocuments(query)
    ])

    const friends = new Set(friendIds)
    const events = users.map(({ privacy, ...user }) => {
      const id = user._id.toString()
      const visible = canViewStats(resolvePrivacy(privacy).statsVisibility, id, viewerId, friends.has(id))
      return visible ? user : withoutStats(user)
    })

    return ok({
      events,
      page,
      pages: Math.ceil(docsCount / PER_PAGE),
      docs: docsCount
    })
  } catch (error) {
    return serverError('users:GET', error)
  }
}
