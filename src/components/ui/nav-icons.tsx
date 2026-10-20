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
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      {...props}
    >
      {children}
    </svg>
  )
}

export function TimerNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M9.5 2.75h5M12 2.75V6M12 10v3.5" />
    </Svg>
  )
}

export function SolvesNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8.5 6H20M8.5 12H20M8.5 18H20M4 6h.5M4 12h.5M4 18h.5" />
    </Svg>
  )
}

export function StatsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.75 20.25V12.5h4v7.75M10 20.25V7.5h4v12.75M16.25 20.25V3.75h4v16.5M2.5 20.25h19" />
    </Svg>
  )
}

export function CubeNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.75 3.75h10l6.5 6.5v10H3.75z" />
    </Svg>
  )
}

export function TransferNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7.5h15M15 3.5l4 4-4 4M20 16.5H5M9 12.5l-4 4 4 4" />
    </Svg>
  )
}

export function SettingsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2.25" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d="M12 2.5V6" transform={`rotate(${i * 45} 12 12)`} />
      ))}
    </Svg>
  )
}

export function TrainerNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.75 9.5v5M5.25 7.25v9.5h2.5v-9.5zM7.75 12h8.5M16.25 7.25v9.5h2.5v-9.5zM21.25 9.5v5" />
    </Svg>
  )
}

export function AlgorithmsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.75 3.75h6.5v6.5h-6.5zM13.75 3.75h6.5v6.5h-6.5zM3.75 13.75h6.5v6.5h-6.5zM13.75 13.75h6.5v6.5h-6.5z" />
    </Svg>
  )
}

export function PeopleNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.75 20.25a6.25 6.25 0 0 1 12.5 0" />
      <path d="M15.5 4.9a3.25 3.25 0 0 1 0 6.2M18 14.6a6.25 6.25 0 0 1 3.25 5.65" />
    </Svg>
  )
}

export function FriendsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.75 20.25a6.25 6.25 0 0 1 9.5-5.35" />
      <path d="M18 20.5l-3.1-3.05a1.95 1.95 0 0 1 3.1-2.35 1.95 1.95 0 0 1 3.1 2.35z" />
    </Svg>
  )
}

export function MessagesNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.25 3.75h13v9.5H8.5l-5.25 4z" />
      <path d="M16.25 8h4.5v12.5l-4-3H9.5v-4.25" />
    </Svg>
  )
}

export function LeaderboardsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.75 20.25V12.5h6.5M9.25 20.25V6.75h5.5v13.5M14.75 15h6.5v5.25M2 20.25h20" />
    </Svg>
  )
}

export function FreePlayNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.25 3.75h7.5l3 3v7h-10.5z" />
      <path d="M13.75 9.75h3l3 3v7.5h-10.5v-3.5" />
    </Svg>
  )
}
