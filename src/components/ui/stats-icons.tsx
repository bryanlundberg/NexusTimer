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

export function RollingAverageStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 12h18" />
      <circle cx="5.5" cy="7.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="10" cy="16.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="6.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="19" cy="15.5" r="1.7" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function BestTimeStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7.5 2.5 11 9.2M16.5 2.5 13 9.2" />
      <circle cx="12" cy="15" r="5.5" />
      <path d="M11 13.5l1.2-1v5" />
    </Svg>
  )
}

export function MeanStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 4h12" />
      <path d="M7 9l10 11M17 9 7 20" />
    </Svg>
  )
}

export function DeviationStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 19c3.5 0 5-12 9.5-12s6 12 9.5 12" />
      <path d="M8 14.5V19M16 14.5V19" />
    </Svg>
  )
}

export function TimeSpentStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3h12M6 21h12" />
      <path d="M7.5 3v3.2L12 12l4.5-5.8V3M7.5 21v-3.2L12 12l4.5 5.8V21" />
    </Svg>
  )
}

export function SuccessRateStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M8.5 12l2.5 2.5 6-6.5" />
    </Svg>
  )
}

export function CounterStatIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.5 5v14M9.5 5v14M13.5 5v14M17.5 5v14" />
      <path d="M3 16.5 20 7.5" />
    </Svg>
  )
}
