import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import connectDB from '@/shared/config/mongodb/mongodb'
import formatTime from '@/shared/lib/formatTime'
import { isValidSlug } from '@/entities/shared-solve/lib/slug'
import { getSharedSolveAuthor, getSharedSolveBySlug } from '@/entities/shared-solve/server/shared-solves'

type Props = { params: Promise<{ slug: string }> }

const findSharedSolve = cache(async (slug: string) => {
  if (!isValidSlug(slug)) return null
  await connectDB()
  const solve = await getSharedSolveBySlug(slug)
  if (!solve) return null
  const author = await getSharedSolveAuthor(solve.ownerId)
  return author ? { ...solve.item, authorName: author.name } : null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const solve = await findSharedSolve(slug)
  if (!solve) return {}

  const time = solve.dnf ? 'DNF' : `${formatTime(solve.time)}${solve.plus2 ? '+' : ''}`
  const title = `${time} ${solve.puzzle} · ${solve.authorName}`
  const description = solve.scramble

  return {
    title,
    description,
    alternates: { canonical: `/s/${slug}` },
    openGraph: { title, description, url: `/s/${slug}`, type: 'article' },
    twitter: { card: 'summary', title, description }
  }
}

export default async function SharedSolveLayout({ children, params }: Props & { children: React.ReactNode }) {
  const { slug } = await params
  if (!(await findSharedSolve(slug))) notFound()
  return <>{children}</>
}
