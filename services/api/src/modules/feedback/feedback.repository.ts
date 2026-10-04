import type { FeedbackResponse } from '@nexustimer/contracts'
import type { Types } from 'mongoose'
import { userDocuments } from '../../infra/user-documents'
import { FeedbackModel } from './feedback.model'

export type NewFeedback = { userId: string; rating: number; comment: string }

export type FeedbackRepository = {
  create(feedback: NewFeedback): Promise<FeedbackResponse>
}

type RawFeedback = {
  _id: Types.ObjectId
  userId: Types.ObjectId
  rating: number
  comment?: string | null
  createdAt: Date
  updatedAt: Date
}

export const feedbackRepository: FeedbackRepository = {
  async create(feedback) {
    const doc = (await FeedbackModel.create(feedback)).toObject() as RawFeedback
    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      rating: doc.rating,
      comment: doc.comment ?? '',
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString()
    }
  }
}

export const feedbackUserData = userDocuments(FeedbackModel, ({ id }) => ({ userId: id }))
