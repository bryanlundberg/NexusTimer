import type { SVGProps } from 'react'

export default function HintBulbIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-testid="hint-bulb-icon"
      {...props}
    >
      <g transform="rotate(180 12 12)">
        <path d="M14.25 15.5c.15-.75.525-1.275 1.125-1.875.75-.675 1.125-1.65 1.125-2.625A4.5 4.5 0 0 0 7.5 11c0 .75.15 1.65 1.125 2.625.525.525.975 1.125 1.125 1.875" />
        <path d="M9.75 18.5h4.5" />
        <path d="M10.5 21.5h3" />
        <path d="M12 1.5v2" />
        <path d="M5.3 4.3l1.4 1.4" />
        <path d="M18.7 4.3l-1.4 1.4" />
        <path d="M2.5 11h2" />
        <path d="M19.5 11h2" />
      </g>
    </svg>
  )
}
