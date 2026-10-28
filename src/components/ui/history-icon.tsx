import type { SVGProps } from 'react'

export default function HistoryIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M2.5 2.5h3.75v3.75H2.5zM13 2.5h3.75v3.75H13zM7.75 7.75h3.75v3.75H7.75zM18.25 7.75H22v3.75h-3.75zM2.5 13h3.75v3.75H2.5zM13 13h3.75v3.75H13zM18.25 13H22v3.75h-3.75zM7.75 18.25h3.75V22H7.75z" />
      <path
        opacity={0.35}
        d="M7.75 2.5h3.75v3.75H7.75zM18.25 2.5H22v3.75h-3.75zM2.5 7.75h3.75v3.75H2.5zM13 7.75h3.75v3.75H13zM7.75 13h3.75v3.75H7.75zM2.5 18.25h3.75V22H2.5zM13 18.25h3.75V22H13zM18.25 18.25H22V22h-3.75z"
      />
    </svg>
  )
}
