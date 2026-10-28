import type { SVGProps } from 'react'

export default function CategoryIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
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
      <path d="M2.5 4.5h7l2 2.5h10v14h-19zM2.5 9.25h19v1.25h-19z" />
    </svg>
  )
}
