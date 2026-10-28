import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const BACK = 0.45
const DIM = 0.35

function Svg({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
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
      {children}
    </svg>
  )
}

export function TimerNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.5 2h5v2h-1.75v2h-1.5V4H9.5z" />
      <path d="M12 6a7.75 7.75 0 1 1 0 15.5A7.75 7.75 0 0 1 12 6zM11.25 9.25v5h1.5v-5z" />
    </Svg>
  )
}

export function SolvesNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 4h13v2h-13zM2.5 8.5h8v2h-8zM2.5 13h5v2h-5zM15.25 7.5h3v1.75h-3z" />
      <path d="M16.75 10a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM16 12.5v4.25h1.5V12.5z" />
    </Svg>
  )
}

export function StatsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 12.5h4.25v8H3.5zM9.875 7.5h4.25v13h-4.25zM16.25 3.5h4.25v17h-4.25z" />
    </Svg>
  )
}

export function CubeNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path transform="rotate(-8 12 5.25)" d="M2.75 2.5h5.5V8h-5.5zM9.25 2.5h5.5V8h-5.5zM15.75 2.5h5.5V8h-5.5z" />
      <path d="M2.75 9.5h5.5V15h-5.5zM9.25 9.5h5.5V15h-5.5zM15.75 9.5h5.5V15h-5.5zM2.75 16h5.5v5.5h-5.5zM9.25 16h5.5v5.5h-5.5zM15.75 16h5.5v5.5h-5.5z" />
    </Svg>
  )
}

export function SettingsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d="M10.75 2h2.5v4h-2.5z" transform={`rotate(${i * 45} 12 12)`} />
      ))}
      <path d="M12 5.25a6.75 6.75 0 1 1 0 13.5 6.75 6.75 0 0 1 0-13.5zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
    </Svg>
  )
}

export function TrainerNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        opacity={DIM}
        d="M2.75 2.75h5.5v5.5h-5.5zM15.75 2.75h5.5v5.5h-5.5zM2.75 15.75h5.5v5.5h-5.5zM15.75 15.75h5.5v5.5h-5.5z"
      />
      <path d="M9.25 2.75h5.5v5.5h-5.5zM2.75 9.25h5.5v5.5h-5.5zM9.25 9.25h5.5v5.5h-5.5zM15.75 9.25h5.5v5.5h-5.5zM9.25 15.75h5.5v5.5h-5.5z" />
    </Svg>
  )
}

export function AlgorithmsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        opacity={DIM}
        d="M2.75 2.75h5.5v5.5h-5.5zM9.25 2.75h5.5v5.5h-5.5zM15.75 2.75h5.5v5.5h-5.5zM2.75 9.25h5.5v5.5h-5.5zM9.25 9.25h5.5v5.5h-5.5zM15.75 9.25h5.5v5.5h-5.5zM2.75 15.75h5.5v5.5h-5.5zM9.25 15.75h5.5v5.5h-5.5zM15.75 15.75h5.5v5.5h-5.5z"
      />
      <path d="M6 11h12v2H6zM2.5 12L7 8.25v7.5zM21.5 12L17 8.25v7.5z" />
    </Svg>
  )
}

export function PeopleNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        opacity={BACK}
        d="M16.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM17 13a5.5 5.5 0 0 1 5 5.5v2h-4.25a8 8 0 0 0-2.4-7.35A5.5 5.5 0 0 1 17 13z"
      />
      <path d="M9 3.75a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5zM2.25 20.5a6.75 6.75 0 0 1 13.5 0z" />
    </Svg>
  )
}

export function FriendsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 3.75a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5zM2.25 20.5a6.75 6.75 0 0 1 10-5.9V20.5z" />
      <path d="M18 21.25l-3.55-3.5a2.25 2.25 0 0 1 3.55-2.75 2.25 2.25 0 0 1 3.55 2.75z" />
    </Svg>
  )
}

export function MessagesNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path opacity={BACK} d="M18 8h3.75v13.25l-4.25-3.25H10v-2.75h8z" />
      <path d="M2.75 3.25H16.5v10.25H8.25L2.75 17.75z" />
    </Svg>
  )
}

export function LeaderboardsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 2.5h12v6a6 6 0 0 1-12 0zM11 14.25h2v3.5h-2zM7 18h10v3.5H7z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        d="M6 4.5H3.5v1.5a3 3 0 0 0 3 3M18 4.5h2.5v1.5a3 3 0 0 1-3 3"
      />
    </Svg>
  )
}

export function FreePlayNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path opacity={BACK} d="M15 9.75h2l3 3v7.75H9.25V15H15z" />
      <path d="M3 3.25h7.75l3 3v7.5H3z" />
    </Svg>
  )
}
