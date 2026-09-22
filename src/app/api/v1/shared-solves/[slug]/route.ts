import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import { auth } from '@/shared/config/auth/auth'
import { requireUser } from '@/shared/api/require-user'
import { noContent, notFound, ok, serverError } from '@/shared/api/responses'
import SharedSolve, { type SharedSolveDocument } from '@/entities/shared-solve/model/shared-solve'
import { isValidSlug } from '@/entities/shared-solve/lib/slug'
import type { SharedSolveDetail } from '@/entities/shared-solve/model/types'
import { isHiddenBetween, toSharedSolveItem } from '@/entities/shared-solve/server/shared-solves'
import { findFriendUsers } from '@/entities/friendship/server/friends'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    if (!isValidSlug(slug)) return notFound()

    await connectDB()

    const doc = await SharedSolve.findOne({ slug }).lean<SharedSolveDocument>()
    if (!doc) return notFound()

    const ownerId = doc.user.toString()
    const session = await auth()
    const viewerId = session?.user?.id
    if (await isHiddenBetween(ownerId, viewerId)) return notFound()

    const author = (await findFriendUsers([ownerId])).get(ownerId)
    if (!author) return notFound()

    const detail: SharedSolveDetail = {
      ...toSharedSolveItem(doc),
      author: { _id: author._id, name: author.name, image: author.image, country: author.country },
      replay: doc.replay,
      isOwner: viewerId === ownerId
    }

    return ok(detail)
  } catch (error) {
    return serverError('shared-solves/[slug]:GET', error)
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const userId = await requireUser()
    if (userId instanceof Response) return userId

    const { slug } = await params
    if (!isValidSlug(slug)) return notFound()

    await connectDB()

    const result = await SharedSolve.deleteOne({ slug, user: userId })
    if (result.deletedCount === 0) return notFound()

    return noContent()
  } catch (error) {
    return serverError('shared-solves/[slug]:DELETE', error)
  }
}
