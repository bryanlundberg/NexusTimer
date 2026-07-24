import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function baseProps({ size = 24 }: { size?: number }) {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  }
}

export function RegionIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3v18" />
      <path d="M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9" />
      <path d="M12 3c-2.6 2.5-4 5.7-4 9s1.4 6.5 4 9" />
    </svg>
  )
}

export function TimerIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <path d="M9.5 3h5" />
      <path d="M18.5 6.5 19.9 5.1" />
      <rect x="5" y="6" width="14" height="14" rx="4" />
      <path d="M12 13V9.5" />
      <path d="M12 13l3 1.6" />
      <circle cx="12" cy="13" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FeaturesIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <path d="M9 11.8 14 13.4 14 16.6 9 18.2 4 16.6 4 13.4Z" />
      <path d="M9 11.8V15" />
      <path d="M9 15 14 13.4" />
      <path d="M9 15 4 13.4" />
      <path d="M17 3.8 18 6 20.2 7 18 8 17 10.2 16 8 13.8 7 16 6Z" />
    </svg>
  )
}

export function AlertsIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <path d="M6 9a6 6 0 0 1 12 0c0 4.5 1.8 6 1.8 6H4.2S6 13.5 6 9z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
      <path d="M9.5 9h5" />
    </svg>
  )
}

export function SoundsIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <path d="M4 9.5v5h3l5 4V5.5l-5 4z" />
      <path d="M16 9.5a4 4 0 0 1 0 5" />
      <path d="M18.5 7a8 8 0 0 1 0 10" />
    </svg>
  )
}

export function ThemeIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M12 4v16" />
      <path d="M4 12h16" />
      <path d="M12 4h5a3 3 0 0 1 3 3v5h-8z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PreferencesIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
      <rect x="8.5" y="5.5" width="5" height="5" rx="1.2" />
      <rect x="13.5" y="13.5" width="5" height="5" rx="1.2" />
    </svg>
  )
}

export function PrivacyIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <rect x="11" y="13.4" width="2" height="2" rx="0.4" />
      <path d="M12 15.4v1.6" />
    </svg>
  )
}

export function ImportIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <path d="M4 15v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
      <path d="M12 15V4" />
      <path d="M8 8l4-4 4 4" />
    </svg>
  )
}

export function ExportIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <path d="M4 15v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
      <path d="M12 4v11" />
      <path d="M8 11l4 4 4-4" />
    </svg>
  )
}

export function DataIcon({ size, ...props }: IconProps) {
  return (
    <svg {...baseProps({ size })} {...props}>
      <path d="M12 3 20 7.5 12 12 4 7.5Z" />
      <path d="M4 7.5v7.5l8 4.5 8-4.5V7.5" />
      <path d="M4 11.5l8 4.5 8-4.5" />
      <path d="M12 12v7.5" />
    </svg>
  )
}
