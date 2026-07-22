import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export function CategoryStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.2a2 2 0 0 1 1.6.8l1 1.2H18.5A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
    </Svg>
  )
}

export function CubeStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 4h12l4 4v12H4z" />
    </Svg>
  )
}

export function PersonalStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Svg>
  )
}

export function SmartStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 7 17 17 12 22V2l5 5L7 17" />
    </Svg>
  )
}
