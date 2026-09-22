import { NextRequest } from 'next/server'
import { Types } from 'mongoose'
import connectDB from '@/shared/config/mongodb/mongodb'
import { auth } from '@/shared/config/auth/auth'
import { ok, serverError } from '@/shared/api/responses'
import { isHiddenBetween, listUserSharedSolves } from '@/entities/shared-solve/server/shared-solves'
import type { SharedSolvesPage } from '@/entities/shared-solve/model/types'

const EMPTY: SharedSolvesPage = { items: [], total: 0, nextCursor: null }

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = (await params).id
    if (!Types.ObjectId.isValid(userId)) return ok(EMPTY)

    await connectDB()

    const session = await auth()
    if (await isHiddenBetween(userId, session?.user?.id)) return ok(EMPTY)

    const cursor = request.nextUrl.searchParams.get('cursor')
    return ok(await listUserSharedSolves(userId, cursor))
  } catch (error) {
    return serverError('users/[id]/shared-solves:GET', error)
  }
}
