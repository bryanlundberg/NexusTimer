import { connectDB } from '@/shared/config/mongodb'
import { Review } from '@/entities/review/model/review'
import type { ReviewListItem } from '@/entities/review/model/types'

interface ReviewRow {
  _id: unknown
  rating?: number
  comment?: string
  createdAt?: Date
  user?: { name?: string; email?: string }
}

export async function listReviews(): Promise<ReviewListItem[]> {
  await connectDB()

  const rows = await Review.aggregate<ReviewRow>([
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
        pipeline: [{ $project: { name: 1, email: 1 } }]
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $project: { rating: 1, comment: 1, createdAt: 1, 'user.name': 1, 'user.email': 1 } }
  ])

  return rows.map((row) => ({
    id: String(row._id),
    name: row.user?.name ?? '',
    email: row.user?.email ?? '',
    rating: row.rating ?? 0,
    comment: row.comment ?? '',
    createdAt: row.createdAt ?? new Date(0)
  }))
}
