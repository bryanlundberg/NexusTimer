import { STATIC_ROUTE_PLACEHOLDER } from '@nexustimer/contracts'

export function generateStaticParams() {
  return [{ slug: STATIC_ROUTE_PLACEHOLDER }]
}

export default function SharedSolveLayout({ children }: { children: React.ReactNode }) {
  return children
}
