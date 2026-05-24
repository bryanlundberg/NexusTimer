import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import mongoose from 'mongoose'
import { locales } from '@/shared/config/i18n/locales'
import connectDB from '@/shared/config/mongodb/mongodb'
import User from '@/entities/user/model/user'

type Props = { params: Promise<{ userId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  return {
    alternates: {
      canonical: `/people/${userId}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/people/${userId}`]))
    }
  }
}

export default async function UserLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  if (!mongoose.Types.ObjectId.isValid(userId)) notFound()

  await connectDB()
  const exists = await User.exists({ _id: userId })

  if (!exists) notFound()

  return <>{children}</>
}
