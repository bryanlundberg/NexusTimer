import type { SVGProps } from 'react'

export default function PuzzleIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      {...props}
    >
      <path d="M3 3h18v18H3zM12 7L13.23 10.3L16.76 10.45L14 12.65L14.94 16.05L12 14.1L9.06 16.05L10 12.65L7.24 10.45L10.77 10.3Z" />
    </svg>
  )
}
