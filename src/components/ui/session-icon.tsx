import type { SVGProps } from 'react'

export default function SessionIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
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
      <path d="M10.5 2h3v2.5h-3z" />
      <path d="M12 5.5a8 8 0 1 1 0 16 8 8 0 0 1 0-16zM10 10v7l6-3.5z" />
    </svg>
  )
}
