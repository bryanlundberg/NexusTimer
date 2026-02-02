import { SquarePen } from 'lucide-react'
import Link from 'next/link'
import { ALGORITHMS_GITHUB_URL } from '@/shared/const/algorithms-github-url'

export default function Suggestions({ message = '', link = ALGORITHMS_GITHUB_URL }) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="leading-7 [&:not(:first-child)]:mt-6 text-background-foreground hover:underline pb-5 flex items-center justify-center gap-2 text-sm w-fit"
    >
      <SquarePen size={16} />
      {message}
    </Link>
  )
}
