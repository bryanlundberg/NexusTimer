import { NextRequest } from 'next/server'
import connectDB from '@/shared/config/mongodb/mongodb'
import { auth } from '@/shared/config/auth/auth'
import { requireUser } from '@/shared/api/require-user'
import { noContent, notFound, ok, serverError } from '@/shared/api/responses'
import { isValidSlug } from '@/entities/shared-solve/lib/slug'
import type { SharedSolveDetail } from '@/entities/shared-solve/model/types'
import {
  deleteSharedSolve,
  getSharedSolveAuthor,
  getSharedSolveBySlug,
  isHiddenBetween
} from '@/entities/shared-solve/server/shared-solves'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    if (!isValidSlug(slug)) return notFound()

    await connectDB()

    const solve = await getSharedSolveBySlug(slug)
    if (!solve) return notFound()

    const session = await auth()
    const viewerId = session?.user?.id
    const [hidden, author] = await Promise.all([
      isHiddenBetween(solve.ownerId, viewerId),
      getSharedSolveAuthor(solve.ownerId)
    ])
    if (hidden || !author) return notFound()

    const detail: SharedSolveDetail = {
      ...solve.item,
      author,
      replay: solve.replay,
      isOwner: viewerId === solve.ownerId
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

    if (!(await deleteSharedSolve(userId, slug))) return notFound()

    return noContent()
  } catch (error) {
    return serverError('shared-solves/[slug]:DELETE', error)
  }
}
