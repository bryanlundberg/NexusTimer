import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      {children}
    </svg>
  )
}

/* Timer — solid stopwatch */
export function TimerNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="9" y="1.5" width="6" height="2.8" rx="1.4" />
      <path fillRule="evenodd" d="M12 5.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm1 3.5v5.5h-2V9h2Z" />
    </Svg>
  )
}

/* Solves — solid list of records */
export function SolvesNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4.6" width="18" height="3.6" rx="1.8" />
      <rect x="3" y="10.2" width="18" height="3.6" rx="1.8" />
      <rect x="3" y="15.8" width="18" height="3.6" rx="1.8" />
    </Svg>
  )
}

/* Statistics — ascending bars */
export function StatsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="11" width="5" height="10.5" rx="1.4" />
      <rect x="9.5" y="6" width="5" height="15.5" rx="1.4" />
      <rect x="16.5" y="2.5" width="5" height="19" rx="1.4" />
    </Svg>
  )
}

/* Cube — solid cut-corner cube */
export function CubeNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 3h11l7 7v11H3z" />
    </Svg>
  )
}

/* Transfer — two solid arrows */
export function TransferNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 5.5h10V3l7.5 4.5L13 12V9.5H3z" />
      <path d="M21 18.5H11V21l-7.5-4.5L11 12v2.5h10z" />
    </Svg>
  )
}

/* Settings — solid gear */
export function SettingsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x="10.6" y="1.4" width="2.8" height="4.2" rx="0.9" transform={`rotate(${i * 45} 12 12)`} />
      ))}
      <path
        fillRule="evenodd"
        d="M12 5.6a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8Zm0 3.8a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2Z"
      />
    </Svg>
  )
}

/* Trainer — solid dumbbell */
export function TrainerNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.4" y="8" width="2.8" height="8" rx="1.1" />
      <rect x="5.2" y="9.6" width="2.2" height="4.8" rx="0.9" />
      <rect x="7.2" y="10.6" width="9.6" height="2.8" rx="1.1" />
      <rect x="16.6" y="9.6" width="2.2" height="4.8" rx="0.9" />
      <rect x="18.8" y="8" width="2.8" height="8" rx="1.1" />
    </Svg>
  )
}

/* Algorithms — solid cube face (2x2) */
export function AlgorithmsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.4" />
      <rect x="13" y="3" width="8" height="8" rx="1.4" />
      <rect x="3" y="13" width="8" height="8" rx="1.4" />
      <rect x="13" y="13" width="8" height="8" rx="1.4" />
    </Svg>
  )
}

/* People — solid group */
export function PeopleNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="8.5" r="3.2" />
      <circle cx="16" cy="8.5" r="3.2" />
      <path d="M2.5 20.5a7 7 0 0 1 19 0 1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1z" />
    </Svg>
  )
}

/* Leaderboards — solid podium */
export function LeaderboardsNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="12" width="5.6" height="8.5" rx="1.2" />
      <rect x="9.2" y="6.5" width="5.6" height="14" rx="1.2" />
      <rect x="15.9" y="14.5" width="5.6" height="6" rx="1.2" />
    </Svg>
  )
}

/* Free play — two stacked cubes (multiplayer) */
export function FreePlayNavIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path fillRule="evenodd" d="M3 4h9l3 3v8H3zM9 9h9l3 3v8H9z" />
    </Svg>
  )
}
