import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: '/people'
  }
}

export default function PeopleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
