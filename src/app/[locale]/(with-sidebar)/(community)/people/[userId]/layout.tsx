import { STATIC_ROUTE_PLACEHOLDER } from '@nexustimer/contracts'

export function generateStaticParams() {
  return [{ userId: STATIC_ROUTE_PLACEHOLDER }]
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return children
}
