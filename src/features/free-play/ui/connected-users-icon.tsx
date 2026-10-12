import type { SVGProps } from 'react'

export default function ConnectedUsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="4" r="1.5" />
      <path d="M12 5.5v4.5" />
      <path d="m10.8 4.9-5.6 5.4" />
      <path d="m13.2 4.9 5.6 5.4" />
      <circle cx="4" cy="13.5" r="2" />
      <path d="M1 21a3 3 0 0 1 6 0" />
      <circle cx="12" cy="13.5" r="2" />
      <path d="M9 21a3 3 0 0 1 6 0" />
      <circle cx="20" cy="13.5" r="2" />
      <path d="M17 21a3 3 0 0 1 6 0" />
    </svg>
  )
}
