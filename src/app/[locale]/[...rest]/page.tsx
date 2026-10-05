import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return [{ rest: ['404'] }]
}

export default function CatchAllPage() {
  notFound()
}
